<?php

namespace App\Controller;

use App\Entity\Review;
use App\Entity\Vote;
use App\Repository\ReviewRepository;
use App\Repository\VoteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\Tools\Pagination\Paginator;

class ReviewController extends AbstractController
{
    #[Route('/api/reviews', name: 'get_reviews', methods: ['GET'])]
    public function getReviews(ReviewRepository $reviewRepository, VoteRepository $voteRepository, Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = 10;
        $sort = $request->query->get('sort');
    
        if ($sort === 'votes') {
            $reviewsQuery = $voteRepository->getReviewsSortedByPositiveVotesQuery($page, $limit);
            $results = $reviewsQuery->getResult();
    
            $reviewIds = array_column($results, 'reviewId');
            $reviews = $reviewRepository->findBy(['id' => $reviewIds]);
    
            $reviewsData = array_map(function ($review) use ($voteRepository) {
                return [
                    'id' => $review->getId(),
                    'title' => $review->getTitle(),
                    'image' => $review->getImage(),
                    'date' => $review->getDate()->format('Y-m-d'),
                    'username' => $review->getUser()->getUserIdentifier(),
                    'positiveVotes' => $voteRepository->countVotes($review->getId(), true),
                    'negativeVotes' => $voteRepository->countVotes($review->getId(), false)
                ];
            }, $reviews);
    
            // Calculez le nombre total de pages. Vous devrez peut-être ajuster cette logique.
            $totalVotesCount = count($results);
            $totalPages = ceil($totalVotesCount / $limit);
        } else {
            $reviewsQuery = $reviewRepository->createQueryBuilder('r')
                ->orderBy('r.date', 'DESC')
                ->setMaxResults($limit)
                ->setFirstResult(($page - 1) * $limit)
                ->getQuery();
            $paginator = new Paginator($reviewsQuery);
    
            $totalItems = count($paginator);
            $totalPages = ceil($totalItems / $limit);
    
            $reviewsData = array_map(function ($review) use ($voteRepository) {
                return [
                    'id' => $review->getId(),
                    'title' => $review->getTitle(),
                    'image' => $review->getImage(),
                    'date' => $review->getDate()->format('Y-m-d'),
                    'username' => $review->getUser()->getUserIdentifier(),
                    'positiveVotes' => $voteRepository->countVotes($review->getId(), true),
                    'negativeVotes' => $voteRepository->countVotes($review->getId(), false)
                ];
            }, iterator_to_array($paginator));
        }
    
        return new JsonResponse(['reviews' => $reviewsData,
        'totalPages' => $totalPages  ]);
        }
    
    #[Route('/api/reviews/add', name: 'add_review', methods: ['POST'])]
    public function addReview(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $title = $request->request->get('title');
        $date = new \DateTime;
        $uploadedFile = $request->files->get('image');
        $destination = $this->getParameter('kernel.project_dir').'/public/uploads';

        if (!$uploadedFile) {
            return new JsonResponse(['message' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($uploadedFile->getMimeType(), ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            return new JsonResponse(['message' => 'Invalid file type'], Response::HTTP_BAD_REQUEST);
        }

        if ($uploadedFile->getSize() > 3000000) {
            return new JsonResponse(['message' => 'File too large'], Response::HTTP_BAD_REQUEST);
        }

        $newFilename = uniqid().'.'.$uploadedFile->guessExtension();

        try {
            $uploadedFile->move($destination, $newFilename);
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
            return new JsonResponse(['message' => 'Could not save file'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $review = new Review();
        $review->setTitle($title);
        $review->setImage($newFilename);
        $review->setDate($date);
        $review->setUser($this->getUser()); 

        $entityManager->persist($review);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Review added'], Response::HTTP_CREATED);
    }

    #[Route('/api/vote', name: 'vote_review', methods: ['POST'])]
public function vote(Request $request, VoteRepository $voteRepository, EntityManagerInterface $entityManager): JsonResponse
{
    $user = $this->getUser();
    $data = json_decode($request->getContent(), true);
    $reviewId = $data['reviewId'];
    $voteType = $data['voteType'];

    $review = $entityManager->getRepository(Review::class)->find($reviewId);
    if (!$review) {
        return new JsonResponse(['message' => 'Review not found'], JsonResponse::HTTP_NOT_FOUND);
    }

    $existingVote = $voteRepository->findOneBy(['user' => $user, 'review' => $review]);
    if ($existingVote) {
        if ($existingVote->isType() === $voteType) {
            $entityManager->remove($existingVote);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Vote removed']);
        } else {
            $existingVote->setType($voteType);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Vote updated']);
        }
    } else {
        $vote = new Vote();
        $vote->setUser($user);
        $vote->setReview($review);
        $vote->setType($voteType);
        $entityManager->persist($vote);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Vote added']);
    }
}
    
}

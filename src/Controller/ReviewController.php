<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReviewController extends AbstractController
{
    #[Route('/reviews', name: 'get_reviews', methods: ['GET'])]
    public function getReviews(ReviewRepository $reviewRepository): JsonResponse
    {
        $reviews = $reviewRepository->findAll();
        $responseArray = [];
    
        foreach ($reviews as $review) {
            $responseArray[] = [
                'id' => $review->getId(),
                'title' => $review->getTitle(),
                'image' => $review->getImage(),
                'date' => $review->getDate()->format('Y-m-d')
            ];
        }
    
        return new JsonResponse($responseArray);
    }

    #[Route('/reviews/add', name: 'add_review', methods: ['POST'])]
    public function addReview(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $review = new Review();
        $review->setTitle($data['title']);
        $review->setImage($data['image']);
        $review->setDate(new \DateTime($data['date']));

        $entityManager->persist($review);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Review added'], Response::HTTP_CREATED);
    }
    
}

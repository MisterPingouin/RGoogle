<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReviewController extends AbstractController
{
    #[Route('/api/reviews', name: 'get_reviews', methods: ['GET'])]
    public function getReviews(ReviewRepository $reviewRepository): JsonResponse
    {
        $reviews = $reviewRepository->findAll();
        $responseArray = [];
    
        foreach ($reviews as $review) {
            $responseArray[] = [
                'id' => $review->getId(),
                'title' => $review->getTitle(),
                'image' => $review->getImage(),
                'date' => $review->getDate()->format('Y-m-d'),
                'username' => $review->getUser()->getUserIdentifier()
            ];
        }
    
        return new JsonResponse($responseArray);
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
    
}

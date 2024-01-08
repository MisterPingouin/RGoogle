<?php

namespace App\Controller;

use App\Repository\ReviewRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
    
}

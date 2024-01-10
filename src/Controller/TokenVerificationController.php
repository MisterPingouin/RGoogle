<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

#[Route('/verify-token', name: 'verify_token')]
class TokenVerificationController extends AbstractController
{
    public function __invoke(UserInterface $user = null): JsonResponse
    {
        if (!$user) {
            // Token non valide
            return $this->json(['message' => 'Token non valide'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Token valide
        return $this->json([
            'message' => 'Token valide', 
            'userIdentifier' => $user->getUserIdentifier() 
        ]);
    }
}

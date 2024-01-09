<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    private $entityManager;

    // Constructeur pour l'injection de l'EntityManager
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/registration', name: 'app_registration', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {
        // Récupération des données envoyées par le client (React)
        $data = json_decode($request->getContent(), true);

        // Création d'une nouvelle instance de l'entité User
        $user = new User();
        
        // Attribution du nom d'utilisateur (username) à partir des données reçues
        $user->setUsername($data['username']);

        // Hashage du mot de passe reçu et attribution au User
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Persistance de l'objet User pour le sauvegarder dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Réponse indiquant la création réussie de l'utilisateur
        return new Response(sprintf('User %s successfully created', $user->getUsername()));
    }
}

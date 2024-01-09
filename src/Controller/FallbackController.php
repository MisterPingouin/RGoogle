<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FallbackController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'react_fallback', requirements: ['reactRouting' => '^(?!api|build|_profiler|wdt|bundles).*'])]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }
    
}

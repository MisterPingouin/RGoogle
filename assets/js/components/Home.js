import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reviews from './Reviews'; 

const Home = () => {

    return (
      <>
      <header className="bg-blue-500 text-white p-6">
      <nav>
      <Link to="/add-review">Ajouter une Review</Link>
    </nav>
        <h1 className="text-3xl">Bienvenue sur notre page de Reviews</h1>
      </header>
      <main className="p-4">
        <Reviews />
      </main>
      </>
    );
  };

export default Home;

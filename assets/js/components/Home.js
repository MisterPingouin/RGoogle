import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Reviews from './Reviews';
import '../../styles/home.scss';

const Home = () => {
  const { auth, setAuth } = useAuth();

  console.log(auth); 

  const handleLogout = () => {
    setAuth({ token: null, username: null });
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <div>
          <Link to="/" className="mr-4">Accueil</Link>
          {auth.token && <Link to="/add-review" className="mr-4">Ajouter Review</Link>}
          {!auth.token && <Link to="/login">Login</Link>}
          {!auth.token && <Link to="/register" className="ml-4">Inscription</Link>}
        </div>
        {auth.token && (
          <div className="flex items-center">
            <span className="mr-4">Bonjour, {auth.username}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm">Déconnexion</button>
          </div>
        )}
      </nav>
      <header className="text-center p-6 mt-4">
        <h1 className="text-3xl font-bold">Bienvenue sur notre page de Reviews</h1>
      </header>
      <main className="p-4">
        <Reviews />
      </main>
    </div>
  );
};

export default Home;

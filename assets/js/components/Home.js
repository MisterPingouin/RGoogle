import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Reviews from './Reviews';
import '../../styles/home.scss';
import axios from 'axios';

const Home = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            try {
                const response = await axios.get('http://localhost:8000/verify-token', {
                    headers: { Authorization: `Bearer ${authData.token}` }
                });
                if (response.status === 200) {
                    setAuth({ token: authData.token, username: response.data.userIdentifier });
                }
            } catch (error) {
                console.error('Erreur de vérification d\'authentification:', error);
                setAuth({ token: null, username: null });
                localStorage.removeItem('auth');
            }
        }
    };

    verifyAuth();
}, [setAuth]);
  

  const handleLogout = async () => {
    // Déconnectez l'utilisateur côté client
    setAuth({ token: null, username: null });
    localStorage.removeItem('auth');

    try {
      await axios.post('http://localhost:8000/logout');
      console.log('Déconnexion réussie du côté serveur');
    } catch (error) {
      console.error('Erreur de déconnexion côté serveur:', error);
    }
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
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm" method="POST">Déconnexion</button>
          </div>
        )}
      </nav>
      <header className="text-center p-6 mt-4">
        <h1 className="text-3xl font-bold">Bienvenue sur notre page de Reviews</h1>
      </header>
      <main className="p-4 mx-auto max-w-4xl">
        <Reviews />
      </main>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ auth, handleLogout }) => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div>
        <Link to="/" className="mr-4">Accueil</Link>
        <Link to="/bestreviews" className="ml-4 mr-4">Best reviews</Link>
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
  );
};

export default Navbar;

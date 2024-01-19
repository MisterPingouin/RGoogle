import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useCycle } from 'framer-motion';

const Navbar = ({ auth, handleLogout }) => {
  const [isOpen, cycleOpen] = useCycle(false, true);
  const navigate = useNavigate(); 

  const handleLinkClick = (to) => {
    navigate(to); 
    cycleOpen(); 
  };

  const links = [
    { name: "Accueil", to: "/", id: 1 },
    { name: "Best Reviews", to: "/bestreviews", id: 2 },
    auth.token ? { name: "Ajouter Review", to: "/add-review", id: 3 } : null,
    !auth.token ? { name: "Login", to: "/login", id: 4 } : null,
    !auth.token ? { name: "Inscription", to: "/register", id: 5 } : null,
  ].filter(link => link !== null);

  // Variants pour les animations d'opacité des éléments de menu
  const itemVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  // Variants pour les animations de transition du menu latéral
  const sideVariants = {
    closed: {
      transition: { staggerChildren: 0.2, staggerDirection: -1 }
    },
    open: {
      transition: { staggerChildren: 0.2, staggerDirection: 1 }
    }
  };

  // Variants pour la première ligne du menu burger (transforme en "X")
  const lineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 5 },
  };
  
  const lineVariants2 = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  
  const lineVariants3 = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -5 },
  };
  

  const transition = {
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  return (
    <div className="flex flex-col ">
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <div className="md:hidden ml-auto">
        <button onClick={cycleOpen} className="flex flex-col space-y-1 z-50 relative">
          <motion.div
  className="w-7 h-0.5 bg-white"
  variants={lineVariants}
  animate={isOpen ? "open" : "closed"}
  transition={transition}
/>
<motion.div
  className="w-7 h-0.5 bg-white"
  variants={lineVariants2}
  animate={isOpen ? "open" : "closed"}
  transition={transition}
/>
<motion.div
  className="w-7 h-0.5 bg-white"
  variants={lineVariants3}
  animate={isOpen ? "open" : "closed"}
  transition={transition}
/>

          </button>
        </div>
        {/* Liens de navigation pour le mode desktop */}
        <div className="hidden md:flex text-white">
          {links.map(({ name, to, id }) => (
            <Link key={id} to={to} className="mr-4">
              {name}
            </Link>
          ))}
          {/* Affichage conditionnel pour l'utilisateur authentifié */}
          {auth.token && (
            <div className="flex items-center">
              <span className="mr-4">Bonjour, {auth.username}</span>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm">Déconnexion</button>
            </div>
          )}
        </div>
      </nav>
      {/* Animation de présence pour le menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="absolute top-0 right-0 w-2/3 h-full bg-blue-500 shadow-lg z-40 md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { delay: 0.1, duration: 0.3 } }}
            variants={sideVariants}
          >
            <motion.div className="flex flex-col text-white items-start p-4">
              {links.map(({ name, to, id }) => (
                <motion.a
                  key={id}
                  className="py-2"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleLinkClick(to)}
                  variants={itemVariants}
                >
                  {name}
                </motion.a>
              ))}
              {auth.token && (
                <motion.button
                  onClick={handleLogout}
                  className="py-2"
                  whileHover={{ scale: 1.1 }}
                  variants={itemVariants}
                >
                  Déconnexion
                </motion.button>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

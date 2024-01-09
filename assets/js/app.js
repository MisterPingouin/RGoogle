import React from 'react';
import Reviews from './components/Reviews'; 

function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-6">
        <h1 className="text-3xl">Bienvenue sur notre page de Reviews</h1>
      </header>
      <main className="p-4">
        <Reviews />
      </main>
    </div>
  );
}

export default App;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            console.log('Sending registration data:', { username, password });
            const response = await axios.post('http://localhost:8000/registration', { username, password });
            console.log('Received response:', response);

            if (response.status === 201) {
                navigate('/login');
            } else {
                setErrorMsg('Échec de l\'inscription. Réponse inattendue du serveur.');
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            setErrorMsg(error.response?.data?.error || 'Erreur d\'inscription inconnue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Nom d'utilisateur
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        S'inscrire
                    </button>
                </div>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </form>
            {isLoading && <p>Loading...</p>}
        </div>
    );
}

export default Register;

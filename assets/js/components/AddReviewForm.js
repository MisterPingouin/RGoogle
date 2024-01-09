import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddReviewForm = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    // Créer un aperçu de l'image dès qu'une nouvelle image est sélectionnée
    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        // Nettoyer l'URL de l'aperçu lorsque le composant est démonté
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!title || !image) {
            setError('Please fill in all fields and select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:8000/api/reviews/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Review added successfully');
            // Reset form ou redirection
            setTitle('');
            setImage(null);
            setPreview(null);
        } catch (error) {
            console.error('There was an error adding the review', error);
            setError(error.response.data.message || 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input 
                className="p-2 border rounded"
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
            />
            <input 
                className="p-2 border rounded"
                type="file" 
                onChange={(e) => setImage(e.target.files[0])}
            />
            {preview && <img src={preview} alt="Preview" className="max-w-xs h-auto my-2" />}
            {error && <p className="text-red-500">{error}</p>}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Add Review</button>
        </form>
    );
};

export default AddReviewForm;

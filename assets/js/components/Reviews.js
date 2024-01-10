import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadReviews = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reviews?page=${page}`);
            setReviews(response.data.reviews);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Il y a eu un problème avec la requête', error);
        }
    };

    useEffect(() => {
        loadReviews(currentPage);
    }, [currentPage]);

    return (
        <div>
            {reviews.map(review => (
                <div key={review.id} className="mb-4 p-2 border rounded">
                    <h2 className="text-lg font-bold">{review.title}</h2>
                    <img src={`/uploads/${review.image}`} alt={review.title} className="w-full h-auto" />
                    <p>Posté par: {review.username}</p>
                    <p>Date: {review.date}</p>
                </div>
            ))}
            <div className="flex justify-between items-center my-4">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    Précédent
                </button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Reviews;

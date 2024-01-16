import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BestReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadReviews = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reviews?page=${page}&sort=votes`);
            setReviews(response.data.reviews);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erreur lors du chargement des meilleures reviews', error);
        }
    };

    const handleVote = async (reviewId, voteType) => {
        try {
            await axios.post(`http://localhost:8000/api/vote`, { reviewId, voteType });
            loadReviews(currentPage);
        } catch (error) {
            console.error('Erreur lors du vote', error);
        }
    };

    useEffect(() => {
        loadReviews(currentPage);
    }, [currentPage]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Meilleures Reviews</h2>
            {reviews.map(review => (
                <div key={review.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold">{review.title}</h3>
                    <img src={`/uploads/${review.image}`} alt={review.title} className="w-full h-auto my-2" />
                    <p className="text-sm text-gray-600">Posté par: {review.username}</p>
                    <p className="text-sm text-gray-600 ">Date: {review.date}</p>
                    <div>
                        <button 
                            onClick={() => handleVote(review.id, true)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Vote +
                        </button>
                        <span className="mr-4">{review.positiveVotes}</span>
                        <button 
                            onClick={() => handleVote(review.id, false)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Vote -
                        </button>
                        <span>{review.negativeVotes}</span>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center my-4">
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    Précédent
                </button>
                <span className="text-sm font-semibold">Page {currentPage} sur {totalPages}</span>
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

export default BestReviews;

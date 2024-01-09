import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/reviews')
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Il y a eu un problème avec la requête', error);
            });
    }, []);

    return (
        <div>
            {reviews.map(review => (
                <div key={review.id}>
                    <h2>{review.title}</h2>
                    <img src={review.image} alt={review.title} />
                    <p>Date: {review.date}</p>
                </div>
            ))}
        </div>
    );
}

export default Reviews;

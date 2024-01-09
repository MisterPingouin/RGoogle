import React, { useState } from 'react';
import axios from 'axios';

const AddReviewForm = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:8000/reviews/add', { title, image, date });
            alert('Review added successfully');
            // Reset form ou redirection
        } catch (error) {
            console.error('There was an error adding the review', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="Image URL" 
                value={image} 
                onChange={(e) => setImage(e.target.value)}
            />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Add Review</button>
        </form>
    );
};

export default AddReviewForm;

import React, { useState } from 'react';
import axios from 'axios';

const AddReviewForm = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!image) {
            setError('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('date', date);

        try {
            await axios.post('http://localhost:8000/reviews/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Review added successfully');
            // Reset form ou redirection
        } catch (error) {
            console.error('There was an error adding the review', error);
            setError(error.response.data.message || 'An error occurred');
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
                type="file" 
                onChange={(e) => setImage(e.target.files[0])}
            />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Add Review</button>
        </form>
    );
};

export default AddReviewForm;

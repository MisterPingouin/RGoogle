import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login'; 
import Register from './components/Register'; 
import '../styles/app.css';
import AddReviewPage from './components/AddReviewPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-review" element={<AddReviewPage />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/register" element={<Register />} />  
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;

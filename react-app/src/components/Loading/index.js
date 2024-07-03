import React from 'react';
import './loading.css';
import { useLoading } from '../context/LoadingContext';

const Loading = () => {
    const { isLoading } = useLoading();
    if (!isLoading) return null;

    return (
        <div className="loading-wrapper">
            <div className="loading-spinner">
                <i className="fas fa-spinner"></i>
            </div>
            <div className="loading-text">Loading...</div>
        </div>
    );
};

export default Loading;

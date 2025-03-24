import React, { useEffect } from 'react';

const Toast = ({ show, message, type, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'bi-check-circle-fill';
            case 'error':
                return 'bi-x-circle-fill';
            default:
                return 'bi-info-circle-fill';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#28a745';
            case 'error':
                return '#dc3545';
            default:
                return '#17a2b8';
        }
    };

    return (
        <div className="toast-container">
            <div 
                className={`custom-toast ${show ? 'show' : ''}`}
                style={{
                    backgroundColor: getBackgroundColor()
                }}
            >
                <div className="toast-content">
                    <i className={`bi ${getIcon()} toast-icon`}></i>
                    <span className="toast-message">{message}</span>
                </div>
                <button 
                    className="toast-close"
                    onClick={onClose}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
        </div>
    );
};

export default Toast; 
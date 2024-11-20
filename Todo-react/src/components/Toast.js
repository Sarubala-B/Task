
import React, { useEffect } from 'react';
import './Toast.css';

const typeClassMap = {
    info: 'toast-info',
    failure: 'toast-error',
    success: 'toast-success',
    warning: 'toast-warning',
};
function Toast({ message,status, onClose }) {
    useEffect(() => {
       const timer = setTimeout(onClose, 3000);
       return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;
    const toastClassName = `toast ${typeClassMap[status] || 'toast-success'}`;
    return (
        <div className={toastClassName}>
            {message}
        </div>
    );
}

export default Toast;

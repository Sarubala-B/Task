
import React from 'react';
import Button from './Button';
import './ConfirmationDialog.css'; 

function ConfirmationDialog({ message, taskName, onConfirm, onCancel }) {
    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <p>{message}</p>
                    <div className="task-name">
                        <strong>Task:</strong> "{taskName}"
                    </div>
                <div className="confirmation-buttons">
                    <Button
                    label="Yes"
                    className="yes-button"
                    onClick={onConfirm}
                    />
                    <Button
                    label="No"
                    className="no-button"
                    onClick={onCancel}
                    />
                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;

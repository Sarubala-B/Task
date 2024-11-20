
import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

function TaskCheckbox({ task, onToggle, tab }) {
    const [showDialog, setShowDialog] = useState(false);

    const handleCheckboxChange = () => {
        setShowDialog(true);
    };

    const handleConfirm = () => {
        setShowDialog(false);
        onToggle(task, task.status==0 ? 1 : 0);
    };

    const handleCancel = () => {
        setShowDialog(false);
    };

    return (
        <>
        <input
        type="checkbox"
        checked={task.status === 1 ? true : false}
        onChange={handleCheckboxChange}
        />
        {showDialog && (
            <ConfirmationDialog
            message={
                task.status === 0
                ? 'Are you sure you want to mark the task as completed?'
                : 'Are you sure you want to revert the task to In-progress?'
            }
            taskName={task.taskName}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            />
        )}
        </>
    );
} //<> is shorthand without adding extra html element like div ,span

export default TaskCheckbox;

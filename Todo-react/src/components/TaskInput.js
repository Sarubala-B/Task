import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; 
import './TaskInput.css';import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; 
import './TaskInput.css';

function TaskInput({ onAddTask,editMode, taskToEdit, taskStatus}) {
    console.log("taskStatus", taskStatus)
    const [task, setTask] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null); //useRef avoids re-render when the value changes
    useEffect(() => {
        if (editMode && taskToEdit) {
            setTask(taskToEdit.taskName); 
            inputRef.current.focus(); //set the focus for typing for placing the cursor
            inputRef.current.setSelectionRange(taskToEdit.taskName.length, taskToEdit.taskName.length);
        } else {
            // Reset input field and button when not in edit mode
            setTask('');
            setErrorMessage('');
        }
    }, [editMode, taskToEdit]);

    useEffect(() =>{
        console.log("taskStatus-1", taskStatus)
        if(taskStatus=="success"){
            setTask('');
        }
    }, [taskStatus]);
    const handleInputChange = (e) => { //input field's onchange event
        let value = e.target.value.trimStart(); //prevent spaces from begining
        value = value.replace(/\s+/g, ' ');  //replaces many whitespace to single space
        const specialCharPattern = /[.,/<>?;':"{}[\]()!@#$%^&*~+=_-]/g;
        if (specialCharPattern.test(value)) {
            setErrorMessage('*Special Characters are not Allowed*');
            setTask(value.replace(specialCharPattern, ''));
        } else {
            setErrorMessage('');
            setTask(value); 
        }
    };
    const handleAddTask = () => {
        const trimmedTask = task.trim().replace(/\s+/g, ' ');
        console.log("trimmedTask", trimmedTask)
        if (trimmedTask === '') {
            onAddTask('', 'failure');
        } else {
            onAddTask(trimmedTask, 'success');
            // setTask('');
            setErrorMessage(''); // Clear the error message after adding the task
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        } else {
            // This else statement is added for coverage purposes only.
            console.warn(`Unhandled key press: ${e.key}`);
        }
    };
    return (
        <div className="task-input-container">
            <div className="input-button-container">
                <input
                type="text"
                className="task-input"
                placeholder="Enter the task"
                value={task}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                />    
                <Button
                onClick={handleAddTask} 
                label={editMode ? "Save" : "Add"} 
                className="add-task-button" 
                />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>} 
        </div>
    ); //checks for the truthness of errorMessage and then p tag will render
}

export default TaskInput;

function TaskInput({ onAddTask,editMode, taskToEdit, taskStatus}) {
    console.log("taskStatus", taskStatus)
    const [task, setTask] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null); //useRef avoids re-render when the value changes
    useEffect(() => {
        if (editMode && taskToEdit) {
            setTask(taskToEdit.taskName); 
            inputRef.current.focus(); //set the focus for typing for placing the cursor
            inputRef.current.setSelectionRange(taskToEdit.taskName.length, taskToEdit.taskName.length);
        } else {
            // Reset input field and button when not in edit mode
            setTask('');
            setErrorMessage('');
        }
    }, [editMode, taskToEdit]);

    useEffect(() =>{
        console.log("taskStatus-1", taskStatus)
        if(taskStatus=="success"){
            setTask('');
        }
    }, [taskStatus]);
    const handleInputChange = (e) => { //input field's onchange event
        let value = e.target.value.trimStart(); //prevent spaces from begining
        value = value.replace(/\s+/g, ' ');  //replaces many whitespace to single space
        const specialCharPattern = /[.,/<>?;':"{}[\]()!@#$%^&*~+=_-]/g;
        if (specialCharPattern.test(value)) {
            setErrorMessage('*Special Characters are not Allowed*');
            setTask(value.replace(specialCharPattern, ''));
        } else {
            setErrorMessage('');
            setTask(value); 
        }
    };
    const handleAddTask = () => {
        const trimmedTask = task.trim().replace(/\s+/g, ' ');
        console.log("trimmedTask", trimmedTask)
        if (trimmedTask === '') {
            onAddTask('', 'failure');
        } else {
            onAddTask(trimmedTask, 'success');
            // setTask('');
            setErrorMessage(''); // Clear the error message after adding the task
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        } else {
            // This else statement is added for coverage purposes only.
            console.warn(`Unhandled key press: ${e.key}`);
        }
    };
    return (
        <div className="task-input-container">
            <div className="input-button-container">
                <input
                type="text"
                className="task-input"
                placeholder="Enter the task"
                value={task}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                />    
                <Button
                onClick={handleAddTask} 
                label={editMode ? "Save" : "Add"} 
                className="add-task-button" 
                />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>} 
        </div>
    ); //checks for the truthness of errorMessage and then p tag will render
}

export default TaskInput;

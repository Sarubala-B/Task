import React, { useState, useEffect, useRef} from 'react';
import './Header.css';
import TaskInput from './TaskInput';
import Tabs from './Tabs';
import Button from './Button';
import TaskCheckbox from './TaskCheckbox';
import ConfirmationDialog from './ConfirmationDialog';
import Toast from './Toast';
import Login from '../App';

function Apps() {
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [editMode, setEditMode] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [editTaskId, setEditTaskId] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [toastStatus, setToastStatus] = useState({status:"", message:""});
    const [toastType, setToastType] = useState('success');
    const taskListRef = useRef(null);
    const [allCount, setAllCount] = useState(null);
    const [inprogressCount, setInProgressCount] = useState(null);
    const [completedCount, setCompletedCount] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    
    useEffect(() => {
        if (taskListRef.current) {
            taskListRef.current.scrollTop = 0;
        }
    }, [tasks]);

    useEffect(() => {
        getTodos();
    }, [activeTab]);

    const handleLogout = () => {
        // Implement the logout functionality here
        sessionStorage.clear();
        setShowLogin(true)
    };

    const handleEditTask = (task) => {
        setEditMode(true);
        setTaskToEdit(task);
        setEditTaskId(task.id);
    };

    const handleAddTask = async (taskName) => {
    
        if (taskName.trim() === '') {
            setToastStatus({status: "warning", message:"Task cannot be empty"})
            return;
        }
    
        let updatedTasks;
    
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('accessToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
                body: JSON.stringify({ taskName: taskName}), // Send only the new task
            });
            const data = await response.json();
            if(data.status=="success"){
                setToastStatus({status: data.status, message:data.message});
                getTodos();
            }else{
                setToastStatus({status: data.status, message:data.message})
                if(data.message=="Token Expired"){
                    getRefreshToken();
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setToastStatus({status: "failure", message:"Error saving task to database"})
        }
    };

    const handleUpdateTask = async (taskName) => {
    
        if (taskName.trim() === '') {
            setToastStatus({status: "warning", message:"Task cannot be empty"})
            return;
        }
    
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/updateTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('accessToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
                body: JSON.stringify({id: editTaskId, taskName: taskName}), // Send only the new task
            });
    
            const data = await response.json();
            if(data.status=="success"){
                setToastStatus({status: data.status, message:data.message});
                setEditMode(false);
                setTaskToEdit(null);
                setEditTaskId(null);
                getTodos();
            }else{
                setToastStatus({status: data.status, message:data.message})
                if(data.message=="Token Expired"){
                    getRefreshToken();
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setToastStatus({status: "failure", message:"Error saving task to database"})
        }
    };

    const getTodos = async() =>{
        try {
            const response = await fetch('http://localhost:5000/api/todos/'+activeTab, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('accessToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task to the database');
            }
    
            const data = await response.json();
            if(data.status=="success"){
                setTasks(data.data.reverse());
                setAllCount(data.all_count);
                setInProgressCount(data.inprogress_count);
                setCompletedCount(data.completed_count);
            }else{
                setToastStatus({status: data.status, message:data.message})
                if(data.message=="Token Expired"){
                    getRefreshToken();
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setToastStatus({status: "failure", message:"Error saving task to database"})
        }
    }
    
    const handleToastClose = () => {
        setToastStatus({status: "", message:""})
    };

    const handleToggleTaskStatus = async(task, taskStatus) => {
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('accessToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
                body: JSON.stringify({id: task.id, status: taskStatus}), // Send only the new task
            });
            const data = await response.json();
            if(data.status=="success"){
                setToastStatus({status: data.status, message:data.message});
                getTodos();
            }else{
                setToastStatus({status: data.status, message:data.message})
                if(data.message=="Token Expired"){
                    getRefreshToken();
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setToastStatus({status: "failure", message:"Error saving task to database"})
        }
    };

    const handleDeleteTask = async (taskToDelete) => {
        try {
            const response = await fetch('http://localhost:5000/api/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('accessToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
                body: JSON.stringify({ id: taskToDelete.id }) // Sending the task ID in the body
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete task from the database');
            }
    
            const data = await response.json();
            if (data.status === "success") {
                setToastStatus({ status: data.status, message: data.message });
                setTaskToDelete(null); // Clear the selected task to delete
                getTodos(); // Refresh the list of tasks
            } else {
                setToastStatus({ status: data.status, message: data.message });
                if (data.message === "Token Expired") {
                    getRefreshToken(); // Handle token refresh if needed
                }
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            setToastStatus({ status: "failure", message: "Error deleting task from database" });
        }
    };
    
    const getRefreshToken = async() => {
        try {
            const response = await fetch('http://localhost:5000/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('refreshToken'),
                    'UserId': sessionStorage.getItem('userId')
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task to the database');
            }
    
            const data = await response.json();
            if(data.status=="success"){
                sessionStorage.setItem("accessToken", data.data.accessToken)
            }else{
                setToastStatus({status: data.status, message:data.message})
                handleLogout();
            }
        } catch (error) {
            console.error('Error saving task:', error);
            setToastStatus({status: "failure", message:"Error saving task to database"})
        }
    };


    const handleOpenDeleteDialog = (task) => {
        setTaskToDelete(task);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            handleDeleteTask(taskToDelete);
            // Reset edit mode and clear taskToEdit
            if (taskToDelete === taskToEdit) {
                setEditMode(false);
                setTaskToEdit(null);
            }
        }
    };

    const taskCounts = {
        all_count: tasks.length,
        inprogress_count: tasks.length,
        completed_count: tasks.length
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'All') return true;
        if (activeTab === 'In-progress') return task.status === 'In-progress';
        if (activeTab === 'Completed') return task.status === 'Completed';
        return false;
    });

    return (
        <>
            {showLogin ? 
                <Login />
            :
                <div className="MainContent">
                    <div className="App">
                        <header className="App-header">
                            <h1>Todo List</h1>
                            <Button 
                                label="Logout" 
                                className="logout-button" 
                                onClick={handleLogout} 
                            />
                        </header>
                        <TaskInput
                            onAddTask={editMode ? handleUpdateTask : handleAddTask}
                            editMode={editMode}
                            taskToEdit={taskToEdit}
                            taskStatus={toastStatus.status}
                        />
                        <Tabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            allCount={allCount}
                            inprogressCount={inprogressCount}
                            completedCount={completedCount}
                        />
                        <Toast message={toastStatus.message} status={toastStatus.status} onClose={handleToastClose} />
                        <div className="task-list-header">
                            <h2 className="task-list-heading">List of Tasks</h2>
                            <h2 className="task-actions-heading">Actions</h2>
                        </div>

                        {tasks.length === 0 ? (
                            <p className="no-tasks-message">No Tasks Available</p>
                        ) : (
                            <div className="task-list" ref={taskListRef}>
                                {tasks.map((task) => {
                                    const originalIndex = tasks.indexOf(task);
                                    return (
                                        <div key={originalIndex} className="task-container">
                                            <div className="task-content">
                                                <TaskCheckbox
                                                    task={task}
                                                    onToggle={(task, taskStatus)=>handleToggleTaskStatus(task, taskStatus)}
                                                    onDelete={handleOpenDeleteDialog}
                                                    tab={activeTab}
                                                />
                                                <p className="task-name">{task.taskName}</p>
                                                <div className="task-actions">
                                                    <Button label="Edit" className="edit-button" onClick={() => handleEditTask(task)} />
                                                    <Button label="Delete" className="delete-button" onClick={() => handleOpenDeleteDialog(task)} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {taskToDelete && (
                            <ConfirmationDialog
                                message={`Are you sure you want to delete this task?`}
                                taskName={taskToDelete.taskName}
                                onConfirm={handleConfirmDelete}
                                onCancel={() => setTaskToDelete(null)}
                            />
                        )}
                    </div>
                </div>
            }
        </>
    );
}


export default Apps;

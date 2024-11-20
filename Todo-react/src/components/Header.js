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
    const [inProgressCount, setInProgressCount] = useState(null);
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
        console.log('Logging out...');
        localStorage.clear();
        setShowLogin(true)
    };

    const handleEditTask = (task) => {
        console.log("handleEditTask", task)
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
    
        // Switch to 'All' tab when a new task is added
        if (activeTab !== 'All') {
            setActiveTab('All');
        }
    
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken'),
                    'UserId': localStorage.getItem('userId')
                },
                body: JSON.stringify({ taskName: taskName}), // Send only the new task
            });
    console.log("response", response)
            const data = await response.json();
            console.log('data:', data);
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
        console.log("updatetask", taskName)
    
        if (taskName.trim() === '') {
            setToastStatus({status: "warning", message:"Task cannot be empty"})
            return;
        }
    
        // Switch to 'All' tab when a new task is added
        if (activeTab !== 'All') {
            setActiveTab('All');
        }
    
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/updateTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken'),
                    'UserId': localStorage.getItem('userId')
                },
                body: JSON.stringify({id: editTaskId, taskName: taskName}), // Send only the new task
            });
    console.log("response", response)
    
            const data = await response.json();
            console.log('data:', data);
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
            console.log("active", activeTab)
            const response = await fetch('http://localhost:5000/api/todos/'+activeTab, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken'),
                    'UserId': localStorage.getItem('userId')
                },
            });
    console.log("response", response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task to the database');
            }
    
            const data = await response.json();
            console.log('data:', data);
            if(data.status=="success"){
                setTasks(data.data.reverse());
                setAllCount(data.all);
                setInProgressCount(data.inprogress);
                setCompletedCount(data.completed);
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
        console.log("task jjj", task, taskStatus)
        // API call to save task in the database
        try {
            const response = await fetch('http://localhost:5000/api/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken'),
                    'UserId': localStorage.getItem('userId')
                },
                body: JSON.stringify({id: task.id, status: taskStatus}), // Send only the new task
            });
            console.log("response", response)
    
            const data = await response.json();
            console.log('data:', data);
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

    const handleDeleteTask = async(taskToDelete) => {
        console.log("taskToDelete", taskToDelete)
        try {
            const response = await fetch('http://localhost:5000/api/todos/'+taskToDelete.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('accessToken'),
                    'UserId': localStorage.getItem('userId')
                },
            });
    console.log("response", response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task to the database');
            }
    
            const data = await response.json();
            console.log('data:', data);
            if(data.status=="success"){
                setToastStatus({status: data.status, message:data.message});
                setTaskToDelete(null);
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

      const getRefreshToken = async() => {
        try {
            const response = await fetch('http://localhost:5000/api/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('refreshToken'),
                    'UserId': localStorage.getItem('userId')
                },
            });
    console.log("response", response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task to the database');
            }
    
            const data = await response.json();
            console.log('data:', data);
            if(data.status=="success"){
                localStorage.setItem("accessToken", data.data.accessToken)
            }else{
                setToastStatus({status: data.status, message:data.message})
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
        all: tasks.length,
        inProgress: tasks.length,
        completed: tasks.length
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
                            inProgressCount={inProgressCount}
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

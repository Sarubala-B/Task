    // routes/todo.js
    const express = require('express');
    const ToDo = require('../models/ToDo'); // Import the ToDo model correctly
    const router = express.Router();
    const crypto = require('crypto');

    const SECRET_KEY = "a3f5c1eaa2834c1f92f0568abed83b4b9f0fcd8a7e5cbfed4fbd01dc5762c8ab"; // Replace with a secure key

    // Middleware to verify the token
    function verifyAuthToken(req) {
      const authorizationHeader = req.headers['authorization'];
      if(authorizationHeader){
        const authHeader = authorizationHeader.split('.');
        const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(authHeader[0]).digest('hex');
        if (authHeader[1] != expectedHash){
          return {
            status : false,
            message: "Invalid Token"
          }
        }else{
          if(Date.now > parseInt(authHeader[2])){
            return {
              status : false,
              message: "Token Expired"
            }
          }else{
            return {
              status : true,
              message: ""
            }
          }
        }
      }else{
        return {
          status : false,
          message: "Token not available"
        }
      }
    }

    // Create a new to-do item with duplicate check
    router.post('/todos', async (req, res) => {
      try {
        const verifyToken = verifyAuthToken(req);
        if(verifyToken.status){
          const { taskName } = req.body;
          const userId = req.headers['userid'];
          if (!taskName) {
            return res.status(400).json({ status: "failure", message: 'Task name is required' });
          }
          // Check for duplicate taskName
          const existingTask = await ToDo.findOne({ where: { taskName } });
          if (existingTask) {
            return res.status(409).json({ status: "failure", message: 'Task name already exists' });
          }
          // Create the new task if no duplicate is found
          await ToDo.create({ taskName, userId });
          res.status(201).json({ status: "success", message: 'Task added successfully' });
        }else{
          res.status(401).json({ status:"failure", message: verifyToken.message})
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failure", message: 'Server error' });
      }
    });


    //Update a todo task
    router.post('/updateTask', async (req, res) => {
      try {
        const verifyToken = verifyAuthToken(req);
        if(verifyToken.status){
        var data = req.body;
        if (!data.taskName) {
          return res.status(400).json({status:"failure", message: 'Task name is required' });
        }   // Check for duplicate taskName
        var taskName = data.taskName;
        const existingTask = await ToDo.findOne({ where: { taskName } });
        if (existingTask) {
          return res.status(409).json({ status: "failure", message: 'Task name already exists' });
        }
        const [updated] = await ToDo.update(
          { taskName: data.taskName },         
          { where: { id: data.id } }      
        )
        if (updated) {
          res.status(201).json({status:"success", message: 'Task updated successfully' });
        }
         else {
          res.status(200).json({status:"success", message: 'No changes made' });
        }
      }
        else{
          res.status(401).json({ status:"failure", message: verifyToken.message})
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failure", message: 'Server error' });
      }
    });

    //Update a todo task
    router.post('/updateTaskStatus', async (req, res) => {
      try {
        const verifyToken = verifyAuthToken(req);
        if(verifyToken.status){
        var data = req.body;
        const [updated] = await ToDo.update(
          { status: data.status },         
          { where: { id: data.id } }      
        )
        if (updated) {
          var message="";
          if(data.status==1){
            message="Task moved to completed successfully"
          }else{
            message="Task moved to in-progress successfully"
          }
          res.status(201).json({status:"success", message: message });
        }
    }
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failure", message: 'Server error' });
      }
    });

    
    // Get all to-do items
  router.get('/todos/:status', async (req, res) => {
    try {
      const verifyToken = verifyAuthToken(req);
      if(verifyToken.status){
        const userId = req.headers['userid'];
        var todos;
        var status;
        var allCounts;
        var inprogressCounts;
        var completedCounts;
        if(req.params.status=="All"){
          todos = await ToDo.findAll({ where: { deleteFlag: 0, userId: userId } });
        }else{
          if(req.params.status=="In-progress"){
            status=0;
          }else{
            status=1;
          }
          todos = await ToDo.findAll({ where: { status: status, deleteFlag: 0, userId: userId } });
        }
        allCounts = await ToDo.findAll({ where: { deleteFlag: 0, userId: userId } });
        inprogressCounts = await ToDo.findAll({ where: { status: 0, deleteFlag: 0, userId: userId } });
        completedCounts = await ToDo.findAll({ where: { status: 1, deleteFlag: 0, userId: userId } });
        var all_count = allCounts.length;
        var inprogress_count = inprogressCounts.length;
        var completed_count = completedCounts.length;
        res.status(200).json({status:"success", message: 'Todo list fetched successfully', data: todos, all_count, inprogress_count, completed_count});
      }else{
        res.status(401).json({ status:"failure", message: verifyToken.message})
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failure", message: 'Server error' });
    }
  });

    router.post('/deleteTask', async (req, res) => {
      try {
        const verifyToken = verifyAuthToken(req);
        if (verifyToken.status) {
          const data = req.body;
    
          if (!data.id) {
            return res.status(400).json({ status: "failure", message: 'Task ID is required' });
          }
    
          const todo = await ToDo.findOne({ where: { id: data.id } });
    
          if (!todo) {
            return res.status(404).json({ status: "failure", message: 'Task not found' });
          }
    
          const [updated] = await ToDo.update(
            { deleteFlag: 1 },
            { where: { id: data.id } }
          );
    
          if (updated) {
            res.status(200).json({ status: "success", message: 'Task deleted successfully' });
          } else {
            res.status(200).json({ status: "success", message: 'No changes made' });
          }
        } else {
          res.status(401).json({ status: "failure", message: verifyToken.message });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failure", message: 'Server error' });
      }
    });
    

    module.exports = router;

const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs')


app.use(express.json());

const filepath = './task.json'
let tasks = fs.readFile(filepath,'utf8',(err,data) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    tasks = JSON.parse(data).tasks
})

// Validation functions
const validateTaskInput = (task) => {
    const errors = [];
    
    // Check if required fields exist
    if (!task.title) 
        errors.push('Title is required');
    if (!task.description) 
        errors.push('Description is required');
    
    // Validate data types
    if (typeof task.title !== 'string') 
        errors.push('Title must be a string');
    if (typeof task.description !== 'string') 
        errors.push('Description must be a string');
    if (task.completed !== undefined && typeof task.completed !== 'boolean') {
        errors.push('Completed must be a boolean');
    }

    return errors;
};

const generateUniqueId = () => {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
    return maxId + 1;
};

// Get all tasks
app.get('/tasks', (req, res) => {
    let filteredTasks = [...tasks];

    // Filter by completion status
    if (req.query.completed) {
        const isCompleted = req.query.completed === 'true';
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }

    // Sort by id
    if (req.query.sort === 'id:asc') {
        filteredTasks.sort((a, b) => a.id - b.id);
    } else if (req.query.sort === 'id:desc') {
        filteredTasks.sort((a, b) => b.id - a.id);
    }

    // Sort by creation date
    if (req.query.sort === 'created:asc') {
        filteredTasks.sort((a, b) => a.created - b.created);
    } else if (req.query.sort === 'created:desc') {
        filteredTasks.sort((a, b) => b.created - a.created);
    }

    res.send(filteredTasks);
})

// Get a task by id 
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id
    const task = tasks.find(task => task.id === parseInt(id))
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.send(task)
})

// Post a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    
    // Validate input
    const validationErrors = validateTaskInput(newTask);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    // Add new task with generated ID
    newTask.id = generateUniqueId();
    newTask.completed = newTask.completed || false; // Default to false if not provided
    
    tasks.push(newTask);
    res.status(201).send(newTask);
})

// update a task by it's id
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex((task) => task.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        id: id // Ensure ID cannot be changed
    };

    // Validate input
    const validationErrors = validateTaskInput(updatedTask);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    tasks[taskIndex] = updatedTask;
    res.send(updatedTask)
})

// Delete a task by its id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id
    const task = tasks.find(task => task.id === parseInt(id))
    const index = tasks.indexOf(task)
    if(index === -1){
        return res.status(404).json({ error: 'Task not found' })
    }
    tasks.splice(index,1)
    res.send(task)
})



app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
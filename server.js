const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Load tasks from a JSON file
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper function to load tasks
function loadTasks() {
  const tasksData = fs.readFileSync(tasksFilePath);
  return JSON.parse(tasksData);
}

// Helper function to save tasks
function saveTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { status, name, description } = req.body;
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length + 1,
    status,
    name,
    description,
    createdAt: new Date().toLocaleString(),  // Add creation timestamp
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status, name, description } = req.body;
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], status, name, description };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.id !== parseInt(id));
  saveTasks(updatedTasks);
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

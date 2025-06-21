# Task Manager API

A simple REST API for managing tasks built with Node.js and Express.

## Overview

This Task Manager API allows you to perform CRUD operations (Create, Read, Update, Delete) on tasks. The data is stored in a JSON file (`tasks.json`) and served through various API endpoints.

## Required Packages

The project uses the following npm packages:

- **express** (^4.18.2): Fast, unopinionated web framework for Node.js
- **cors** (^2.8.5): Middleware to enable Cross-Origin Resource Sharing
- **dotenv** (^16.3.1): Loads environment variables from .env file
- **nodemon** (^3.0.1): Development utility that monitors source changes and automatically restarts the server

## Code Structure (app.js)

The main application file `app.js` contains:

1. **Initial Setup**
   - Imports required packages
   - Configures middleware
   - Sets up Express application

2. **API Endpoints**
   - GET `/tasks`: Retrieves all tasks
   - GET `/tasks/:id`: Retrieves a specific task by ID
   - POST `/tasks`: Creates a new task
   - PUT `/tasks/:id`: Updates an existing task
   - DELETE `/tasks/:id`: Deletes a task

3. **Error Handling**
   - Custom error handling middleware
   - 404 route handler for undefined routes

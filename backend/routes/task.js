const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Task = require('../models/tasks');
const Employee = require('../models/employees');
const Project = require('../models/projects');


// ========================================
// ADD TASK
// ========================================
router.post('/task', async(req, res) => {
    try {
        const {
            title,
            description,
            assignTo,
            project,
            startDate,
            priority,
        } = req.body;

        // -------------------------------
        // Validation
        // -------------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required',
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                message: 'Task description is required',
            });
        }

        if (!assignTo) {
            return res.status(400).json({
                message: 'Please select an employee',
            });
        }

        if (!project) {
            return res.status(400).json({
                message: 'Please select a project',
            });
        }

        if (!startDate) {
            return res.status(400).json({
                message: 'Start date is required',
            });
        }

        // -------------------------------
        // Validate ObjectIds
        // -------------------------------

        if (!mongoose.Types.ObjectId.isValid(assignTo)) {
            return res.status(400).json({
                message: 'Invalid employee ID',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(project)) {
            return res.status(400).json({
                message: 'Invalid project ID',
            });
        }

        // -------------------------------
        // Check employee
        // -------------------------------

        const employee = await Employee.findById(assignTo);

        if (!employee) {
            return res.status(404).json({
                message: 'Selected employee not found',
            });
        }

        // -------------------------------
        // Check project
        // -------------------------------

        const selectedProject =
            await Project.findById(project);

        if (!selectedProject) {
            return res.status(404).json({
                message: 'Selected project not found',
            });
        }

        // -------------------------------
        // Create task
        // -------------------------------

        const newTask = new Task({
            title: title.trim(),

            description: description.trim(),

            assignTo,

            project,

            startDate,

            priority: priority || 'Most Important',

            status: 'Pending',

            progress: 0,
        });

        await newTask.save();

        // -------------------------------
        // Populate task
        // -------------------------------

        const populatedTask =
            await Task.findById(newTask._id)
            .populate(
                'assignTo',
                'employee_id firstName lastName email role'
            )
            .populate(
                'project',
                'title description clientName startDate status priority'
            );

        return res.status(201).json({
            message: 'Task added successfully',
            task: populatedTask,
        });

    } catch (error) {
        console.error(
            'Add task error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to add task',
            error: error.message,
        });
    }
});


// ========================================
// GET ALL TASKS
// ========================================
router.get('/tasks', async(req, res) => {
    try {
        const tasks =
            await Task.find()
            .populate(
                'assignTo',
                'employee_id firstName lastName email role'
            )
            .populate(
                'project',
                'title description clientName startDate status priority'
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json(tasks);

    } catch (error) {
        console.error(
            'Get tasks error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch tasks',
            error: error.message,
        });
    }
});


// ========================================
// GET SINGLE TASK
// ========================================
router.get('/task/:id', async(req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(
                req.params.id
            )) {
            return res.status(400).json({
                message: 'Invalid task ID',
            });
        }

        const task =
            await Task.findById(req.params.id)
            .populate(
                'assignTo',
                'employee_id firstName lastName email role'
            )
            .populate(
                'project',
                'title description clientName startDate status priority'
            );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        return res.status(200).json(task);

    } catch (error) {
        console.error(
            'Get single task error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch task',
            error: error.message,
        });
    }
});


// ========================================
// UPDATE TASK
// ========================================
router.put('/task/:id', async(req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(
                req.params.id
            )) {
            return res.status(400).json({
                message: 'Invalid task ID',
            });
        }

        const {
            title,
            description,
            assignTo,
            project,
            startDate,
            priority,
            status,
            progress,
        } = req.body;

        const updateData = {};

        if (title !== undefined) {
            updateData.title =
                title.trim();
        }

        if (description !== undefined) {
            updateData.description =
                description.trim();
        }

        if (assignTo !== undefined) {
            updateData.assignTo =
                assignTo;
        }

        if (project !== undefined) {
            updateData.project =
                project;
        }

        if (startDate !== undefined) {
            updateData.startDate =
                startDate;
        }

        if (priority !== undefined) {
            updateData.priority =
                priority;
        }

        if (status !== undefined) {
            updateData.status =
                status;
        }

        if (progress !== undefined) {

            const numericProgress =
                Number(progress);

            if (
                Number.isNaN(
                    numericProgress
                ) ||
                numericProgress < 0 ||
                numericProgress > 100
            ) {
                return res.status(400).json({
                    message: 'Progress must be between 0 and 100',
                });
            }

            updateData.progress =
                numericProgress;
        }

        const updatedTask =
            await Task.findByIdAndUpdate(
                req.params.id,
                updateData, {
                    new: true,
                    runValidators: true,
                }
            )
            .populate(
                'assignTo',
                'employee_id firstName lastName email role'
            )
            .populate(
                'project',
                'title description clientName startDate status priority'
            );

        if (!updatedTask) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask,
        });

    } catch (error) {
        console.error(
            'Update task error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to update task',
            error: error.message,
        });
    }
});


// ========================================
// DELETE TASK
// ========================================
router.delete('/task/:id', async(req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(
                req.params.id
            )) {
            return res.status(400).json({
                message: 'Invalid task ID',
            });
        }

        const task =
            await Task.findById(
                req.params.id
            );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        await Task.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            message: 'Task deleted successfully',
        });

    } catch (error) {
        console.error(
            'Delete task error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to delete task',
            error: error.message,
        });
    }
});


module.exports = router;
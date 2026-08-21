const express = require('express');
const router = express.Router();
const Project = require('../models/projects');

// ========================================
// ADD PROJECT
// ========================================
router.post('/project', async(req, res) => {
    try {
        const {
            title,
            description,
            clientName,
            startDate,
            status,
            priority,
        } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Project title is required',
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                message: 'Project description is required',
            });
        }

        if (!clientName || !clientName.trim()) {
            return res.status(400).json({
                message: 'Client name is required',
            });
        }

        if (!startDate) {
            return res.status(400).json({
                message: 'Start date is required',
            });
        }

        const newProject = new Project({
            title: title.trim(),
            description: description.trim(),
            clientName: clientName.trim(),
            startDate,
            status: status || 'On Hold',
            priority: priority || 'Most Important',
        });

        await newProject.save();

        return res.status(201).json({
            message: 'Project added successfully',
            project: newProject,
        });
    } catch (error) {
        console.error('Add project error:', error);

        return res.status(500).json({
            message: 'Failed to add project',
            error: error.message,
        });
    }
});

// ========================================
// GET ALL PROJECTS
// Used by AddTask.jsx dropdown
// ========================================
router.get('/projects', async(req, res) => {
    try {
        const projects = await Project.find()
            .select('_id title description clientName startDate status priority')
            .sort({ title: 1 });

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Get projects error:', error);

        return res.status(500).json({
            message: 'Failed to fetch projects',
            error: error.message,
        });
    }
});

// ========================================
// GET ACTIVE / AVAILABLE PROJECTS
// Optional endpoint
// ========================================
router.get('/projects/active', async(req, res) => {
    try {
        const projects = await Project.find({
                status: {
                    $in: ['On Hold', 'In Progress', 'Testing'],
                },
            })
            .select('_id title clientName startDate status priority')
            .sort({ title: 1 });

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Get active projects error:', error);

        return res.status(500).json({
            message: 'Failed to fetch active projects',
            error: error.message,
        });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();

const { generateTask } = require('../services/aiService');

router.post('/ai/generate-task', async(req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: 'Prompt is required',
            });
        }

        const result = await generateTask(prompt);

        return res.status(200).json({
            result,
        });
    } catch (error) {
        console.error('AI generation error:', error);

        return res.status(500).json({
            message: 'Failed to generate task with AI',
        });
    }
});

module.exports = router;
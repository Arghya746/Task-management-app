const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    priority: {
        type: String,
        enum: [
            'Most Important',
            'Important',
            'Least Important',
        ],
        default: 'Most Important',
    },

    status: {
        type: String,
        enum: [
            'Pending',
            'In Progress',
            'Completed',
        ],
        default: 'Pending',
    },

    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
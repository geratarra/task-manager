import mongoose from 'mongoose';
import { TASK_STATUS } from '../utils/constants';

const Task = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: TASK_STATUS,
        default: 'pending'
    }
});

export default mongoose.model('Task', Task);
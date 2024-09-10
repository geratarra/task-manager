import mongoose from 'mongoose';
import { TASK_STATUS } from '../utils/constants';

export interface ITask {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    dueDate: number;
    status: string;
}

const Task = new mongoose.Schema<ITask>({
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

export default mongoose.model<ITask>('Task', Task);
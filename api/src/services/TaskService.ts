import Task, { ITask } from '../models/Task';
import User from '../models/User';

export class TaskService {
    async getTasksForUser(email: string): Promise<ITask[] | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null; // Or throw an error if appropriate
            }
            return await Task.find({ user: user });
        } catch (error) {
            console.error('Error getting tasks: ', error);
            throw error; // Re-throw to handle in the controller
        }
    }

    async createTaskForUser(email: string, taskData: ITask): Promise<ITask | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null; // Or throw an error
            }

            const newTask = new Task({ 
                user: user, 
                title: taskData.title, 
                description: taskData.description, 
                dueDate: taskData.dueDate, 
                status: taskData.status 
            });

            return await newTask.save();
        } catch (error) {
            console.error('Error creating task: ', error);
            throw error;
        }
    }

    async getTaskByIdForUser(email: string, taskId: string): Promise<ITask | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null; 
            }
            return await Task.findOne({ user: user, _id: taskId });
        } catch (error) {
            console.error('Error while getting task: ', error);
            throw error;
        }
    }

    async updateTaskById(taskId: string, updatedData: ITask): Promise<typeof Task | null> {
        try {
            return await Task.findByIdAndUpdate(
                taskId,
                updatedData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            console.error('Error updating task: ', error);
            throw error;
        }
    }

    async deleteTaskByIdForUser(email: string, taskId: string): Promise<ITask | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null; 
            }
            return await Task.findOneAndDelete({ user: user, _id: taskId });
        } catch (error) {
            console.error('Error deleting task: ', error);
            throw error;
        }
    }
}

import Task, { ITask } from "../models/Task";
import User from "../models/User";
import { Request, Response } from 'express';
import { TaskService } from "../services/TaskService";

export class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    async getTasks(req: Request, res: Response) {
        try {
            const tasks: ITask[] | null = await this.taskService.getTasksForUser(req.user.email);
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error gettings tasks: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }); 
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async createTask(req: Request, res: Response) {
        try {
            const { title, description, dueDate, status } = req.body;
    
            // Basic validation (you should add more robust validation)
            if (!title || !description || !dueDate) {
                return res.status(400).json({ message: 'Please provide all required fields' });
            }
    
            const user = await User.findOne({ email: req.user.email });
    
            // Create new task
            const newTask = new Task({ user: user, title, description, dueDate, status });
            await newTask.save();
    
            res.status(201).json({ message: 'Task created successfully' });
        } catch (error) {
            console.error('Error creating task: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }); 
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const user = await User.findOne({ email: req.user.email });
            const task = await Task.find({ user: user, _id: req.params.id });
    
            if (!task || task.length === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
    
            res.status(200).json(task);
        } catch (error) {
            console.error('Error while getting task: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }); 
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            const taskId = req.params.id;
            const { title, description, dueDate, status } = req.body;
    
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { title, description, dueDate, status },
                { new: true, runValidators: true }
            );
    
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
    
            res.status(200).json(updatedTask);
        } catch (error) {
            console.error('Error updating task: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }); 
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const user = await User.findOne({ email: req.user.email });
            const deletedTask = await Task.findOneAndDelete({ user: user, _id: req.params.id });
    
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
    
            res.sendStatus(204);
        } catch (error) {
            console.error('Error deleting task: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message }); 
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }
}

import { TaskService } from './TaskService';
import Task, { ITask } from '../models/Task';
import mongoose, { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import User, { IUser } from '../models/User';

describe('TaskService - getTasksForUser', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should get tasks for a user', async () => {
        const userId = new Types.ObjectId();
        const mockUser = { _id: userId, email: 'test@example.com' };
        const mockTasks: ITask[] = [
            {
                title: 'Task 1',
                user: userId,
                description: 'foo',
                dueDate: 0,
                status: ''
            },
            {
                title: 'Task 2',
                user: userId,
                description: '',
                dueDate: 0,
                status: ''
            },
        ];

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task, 'find').mockResolvedValue(mockTasks);

        const tasks = await taskService.getTasksForUser(userId.toString());

        expect(tasks).toEqual(mockTasks);
        expect(Task.find).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should handle errors when getting tasks for a user', async () => {
        const userId = new Types.ObjectId();
        const errorMessage = 'Database error';

        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'find').mockRejectedValue(new Error(errorMessage));

        await expect(taskService.getTasksForUser(userId.toString()))
            .rejects.toThrowError(errorMessage);
    });
});

describe('TaskService - createTaskForUser', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a task for a user', async () => {
        const userId = new Types.ObjectId();
        const mockUser = { _id: userId, email: 'test@example.com' };
        const newTaskData: ITask = {
            title: 'New Task',
            user: userId,
            description: 'Test description',
            dueDate: Date.now(),
            status: 'pending'
        };
        const mockCreatedTask: ITask = { ...newTaskData };

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task.prototype, 'save').mockResolvedValue(mockCreatedTask);

        const createdTask = await taskService.createTaskForUser(mockUser.email, newTaskData);

        expect(createdTask).toEqual(mockCreatedTask);
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Task.prototype.save).toHaveBeenCalled();
    });

    it('should handle errors when creating a task for a user', async () => {
        const email = 'test@example.com';
        const newTaskData: ITask = {
            title: 'New Task',
            user: new Types.ObjectId(),
            description: 'Test description',
            dueDate: Date.now(),
            status: 'pending'
        };
        const errorMessage = 'Database error';

        jest.spyOn(User, 'findOne').mockRejectedValue(new Error(errorMessage));

        await expect(taskService.createTaskForUser(email, newTaskData))
            .rejects.toThrowError(errorMessage);
    });
});

describe('TaskService - getTaskByIdForUser', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should get a task by ID for a user', async () => {
        const userId = new Types.ObjectId();
        const taskId = new Types.ObjectId();
        const mockUser = { email: 'test@example.com' };
        const mockTask: ITask = {
            title: 'Task 1',
            user: userId,
            description: 'foo',
            dueDate: 0,
            status: ''
        };

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task, 'findOne').mockResolvedValue(mockTask);

        const task = await taskService.getTaskByIdForUser(mockUser.email, taskId.toString());

        expect(task).toEqual(mockTask);
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Task.findOne).toHaveBeenCalledWith({ user: mockUser, _id: taskId.toString() });
    });

    it('should handle errors when getting a task by ID for a user', async () => {
        const email = 'test@example.com';
        const taskId = new Types.ObjectId().toString();
        const errorMessage = 'Database error';

        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'findOne').mockRejectedValue(new Error(errorMessage));

        await expect(taskService.getTaskByIdForUser(email, taskId))
            .rejects.toThrowError(errorMessage);
    });

    it('should return null if user is not found', async () => {
        const email = 'test@example.com';
        const taskId = new Types.ObjectId().toString();

        jest.spyOn(User, 'findOne').mockResolvedValue(null);
        const taskFindSpy = jest.spyOn(Task, 'findOne'); // Create a spy on Task.findOne

        const task = await taskService.getTaskByIdForUser(email, taskId);


        expect(task).toBeNull();
        expect(User.findOne).toHaveBeenCalledWith({ email });
        expect(taskFindSpy).not.toHaveBeenCalled();
    });

    it('should return null if task is not found', async () => {
        const userId = new Types.ObjectId();
        const taskId = new Types.ObjectId().toString();
        const mockUser = { _id: userId, email: 'test@example.com' };

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task, 'findOne').mockResolvedValue(null);

        const task = await taskService.getTaskByIdForUser(mockUser.email, taskId);

        expect(task).toBeNull();
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Task.findOne).toHaveBeenCalledWith({ user: mockUser, _id: taskId });
    });
});

describe('TaskService - updateTaskById', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should update a task by ID', async () => {
        const taskId = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const updatedData: ITask = {
            title: 'Updated Task Title',
            user: userId,
            description: 'Updated description',
            dueDate: 1678886400,
            status: 'in-progress'
        };

        const mockUpdatedTask: ITask = { ...updatedData };

        jest.spyOn(Task, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedTask);

        const updatedTask = await taskService.updateTaskById(taskId.toString(), updatedData);

        expect(updatedTask).toEqual(mockUpdatedTask);
        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskId.toString(), updatedData, { new: true, runValidators: true });
    });

    it('should handle errors when updating a task', async () => {
        const taskId = new Types.ObjectId().toString();
        const userId = new Types.ObjectId();
        const updatedData: ITask = {
            title: 'Updated Task Title',
            user: userId,
            description: 'Updated description',
            dueDate: 1678886400,
            status: 'in-progress'
        };
        const errorMessage = 'Database error';

        jest.spyOn(Task, 'findByIdAndUpdate').mockRejectedValue(new Error(errorMessage));

        await expect(taskService.updateTaskById(taskId, updatedData))
            .rejects.toThrowError(errorMessage);
    });
});

describe('TaskService - deleteTaskByIdForUser', () => {
    let taskService: TaskService;

    beforeEach(() => {
        taskService = new TaskService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete a task by ID for a user', async () => {
        const userId = new Types.ObjectId();
        const taskId = new Types.ObjectId();
        const mockUser = { _id: userId, email: 'test@example.com' };
        const mockTask: ITask = {
            title: 'Task 1',
            user: userId,
            description: 'foo',
            dueDate: 0,
            status: ''
        };

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task, 'findOneAndDelete').mockResolvedValue(mockTask);

        const deletedTask = await taskService.deleteTaskByIdForUser(mockUser.email, taskId.toString());

        expect(deletedTask).toEqual(mockTask);
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Task.findOneAndDelete).toHaveBeenCalledWith({ user: mockUser, _id: taskId.toString() });
    });

    it('should handle errors when deleting a task by ID for a user', async () => {
        const email = 'test@example.com';
        const taskId = new Types.ObjectId().toString();
        const errorMessage = 'Database error';

        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'findOneAndDelete').mockRejectedValue(new Error(errorMessage));

        await expect(taskService.deleteTaskByIdForUser(email, taskId))
            .rejects.toThrowError(errorMessage);
    });

    it('should return null if user is not found', async () => {
        const email = 'test@example.com';
        const taskId = new Types.ObjectId().toString();

        jest.spyOn(User, 'findOne').mockResolvedValue(null);
        const taskDeleteSpy = jest.spyOn(Task, 'findOneAndDelete');

        const deletedTask = await taskService.deleteTaskByIdForUser(email, taskId);

        expect(deletedTask).toBeNull();
        expect(User.findOne).toHaveBeenCalledWith({ email });
        expect(taskDeleteSpy).not.toHaveBeenCalled();
    });

    it('should return null if task is not found', async () => {
        const userId = new Types.ObjectId();
        const taskId = new Types.ObjectId().toString();
        const mockUser = { _id: userId, email: 'test@example.com' };

        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(Task, 'findOneAndDelete').mockResolvedValue(null);

        const deletedTask = await taskService.deleteTaskByIdForUser(mockUser.email, taskId);

        expect(deletedTask).toBeNull();
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
        expect(Task.findOneAndDelete).toHaveBeenCalledWith({ user: mockUser, _id: taskId });
    });
});
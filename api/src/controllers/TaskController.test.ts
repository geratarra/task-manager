import { TaskController } from './TaskController';
import { TaskService } from '../services/TaskService';
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import Task, { ITask } from '../models/Task';
import mongoose from 'mongoose';
import User from '../models/User';

const mockTaskService = {
    getTasksForUser: jest.fn<(email: string) => Promise<ITask[]>>(),
};

const getTasksMockRequest = {
    user: {
        email: 'test@example.com'
    }
} as unknown as Request;

const getTaskMockRequest = {
    user: {
        email: 'test@example.com'
    },
    params: {
        id: '64d2f0f6880cfd2930ea222b'
    }
} as unknown as Request;

const createTaskMockRequest = {
    user: {
        email: 'test@example.com'
    },
    body: {
        title: 'Task 1',
        description: 'foo',
        dueDate: 1,
        status: 'pending'
    }
} as unknown as Request;

const updateTaskMockRequest = {
    user: {
        email: 'test@example.com'
    },
    params: {
        id: '64d2f0f6880cfd2930ea222b' // Example task ID 
    },
    body: {
        title: 'Updated Task Title',
        description: 'Updated description',
        dueDate: 1678886400, 
        status: 'in-progress'
    }
} as unknown as Request;

const mockUpdatedTask: ITask = {
    title: 'Updated Task Title',
    user: new mongoose.Types.ObjectId(),
    description: 'Updated description',
    dueDate: 1678886400,
    status: 'in-progress'
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn()
};

const mockTasks: ITask[] = [
    {
        title: 'Task 1',
        user: new mongoose.Types.ObjectId(),
        description: 'foo',
        dueDate: 0,
        status: 'pending'
    }
];

describe('TaskController - getTasks', () => {
    let taskController: TaskController;

    beforeEach(() => {
        taskController = new TaskController(mockTaskService as unknown as TaskService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 200 and a list of tasks', async () => {
        mockTaskService.getTasksForUser.mockResolvedValue(mockTasks);

        await taskController.getTasks(getTasksMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should return 500 on server error', async () => {
        mockTaskService.getTasksForUser.mockRejectedValue(new Error('Database error'));

        await taskController.getTasks(getTasksMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('TaskController - createTask', () => {
    let taskController: TaskController;

    beforeEach(() => {
        taskController = new TaskController(mockTaskService as unknown as TaskService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 201 and create a task', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task.prototype, 'save').mockResolvedValue(mockTasks[0]);

        await taskController.createTask(createTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task created successfully' });
    });

    it('should return 400 if title, description or dueDate are missing', async () => {
        const invalidRequest = {
            ...createTaskMockRequest,
            body: {
                title: 'Task 1',
                dueDate: 0,
            }
        };

        await taskController.createTask(invalidRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

        await taskController.createTask(createTaskMockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('TaskController - getTaskById', () => {
    let taskController: TaskController;

    beforeEach(() => {
        taskController = new TaskController(mockTaskService as unknown as TaskService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 200 and the task details', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'find').mockResolvedValue([mockTasks[0]]); 

        await taskController.getTaskById(getTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith([mockTasks[0]]);
    });

    it('should return 404 if task is not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'find').mockResolvedValue([]);

        await taskController.getTaskById(getTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error')); 

        await taskController.getTaskById(getTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('TaskController - updateTask', () => {
    let taskController: TaskController;

    beforeEach(() => {
        taskController = new TaskController(mockTaskService as unknown as TaskService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 200 and the updated task', async () => {
        jest.spyOn(Task, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedTask);

        await taskController.updateTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it('should return 404 if task is not found', async () => {
        jest.spyOn(Task, 'findByIdAndUpdate').mockResolvedValue(null);

        await taskController.updateTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(Task, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

        await taskController.updateTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('TaskController - deleteTask', () => {
    let taskController: TaskController;

    beforeEach(() => {
        taskController = new TaskController(mockTaskService as unknown as TaskService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 204 if task is deleted', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'findOneAndDelete').mockResolvedValue(mockUpdatedTask);

        await taskController.deleteTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 if task is not found', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({});
        jest.spyOn(Task, 'findOneAndDelete').mockResolvedValue(null);

        await taskController.deleteTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

        await taskController.deleteTask(updateTaskMockRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

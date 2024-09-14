import { AuthController } from './AuthController';
import { UserService } from '../services/UserService';
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { afterEach, beforeEach, describe, expect, it, jest, test } from '@jest/globals';
import { SessionService } from '../services/SessionService';

const bcrypt = require('bcrypt');

const mockUserService = {
    createUser: jest.fn<(user: IUser) => Promise<IUser>>()
};

const mockUser: IUser = {
    email: 'test@example.com',
    password: 'password123',
};

const mockRequest = {
    body: {
        email: mockUser.email,
        password: mockUser.password,
    },
    headers: {
        authorization: 'Bearer mock-valid-token'
    }
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn()
};

describe('AuthController - signup', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController(mockUserService as unknown as UserService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 201 status on successful signup', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);
        mockUserService.createUser = jest.fn<(user: IUser) => Promise<IUser>>()
            .mockResolvedValue(mockUser);

        await authController.signup(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockUserService.createUser).toHaveBeenCalledWith({
            email: mockUser.email,
            password: mockUser.password,
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 status if user already exists', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue({ email: mockUser.email });
        mockUserService.createUser = jest.fn<(user: IUser) => Promise<IUser>>()
            .mockResolvedValue(mockUser);

        await authController.signup(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should return 400 status if email or password is missing', async () => {
        const invalidRequest = {
            body: {
                email: 'test@example.com',
            },
        };

        await authController.signup(invalidRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Please provide all required fields' });
    });

    it('should return 500 status on server error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));
        await authController.signup(mockRequest as Request, mockResponse as unknown as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});

describe('AuthController - login', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController(mockUserService as unknown as UserService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 200 and a token on successful login', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        const mockToken = 'mockToken';
        jest.spyOn(SessionService.prototype, 'addSession').mockReturnValue(mockToken);

        await authController.login(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ token: mockToken }));
    });

    it('should return 401 if user does not exist', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        await authController.login(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if password does not match', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        await authController.login(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 400 if email or password is missing', async () => {
        const invalidRequest = {
            body: {
                email: 'test@example.com',
            },
        };

        await authController.login(invalidRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Please provide email and password' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

        await authController.login(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});

describe('AuthController - logout', () => {
    let authController: AuthController;

    beforeEach(() => {
        authController = new AuthController(mockUserService as unknown as UserService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 204 on successful logout', async () => {
        jest.spyOn(SessionService.prototype, 'removeSession').mockReturnValue();

        await authController.logout(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 400 if authorization header is missing', async () => {
        const invalidRequest = {
            headers: {}
        } as unknown as Request;

        await authController.logout(invalidRequest, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Missing authorization header' });
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(SessionService.prototype, 'removeSession').mockImplementation(() => {
            throw new Error('Session service error');
        });

        await authController.logout(mockRequest as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});
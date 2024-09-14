import { UserService } from './UserService';
import User, { IUser } from '../models/User';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

const bcrypt = require('bcrypt');

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a new user with hashed password', async () => {
        const userData: IUser = {
            email: 'test@example.com',
            password: 'password123'
        };
        const hashedPassword = 'hashedPassword';
        const mockCreatedUser: IUser = { ...userData, password: hashedPassword };

        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
        jest.spyOn(User.prototype, 'save').mockResolvedValue(mockCreatedUser);

        const createdUser = await userService.createUser(userData);

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'salt');
        expect(User.prototype.save).toHaveBeenCalled();
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.password).toBe(hashedPassword);
    });

    it('should handle errors during user creation', async () => {
        const userData: IUser = {
            email: 'test@example.com',
            password: 'password123'
        };
        const errorMessage = 'Database error';

        jest.spyOn(bcrypt, 'genSalt').mockRejectedValue(new Error(errorMessage));

        await expect(userService.createUser(userData))
            .rejects.toThrowError(errorMessage);
    });
});

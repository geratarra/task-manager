import { Request, Response } from 'express';
import User from '../models/User';
import { SessionService } from '../services/SessionService';
import { UserService } from '../services/UserService';
import { MAX_AGE_JWT_COOKIE } from '../utils/constants';

const bcrypt = require('bcrypt');
const sessionService = new SessionService();

export class AuthController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async signup(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Basic validation (you should add more robust validation)
            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide all required fields' });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            await this.userService.createUser({ email, password });

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error during signup: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Basic validation
            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide email and password' });
            }

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (user.email !== email || !isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = sessionService.addSession(email);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 1000*60*30,
                sameSite: 'none',
                secure: false
            });
            res.status(200).json({ token });

        } catch (error) {
            console.error('Error during login: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader) {
                const token = authHeader.split('Bearer ')[1]; // Get token from Bearer header

                // deleting token
                sessionService.removeSession(token);
                res.clearCookie('jwt');
                return res.sendStatus(204);
            }

            return res.status(400).json({ message: 'Missing authorization header' });
        } catch (error) {
            console.error('Error during logout: ', error);
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async verifyToken(req: Request, res: Response) {
        res.status(200).json({ token: req.cookies.jwt });
    }
}
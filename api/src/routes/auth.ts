import express, { Request, Response } from 'express';
import User from '../models/User';
import { SessionService } from '../services/SessionService';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const sessionService = new SessionService();


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@$$wOrd
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request - Missing required fields or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        // Basic validation (you should add more robust validation)
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup : ', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@$$wOrd
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req: Request, res: Response) => {
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
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during login : ', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});


/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request - Missing authorization header
 */
router.post('/logout', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split('Bearer ')[1]; // Get token from Bearer header

            // deleting token
            sessionService.removeSession(token);
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
});


export default router;
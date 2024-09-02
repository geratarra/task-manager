import express, { Request, Response } from 'express';
import User from '../models/User';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'secret_key';


// Signup route
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
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Login route
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

        const token = jwt.sign({ user: user.email }, SECRET_KEY, { expiresIn: '30m' });

        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;
import express from 'express';
import { AuthController } from '../controllers/AuthController';

export const createAuthRouter = (authController: AuthController) => {
    const router = express.Router();
    
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
    router.post('/signup', authController.signup.bind(authController));

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
    router.post('/login', authController.login.bind(authController));

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
    router.post('/logout', authController.logout.bind(authController));

    return router;
}
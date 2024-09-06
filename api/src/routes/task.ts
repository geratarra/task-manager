import express, { Request, Response } from 'express';
import Task from '../models/Task';
import { authenticateJWT } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of tasks for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error.
 */
router.get('/task', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const tasks = await Task.find({ user: user });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error gettings tasks: ', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); 
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Finish project report
 *               description:
 *                 type: string
 *                 description: Task description
 *                 example: Complete the final draft of the project report, including charts and conclusions.
 *               dueDate:
 *                 type: number
 *                 description: Task due date (timestamp)
 *                 example: 1678886400
 *               status:
 *                 type: string
 *                 description: Task status
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/task', authenticateJWT, async (req: Request, res: Response) => {
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
});


/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Returns the task details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/task/:id', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const task = await Task.find({ user: user, _id: req.params.id });

        if (!task) {
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
});


/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task by ID for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Finish project report
 *               description:
 *                 type: string
 *                 description: Task description
 *                 example: Complete the final draft of the project report, including charts and conclusions.
 *               dueDate:
 *                 type: number
 *                 description: Task due date (timestamp)
 *                 example: 1678886400
 *               status:
 *                 type: string
 *                 description: Task status
 *                 example: pending
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/task/:id', authenticateJWT, async (req: Request, res: Response) => {
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
});

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/task/:id', authenticateJWT, async (req: Request, res: Response) => {
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
});


export default router;

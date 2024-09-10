import express, { Request, Response } from 'express';
import Task from '../models/Task';
import { authenticateJWT } from '../middleware/auth';
import User from '../models/User';
import { TaskController } from '../controllers/TaskController';

export const createTaskRouter = (taskController: TaskController) => {
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
    router.get('/', authenticateJWT, taskController.getTasks.bind(taskController));

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
    router.post('/', authenticateJWT, taskController.createTask.bind(taskController));

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
    router.get('/:id', authenticateJWT, taskController.getTaskById.bind(taskController));

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
    router.put('/:id', authenticateJWT, taskController.updateTask.bind(taskController));

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
    router.delete('/:id', authenticateJWT, taskController.deleteTask.bind(taskController));

    return router;
};

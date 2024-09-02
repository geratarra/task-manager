import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

const app: Application = express();
const port: number = 3002;

// MongoDB connection
mongoose.connect('mongodb://foo:bar@localhost:27017/taskmanager?authSource=admin')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express & TypeScript API!');
});

// Mount auth routes under '/api/auth'
app.use('/api/auth', authRoutes); 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

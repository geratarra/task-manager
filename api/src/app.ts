import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createAuthRouter } from './routes/auth';
import taskRoutes from './routes/task'; 
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import { PORT, RATE_LIMITER_WINDOW_MS } from './utils/constants';
import { AuthController } from './controllers/AuthController';
import { UserService } from './services/UserService';

const app: Application = express();
const userService = new UserService();
const authController = new AuthController(userService);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
// rate limiter middleware
const limiter = rateLimit({
    windowMs: RATE_LIMITER_WINDOW_MS,
    max: 5, // Limit each IP to 5 requests per `windowMs`
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to the login route
app.use('/api/auth/login', limiter);

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express & TypeScript API!');
});

app.use('/api/auth', createAuthRouter(authController));
app.use('/api', taskRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

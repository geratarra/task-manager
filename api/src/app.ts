import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task'; 
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

const app: Application = express();
const port = process.env.PORT || 3000;


// MongoDB connection
mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
// rate limiter middleware
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
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

app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

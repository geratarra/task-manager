import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

const app: Application = express();
const port: number = 3002;

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express & TypeScript API!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

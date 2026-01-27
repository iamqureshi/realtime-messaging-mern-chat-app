import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running!');
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the Backend!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

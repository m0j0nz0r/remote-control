import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import deviceRoutes from './routes/devices';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/devices', deviceRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

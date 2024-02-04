import express from 'express';
import todoRoutes from './routes/todoRoutes.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/todo', todoRoutes);

app.listen(port, () => {
  console.log(`Sever running at localhost:${port}`);
});

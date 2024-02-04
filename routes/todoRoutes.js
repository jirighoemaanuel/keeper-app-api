import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

const router = express.Router();

dotenv.config();


const db = new pg.Pool({
  connectionString: process.env.DBConfigLink,
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();
let todos = [];

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM todoitem';
  try {
    const result = await db.query(query);
    const todos = result.rows;
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching todos' });
  }
});

router.post('/', async (req, res) => {
  const data = req.body;
  if (!data.title || !data.content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }

  const query =
    'INSERT INTO todoitem (title, content) VALUES ($1, $2) RETURNING *';
  try {
    const result = await db.query(query, [data.title, data.content]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while inserting the todo item' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM todoitem WHERE id = $1';
  try {
    await db.query(query, [id]);
    res.status(204).json([]);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting item' });
  }
});

export default router;

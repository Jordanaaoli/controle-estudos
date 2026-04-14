require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.get('/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar matérias' });
  }
});

app.post('/subjects', async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ error: 'O nome da matéria é obrigatório' });
    }

    const existing = await pool.query(
      'SELECT * FROM subjects WHERE LOWER(name) = LOWER($1)',
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Matéria já existe' });
    }

    const result = await pool.query(
      'INSERT INTO subjects (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar matéria' });
  }
});

app.post('/sessions', async (req, res) => {
  try {
    const { subject_id, duration } = req.body;

    if (!subject_id || !duration) {
      return res.status(400).json({ error: 'subject_id e duration são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO study_sessions (subject_id, duration) VALUES ($1, $2) RETURNING *',
      [subject_id, duration]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar sessão' });
  }
});

app.get('/sessions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.subject_id,
        sub.name AS subject_name,
        s.duration,
        s.created_at
      FROM study_sessions s
      JOIN subjects sub ON sub.id = s.subject_id
      ORDER BY s.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar sessões' });
  }
});

app.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT
    sub.name,
    COALESCE(SUM(s.duration), 0) AS total_minutes
  FROM subjects sub
  LEFT JOIN study_sessions s ON s.subject_id = sub.id
  GROUP BY sub.name
  ORDER BY sub.name ASC
`);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar resumo de estudos' });
  }
});
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
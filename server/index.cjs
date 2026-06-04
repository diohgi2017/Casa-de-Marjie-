const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let queryQueue = Promise.resolve();

const runQuery = (query) => {
  const task = () => new Promise((resolve, reject) => {
    const command = `team-db "${query.replace(/"/g, '\\"')}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        resolve(stdout);
      }
    });
  });

  const currentTask = queryQueue.then(task, task);
  queryQueue = currentTask;
  return currentTask;
};

// Users
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await runQuery(`SELECT * FROM users WHERE id = '${req.params.id}'`);
    res.json(result[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products
app.get('/api/products/:userId', async (req, res) => {
  try {
    const result = await runQuery(`SELECT * FROM products WHERE user_id = '${req.params.userId}'`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { id, user_id, brand, name, category, ingredients, expiry_date } = req.body;
  try {
    await runQuery(`INSERT INTO products (id, user_id, brand, name, category, ingredients, expiry_date) VALUES ('${id}', '${user_id}', '${brand}', '${name}', '${category}', '${ingredients}', '${expiry_date}')`);
    res.status(201).json({ message: 'Product added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routines
app.get('/api/routines/:userId', async (req, res) => {
  try {
    const result = await runQuery(`SELECT * FROM routines WHERE user_id = '${req.params.userId}'`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/routines/:routineId/steps', async (req, res) => {
  try {
    const result = await runQuery(`
      SELECT rs.*, p.brand, p.name as product_name, p.category 
      FROM routine_steps rs 
      JOIN products p ON rs.product_id = p.id 
      WHERE rs.routine_id = '${req.params.routineId}'
      ORDER BY rs.step_order
    `);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logs
app.post('/api/logs', async (req, res) => {
  const { id, user_id, routine_id, date, completion_status, notes, photo_url } = req.body;
  try {
    await runQuery(`INSERT INTO logs (id, user_id, routine_id, date, completion_status, notes, photo_url) VALUES ('${id}', '${user_id}', '${routine_id}', '${date}', '${completion_status}', '${notes}', '${photo_url}')`);
    res.status(201).json({ message: 'Log recorded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logs/:userId', async (req, res) => {
  try {
    const result = await runQuery(`SELECT * FROM logs WHERE user_id = '${req.params.userId}' ORDER BY date DESC`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

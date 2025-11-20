const express = require('express');
const router = express.Router();
const db = require('../DATABASE');
const fetch = require('node-fetch');

const SERVICE_B_URL = process.env.SERVICE_B_URL; // definida no .env


router.post('/', async (req, res) => {
  const { user_id, direction, content } = req.body;
  if (!user_id || !direction || !content) return res.status(400).json({ error: 'user_id, direction e content são obrigatórios' });

  db.run(
    "INSERT INTO messages (user_id, direction, content) VALUES (?, ?, ?)",
    [user_id, direction, content],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      const messageId = this.lastID;

      
      if (SERVICE_B_URL) {
        fetch(SERVICE_B_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message_id: messageId, user_id, direction, content })
        })
        .then(response => response.json())
        .then(data => {
         
          db.run("UPDATE messages SET metadata = ? WHERE id = ?", [JSON.stringify(data), messageId]);
        })
        .catch(err => {
          console.error("Erro ao chamar Serviço B:", err.message);
        });
      }

      res.status(201).json({ id: messageId, user_id, direction, content });
    }
  );
});

router.get('/', (req, res) => {
  const sql = `SELECT m.*, u.phone, u.name
               FROM messages m LEFT JOIN users u ON m.user_id = u.id
               ORDER BY m.created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

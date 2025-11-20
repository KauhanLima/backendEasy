const express = require('express');
const router = express.Router();
const db = require('../DATABASE');

router.post('/', (req, res) => {
  const { phone, name } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone é obrigatório' });

  db.run("INSERT INTO users (phone, name) VALUES (?, ?)", [phone, name], function(err) {
    if (err) return res.status(400).json({ error: err.message });

    db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});


router.get('/', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;

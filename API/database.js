require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DATABASE_URL, (err) => {
  if (err) console.error("Erro ao conectar ao DB:", err);
  else console.log("Conectado ao banco SQL:", process.env.DATABASE_URL);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    direction TEXT,
    content TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

module.exports = db;

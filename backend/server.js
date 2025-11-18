// backend/server.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Banco de dados (arquivo local)
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Cria tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL
    )
  `);
});

// ROTAS CRUD

// Listar todos
app.get("/clients", (req, res) => {
  db.all("SELECT * FROM clients", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar
app.post("/clients", (req, res) => {
  const { name, email, phone, city } = req.body;
  db.run(
    "INSERT INTO clients (name, email, phone, city) VALUES (?, ?, ?, ?)",
    [name, email, phone, city],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, email, phone, city });
    }
  );
});

// Atualizar
app.put("/clients/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, city } = req.body;
  db.run(
    "UPDATE clients SET name=?, email=?, phone=?, city=? WHERE id=?",
    [name, email, phone, city, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Not found" });
      res.json({ id, name, email, phone, city });
    }
  );
});

// Deletar
app.delete("/clients/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM clients WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

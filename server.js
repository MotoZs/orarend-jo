const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('orarend.db', (err) => {
  if (err) {
    console.error('Nem sikerült megnyitni az adatbázist', err.message);
  } else {
    console.log('Csatlakozva az orarend.db adatbázishoz');
  }
});

// Adatbázis inicializálás
const initDB = () => {
  db.run(`CREATE TABLE IF NOT EXISTS orarend (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nap TEXT NOT NULL,
    ora INTEGER NOT NULL,
    tantargy TEXT NOT NULL
  )`);
};

initDB();

app.get('/orarend', (req, res) => {
  db.all('SELECT nap, ora, tantargy FROM orarend', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

app.post('/orarend', (req, res) => {
  const { nap, ora, tantargy } = req.body;
  if (!nap || !ora || !tantargy) return res.status(400).send('Hiányzó adat');

  const sql = 'INSERT INTO orarend (nap, ora, tantargy) VALUES (?, ?, ?)';
  db.run(sql, [nap, ora, tantargy], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send('Hozzáadva');
    }
  });
});

app.delete('/orarend', (req, res) => {
  const { nap, ora } = req.body;
  if (!nap || !ora) return res.status(400).send('Hiányzó nap vagy óra');

  const sql = 'DELETE FROM orarend WHERE nap = ? AND ora = ?';
  db.run(sql, [nap, ora], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send('Törölve');
    }
  });
});

app.put('/orarend', (req, res) => {
  const { nap, ora, tantargy } = req.body;
  if (!nap || !ora || !tantargy) return res.status(400).send('Hiányzó adat');

  const sql = 'UPDATE orarend SET tantargy = ? WHERE nap = ? AND ora = ?';
  db.run(sql, [tantargy, nap, ora], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send('Módosítva');
    }
  });
});

app.listen(3000, () => {
  console.log('API fut: http://localhost:3000');
});

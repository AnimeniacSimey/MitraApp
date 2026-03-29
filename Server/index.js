const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5010;
let pool;



app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

const config = {
  user: process.env.DB_USER || 'mitra_user',
  password: process.env.DB_PASSWORD || 'StrongPass123!',
  server: process.env.DB_SERVER || '127.0.0.1',
  database: process.env.DB_DATABASE || 'MitraDB',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Connect to SQL first, then start the server
sql.connect(config)
  .then(p => {
    pool = p;

    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
  });

// =========================
// ROUTE 1: Get all users
// =========================
app.get('/getuser', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM dbo.userInfo');

    const dataWithTime = result.recordset.map(row => ({
      ...row,
      fetchedAt: new Date().toISOString()
    }));

    res.set('Cache-Control', 'no-store');
    res.json(dataWithTime);
  } catch (err) {
    console.error('❌ Query error:', err);
    res.status(500).send(err.message);
  }
});

// =========================
// ROUTE 2: Add a user
// =========================
app.post('/add-user', async (req, res) => {
  const { first_name, last_name, gender, career, abt, skills, lat, lon } = req.body;

  try {
    const skillsString = Array.isArray(skills) ? skills.join(', ') : skills;

    await pool.request()
      .input('first_name', sql.VarChar(50), first_name)
      .input('last_name', sql.VarChar(50), last_name)
      .input('gender', sql.VarChar(10), gender)
      .input('career', sql.VarChar(50), career)
      .input('abt', sql.VarChar(300), abt)
      .input('skills', sql.VarChar(100), skillsString)
      .input('lat', sql.Float, lat)
      .input('lon', sql.Float, lon)
      .query(`
        INSERT INTO dbo.userInfo
        (First_name, Last_name, gender, career, abt, skills, lat, lon)
        VALUES
        (@first_name, @last_name, @gender, @career, @abt, @skills, @lat, @lon)
      `);

    res.json({ message: 'User added successfully' });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ error: err.message });
  }
});

// =========================
// ROUTE 3: Get locations
// =========================
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        id,
        First_name,
        Last_name,
        lat,
        lon
      FROM dbo.userInfo
      WHERE lat IS NOT NULL AND lon IS NOT NULL
    `);

    const locations = result.recordset.map(row => ({
      id: row.id,
      name: `${row.First_name} ${row.Last_name}`.trim(),
      lat: row.lat,
      lon: row.lon
    }));

    res.set('Cache-Control', 'no-store');
    res.json(locations);
  } catch (err) {
    console.error('❌ Locations query error:', err);
    res.status(500).json({ error: err.message });
  }
});
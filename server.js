require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// DEPARTMENTS ROUTES
// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM departments ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get department by ID
app.get('/api/departments/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create department
app.post('/api/departments', async (req, res) => {
  try {
    const { name, description, building, phone } = req.body;
    const [result] = await db.execute(
      'INSERT INTO departments (name, description, building, phone) VALUES (?, ?, ?, ?)',
      [name, description, building, phone]
    );
    res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update department
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { name, description, building, phone } = req.body;
    const [result] = await db.execute(
      'UPDATE departments SET name = ?, description = ?, building = ?, phone = ? WHERE id = ?',
      [name, description, building, phone, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete department
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM departments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROFESSORS ROUTES
// Get all professors with department names
app.get('/api/professors', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, d.name as department_name 
      FROM professors p 
      LEFT JOIN departments d ON p.department_id = d.id 
      ORDER BY p.last_name, p.first_name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professor by ID
app.get('/api/professors/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, d.name as department_name 
      FROM professors p 
      LEFT JOIN departments d ON p.department_id = d.id 
      WHERE p.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create professor
app.post('/api/professors', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, department_id, office, title, hire_date } = req.body;
    const [result] = await db.execute(
      'INSERT INTO professors (first_name, last_name, email, phone, department_id, office, title, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, department_id, office, title, hire_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Professor created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update professor
app.put('/api/professors/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, department_id, office, title, hire_date } = req.body;
    const [result] = await db.execute(
      'UPDATE professors SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, office = ?, title = ?, hire_date = ? WHERE id = ?',
      [first_name, last_name, email, phone, department_id, office, title, hire_date, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    res.json({ message: 'Professor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete professor
app.delete('/api/professors/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM professors WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    res.json({ message: 'Professor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STUDENTS ROUTES
// Get all students with department names
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, d.name as department_name 
      FROM students s 
      LEFT JOIN departments d ON s.department_id = d.id 
      ORDER BY s.last_name, s.first_name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, d.name as department_name 
      FROM students s 
      LEFT JOIN departments d ON s.department_id = d.id 
      WHERE s.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create student
app.post('/api/students', async (req, res) => {
  try {
    const { student_id, first_name, last_name, email, phone, department_id, enrollment_date, graduation_date, gpa } = req.body;
    const [result] = await db.execute(
      'INSERT INTO students (student_id, first_name, last_name, email, phone, department_id, enrollment_date, graduation_date, gpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [student_id, first_name, last_name, email, phone, department_id, enrollment_date, graduation_date, gpa]
    );
    res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { student_id, first_name, last_name, email, phone, department_id, enrollment_date, graduation_date, gpa } = req.body;
    const [result] = await db.execute(
      'UPDATE students SET student_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, enrollment_date = ?, graduation_date = ?, gpa = ? WHERE id = ?',
      [student_id, first_name, last_name, email, phone, department_id, enrollment_date, graduation_date, gpa, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BOOKS ROUTES
// Get all books with department names
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.*, d.name as department_name 
      FROM books b 
      LEFT JOIN departments d ON b.department_id = d.id 
      ORDER BY b.title
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.*, d.name as department_name 
      FROM books b 
      LEFT JOIN departments d ON b.department_id = d.id 
      WHERE b.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book
app.post('/api/books', async (req, res) => {
  try {
    const { isbn, title, author, publisher, publication_year, edition, price, quantity, department_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO books (isbn, title, author, publisher, publication_year, edition, price, quantity, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [isbn, title, author, publisher, publication_year, edition, price, quantity, department_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Book created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const { isbn, title, author, publisher, publication_year, edition, price, quantity, department_id } = req.body;
    const [result] = await db.execute(
      'UPDATE books SET isbn = ?, title = ?, author = ?, publisher = ?, publication_year = ?, edition = ?, price = ?, quantity = ?, department_id = ? WHERE id = ?',
      [isbn, title, author, publisher, publication_year, edition, price, quantity, department_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
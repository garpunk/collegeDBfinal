require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    // Connect to MySQL server (without database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.execute(`USE ${process.env.DB_NAME}`);

    console.log(`Database ${process.env.DB_NAME} created/selected`);

    // Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        building VARCHAR(50),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create professors table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS professors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department_id INT,
        office VARCHAR(50),
        title VARCHAR(50),
        hire_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      )
    `);

    // Create students table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department_id INT,
        enrollment_date DATE,
        graduation_date DATE,
        gpa DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      )
    `);

    // Create books table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(200) NOT NULL,
        author VARCHAR(100) NOT NULL,
        publisher VARCHAR(100),
        publication_year INT,
        edition INT,
        price DECIMAL(10,2),
        quantity INT DEFAULT 1,
        department_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      )
    `);

    console.log('All tables created successfully');

    // Insert sample data
    await connection.execute(`
      INSERT IGNORE INTO departments (name, description, building, phone) VALUES
      ('Computer Science', 'Department of Computer Science and Engineering', 'Tech Building', '555-0101'),
      ('Mathematics', 'Department of Mathematics and Statistics', 'Science Hall', '555-0102'),
      ('English', 'Department of English Literature and Language', 'Liberal Arts Building', '555-0103'),
      ('Physics', 'Department of Physics and Astronomy', 'Science Hall', '555-0104')
    `);

    await connection.execute(`
      INSERT IGNORE INTO professors (first_name, last_name, email, phone, department_id, office, title, hire_date) VALUES
      ('John', 'Smith', 'j.smith@college.edu', '555-1001', 1, 'TB-201', 'Professor', '2010-08-15'),
      ('Sarah', 'Johnson', 's.johnson@college.edu', '555-1002', 2, 'SH-305', 'Associate Professor', '2012-01-20'),
      ('Michael', 'Brown', 'm.brown@college.edu', '555-1003', 3, 'LAB-102', 'Assistant Professor', '2018-09-01'),
      ('Lisa', 'Davis', 'l.davis@college.edu', '555-1004', 4, 'SH-401', 'Professor', '2008-03-12')
    `);

    await connection.execute(`
      INSERT IGNORE INTO students (student_id, first_name, last_name, email, phone, department_id, enrollment_date, gpa) VALUES
      ('CS2024001', 'Alex', 'Wilson', 'a.wilson@student.college.edu', '555-2001', 1, '2024-01-15', 3.75),
      ('MATH2024002', 'Emma', 'Garcia', 'e.garcia@student.college.edu', '555-2002', 2, '2024-01-15', 3.90),
      ('ENG2024003', 'Daniel', 'Martinez', 'd.martinez@student.college.edu', '555-2003', 3, '2024-01-15', 3.60),
      ('PHYS2024004', 'Olivia', 'Anderson', 'o.anderson@student.college.edu', '555-2004', 4, '2024-01-15', 3.85)
    `);

    await connection.execute(`
      INSERT IGNORE INTO books (isbn, title, author, publisher, publication_year, edition, price, quantity, department_id) VALUES
      ('978-0134685991', 'Effective Java', 'Joshua Bloch', 'Addison-Wesley', 2017, 3, 45.99, 10, 1),
      ('978-0321749925', 'Calculus: Early Transcendentals', 'James Stewart', 'Cengage Learning', 2015, 8, 89.99, 15, 2),
      ('978-0393617436', 'The Norton Anthology of English Literature', 'Stephen Greenblatt', 'W. W. Norton', 2018, 10, 75.50, 8, 3),
      ('978-1429294348', 'University Physics with Modern Physics', 'Hugh Young', 'Pearson', 2019, 15, 95.00, 12, 4)
    `);

    console.log('Sample data inserted successfully');

    await connection.end();
    console.log('Database initialization completed');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
# College Database Management System

A modern web application for managing college data including departments, professors, students, and books. Built with Node.js, Express, MySQL, and a responsive frontend.

## Features

- **Complete CRUD Operations** for all entities
- **Responsive Design** - works on desktop, tablet, and mobile
- **Modern UI** with animations and smooth interactions
- **Real-time Validation** and error handling
- **Department Management** - manage college departments
- **Professor Management** - track faculty information
- **Student Management** - maintain student records
- **Book Management** - catalog books by department

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Libraries**: Font Awesome icons
- **Package Manager**: npm

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Database**
   
   Update the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=college_db
   DB_PORT=3306
   PORT=3000
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```
   This will:
   - Create the database if it doesn't exist
   - Create all necessary tables
   - Insert sample data

5. **Start the Application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Access the Application**
   
   Open your browser and navigate to: `http://localhost:3000`

## Database Schema

### Departments
- `id` (Primary Key)
- `name` (Unique)
- `description`
- `building`
- `phone`
- `created_at`, `updated_at`

### Professors
- `id` (Primary Key)
- `first_name`, `last_name`
- `email` (Unique)
- `phone`
- `department_id` (Foreign Key)
- `office`
- `title`
- `hire_date`
- `created_at`, `updated_at`

### Students
- `id` (Primary Key)
- `student_id` (Unique)
- `first_name`, `last_name`
- `email` (Unique)
- `phone`
- `department_id` (Foreign Key)
- `enrollment_date`
- `graduation_date`
- `gpa`
- `created_at`, `updated_at`

### Books
- `id` (Primary Key)
- `isbn` (Unique)
- `title`
- `author`
- `publisher`
- `publication_year`
- `edition`
- `price`
- `quantity`
- `department_id` (Foreign Key)
- `created_at`, `updated_at`

## API Endpoints

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Professors
- `GET /api/professors` - Get all professors
- `GET /api/professors/:id` - Get professor by ID
- `POST /api/professors` - Create new professor
- `PUT /api/professors/:id` - Update professor
- `DELETE /api/professors/:id` - Delete professor

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## Usage

1. **Navigate Between Sections**: Use the tabs at the top to switch between Departments, Professors, Students, and Books.

2. **Add New Records**: Click the "Add" button in any section to open the form modal.

3. **Edit Records**: Click the "Edit" button next to any record to modify it.

4. **Delete Records**: Click the "Delete" button to remove a record (with confirmation).

5. **Form Validation**: The system validates required fields and email formats automatically.

## Sample Data

The system comes with sample data including:
- 4 departments (Computer Science, Mathematics, English, Physics)
- 4 professors (one per department)
- 4 students (one per department)
- 4 books (one per department)

## Customization

### Adding New Fields
1. Update the database schema in `scripts/init-database.js`
2. Update the API routes in `server.js`
3. Update the frontend forms in `public/index.html`
4. Update the table rendering in `public/script.js`

### Styling
- Modify `public/styles.css` for visual changes
- The CSS uses CSS Grid and Flexbox for responsive design
- Color scheme can be changed by updating CSS variables

### Database Configuration
- Connection settings are in `config/database.js`
- Environment variables in `.env`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Kill existing processes on port 3000

3. **Dependencies Missing**
   - Run `npm install` again
   - Clear npm cache: `npm cache clean --force`

### Development Mode

Run with auto-restart:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Security Notes

- This is a development/demo application
- For production use, implement:
  - Input sanitization
  - SQL injection protection
  - Authentication/authorization
  - HTTPS
  - Environment-specific configurations

## License

This project is open source and available under the MIT License.
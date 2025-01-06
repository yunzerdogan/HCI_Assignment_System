const express = require('express');
const sqlite = require('sqlite3')
const fs = require('fs');
const path = require('path');
const { Course } = require('./classes/models/course');

const app = express();



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'classes')));
// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));

// Serve static files from the "styles" directory within "views"
app.use('/styles', express.static(path.join(__dirname, 'views/styles')));

// Serve static files from the "controller" directory
app.use('/controller', express.static(path.join(__dirname, 'controller')));

fs.open('./db/page.db', 'w', (err, fd) => {
  if(err) {
    console.log('Error creating database file');
  }  
});

fs.close(0, (err) => {
  if(err) {
    console.log('Error closing file');
  }
});

const db = new sqlite.Database('./db/page.db');

if(!db) {
  console.log('Error connecting to database');
}

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS Course (id int, course_name char[128], course_name_eng char[128], PRIMARY KEY(id))');
  db.run('CREATE TABLE IF NOT EXISTS TUTOR (id int, tutor_firstname char[128], tutor_lastname char[128], course_id int, PRIMARY KEY(id), FOREIGN KEY(course_id) REFERENCES Course(id))');
  db.run('CREATE TABLE IF NOT EXISTS STUDENT (id int, student_firstname char[128], student_lastname char[128], points, course_id int, PRIMARY KEY(id), FOREIGN KEY(course_id) REFERENCES Course(id))');
  db.run('CREATE TABLE IF NOT EXISTS ASSIGNMENTS (id int, assignment_name char[128], assignment_due_date datetime, assignment_possible_points int, assignment_actual_points, assignment_tutor_id int, assignment_student_id int, course_id int, PRIMARY KEY(id), FOREIGN KEY(course_id) REFERENCES Course(id) FOREIGN KEY(assignment_tutor_id) REFERENCES TUTOR(id), FOREIGN KEY(assignment_student_id) REFERENCES STUDENT(id))');
});

app.listen(3000);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/overview', (req, res) => {
  res.render('assignmentOverview');
});

app.get('/overviewtutor', (req, res) => {
  res.render('assignmentOverviewTutor');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.post('/addCourse', (req, res) => {
  const newCourse = new Course(
    {
      course_name: req.body.course_name,
      course_name_eng: req.body.course_name_eng
    }
  );

  db.run(`INSERT INTO Course (id, course_name, course_name_eng) VALUES (${newCourse.id}, '${newCourse.course_name}', '${newCourse.course_name_eng}')`);
});

app.put('/newAssignment', (req, res) => {
  const newAssignment = new Assignment({
    assignment_name: req.body.assignment_name,
    assignment_due_date: req.body.assignment_due_date,
    assignment_possible_points: req.body.assignment_possible_points,
    assignment_actual_points: req.body.assignment_actual_points,
    assignment_tutor_id: req.body.assignment_tutor_id,
    assignment_student_id: req.body.assignment_student_id,
    course_id: req.body.course_id
  });

  db.run(`INSERT INTO ASSIGNMENTS (id, assignment_name, assignment_due_date, assignment_possible_points, assignment_actual_points, assignment_tutor_id, assignment_student_id, course_id) VALUES (${newAssignment.id}, '${newAssignment.assignment_name}', '${newAssignment.assignment_due_date}', ${newAssignment.assignment_possible_points}, ${newAssignment.assignment_actual_points}, ${newAssignment.assignment_tutor_id}, ${newAssignment.assignment_student_id}, ${newAssignment.course_id})`);
});

app.put("/addStudent", (req, res) => {
  const student = {
    student_firstname: req.body.student_firstname,
    student_lastname: req.body.student_lastname,
    points: req.body.points,
    course_id: req.body.course_id,
    tutor_id: req.body.tutor_id
  };

  db.run(`INSERT INTO STUDENT (id, student_firstname, student_lastname, points, course_id, tutor_id) VALUES (${student.id}, '${student.student_firstname}', '${student.student_lastname}', ${student.points}, ${student.course_id}, ${student.tutor_id})`);
});

app.get('/mycourses', (req, res) => {
  const course_id = ""

  db.all('SELECT * FROM COURSE WHERE student_id = ?', [],  (err, rows) => {
    if(err) {
      console.log('Error fetching courses');
    }

    rows.forEach((row) => {
      courseList.push(row.course_name);
    });

  });
});

app.get('/myassignments', (req, res) => {
  const student_id = req.query.student_id;
  const assignmentList = [];
  
  db.all('SELECT * FROM ASSIGNMENTS WHERE assignment_student_id = ?', [student_id], (err, rows) => {
    if(err) {
      console.log('Error fetching assignments');
      res.status(500).send('Error fetching assignments');
      return;
    }

    rows.forEach((row) => {
      const newAssignment = {
        assignment_name: row.assignment_name,
        assignment_due_date: row.assignment_due_date,
        assignment_possible_points: row.assignment_possible_points,
        assignment_actual_points: row.assignment_actual_points,
        assignment_tutor_id: row.assignment_tutor_id,
        assignment_student_id: row.assignment_student_id,
        course_id: row.course_id
      };

      assignmentList.push(newAssignment);
    });

    res.json(assignmentList);
  });
});

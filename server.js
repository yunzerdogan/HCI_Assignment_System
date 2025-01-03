const express = require('express');
const sqlite = require('sqlite3')
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');

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
  db.run('CREATE TABLE IF NOT EXISTS STUDENT (id int, student_firstname char[128], student_lastname char[128], points, course_id int, tutor_id int, PRIMARY KEY(id), FOREIGN KEY(course_id) REFERENCES Course(id), FOREIGN KEY(tutor_id) REFERENCES TUTOR(id))');
  db.run('CREATE TABLE IF NOT EXISTS ASSIGNMENTS (id int, assignment_name char[128], assignment_due_date datetime, assignment_possible_points int, assignment_actual_points, assignment_tutor_id int, assignment_student_id int, course_id int, PRIMARY KEY(id), FOREIGN KEY(course_id) REFERENCES Course(id) FOREIGN KEY(assignment_tutor_id) REFERENCES TUTOR(id), FOREIGN KEY(assignment_student_id) REFERENCES STUDENT(id))');
});

app.listen(3000);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', (req, res) => {
  res.render('home');
});
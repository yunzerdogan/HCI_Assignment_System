const express = require('express');
const path = require('path');

const app = express();



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'classes')));
// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));

// Serve static files from the "styles" directory within "views"
app.use('/styles', express.static(path.join(__dirname, 'views/styles')));

// Serve static files from the "controller" directory
app.use('/controller', express.static(path.join(__dirname, 'controller')));

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


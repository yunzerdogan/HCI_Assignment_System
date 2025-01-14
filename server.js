const express = require('express');
const path = require('path');
const np = require('request')

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

app.get('/random-quote', async (req, res) => {
  try {
    np.get({
      url: 'https://api.api-ninjas.com/v1/quotes',
      headers: {
        'X-Api-Key' : 'Bl6EpH3v+x0E5rKHithdnQ==GuO9V6EPNBkGrO8e'
      },
    },
      function(error, response, body){
        if(error) return console.error('Request failed', error);
        else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        else {
          const data = JSON.parse(body);
          const quote = data[0].quote;
          res.json({quote: quote});
        }
      });
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ quote: 'Ok' });
  }
});


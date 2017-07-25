const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const notify = require('./push_notifications/notify');

notify.init();
notify.sendServerStart();

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const teams = require('./routes/teams');
const users = require('./routes/users');
const surveys = require('./routes/surveys');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/surveys', surveys);
app.use('/teams', teams);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Make connection
io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });
});

// Start Server
http.listen(port, () => {
  console.log('Server started on port '+port);
});

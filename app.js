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


// Table
var connectedUsers = {};
var rooms = {};
/*
// Make connection to the app
io.on('connection', (socket) => {
  socket.on('new user', function(data,callback){

    if( connectedUsers.indexOf(data) != -1 ){
      ;
    }else{
      socket.username = data.username
      connectedUsers.push(socket.username)
    }
    console.log(data.username+' is now connected to Room '+ data.teamname)
  })
  
  socket.on('disconnect', function(data){
    if( !socket.username ) return;
    connectedUsers.splice(connectedUsers.indexOf(socket.username));
    console.log(data+' disconnected')
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message}); 
  });
});
*/
// Make connection to the chat rooms
io.on('connection', (socket) => {
  socket.on('new user', function(data,callback){
    console.log(data.username+' is logging into '+ data.teamname +' room...');
    socket.username = data.username;
    socket.room = data.teamname;
    connectedUsers[data.username] = socket.username;
    console.log(socket.username +' is now logged')     
    socket.join(socket.room);
    console.log(socket.adapter.rooms[socket.room]);
    //getting users in room 
    var tempRoom = io.sockets.adapter.rooms[socket.room];
      if( tempRoom ) { 
        Object.keys(tempRoom.sockets).forEach( function(socketId){
          var userChatBox = io.sockets.sockets[socketId].username; 
          console.log(userChatBox);
        }); 
    }
    // emit to the client that he has joined a room
    updateClient(socket, socket.room);
    updateChatRoom(socket, ' connected ');


      //TODO: Add updating the room list
    
      // send messages
      socket.on('add-message', (message) => {
        console.log('debug');
          io.emit('message', {type:'new-message', text: message});    
        });
      //TODO: Switch room 


      socket.on('disconnect', function(data){
        delete connectedUsers[socket.username];

        io.sockets.emit('updateUsers', connectedUsers);
        console.log(data+' disconnected');
        updateGlobal(socket, 'disconnected');
        socket.leave(socket.room);
      });
        
    })
  });  

  function updateClient(socket, newRoom){
    console.log('You are in '+ newRoom);
    socket.emit('updateChat', 'SERVER', 'You\'ve connected to '+ newRoom)
  }

  function updateChatRoom(socket, message){
    socket.broadcast.to(socket.room).emit('updateChat', 'SERVER', socket.username + ' has ' + message)
  }

  function updateGlobal(socket, message) {
    socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has ' + message);
  }


// Start Server
http.listen(port,'0.0.0.0', () => {
  console.log('Server started on port '+port);
});

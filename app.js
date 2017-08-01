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
var connectedUsers = {'aaa':[]};
var rooms = {};
// Make connection to the chat rooms
io.on('connection', (socket) => {
  
  socket.on('new chatter', function(data,callback){
    socket.username = data.username;
    socket.roomname = data.teamname;
    socket.room = data.team_id; 
    console.log(socket.username+' JOINING '+ socket.roomname);
    socket.join(socket.room);
    connectedUsers[data.username]=socket.username;    
    numberUsersInRoom = io.sockets.adapter.rooms[socket.room].length
    console.log('Number of users currently in this room : '+ numberUsersInRoom);
    if (rooms[socket.room]){
      rooms[socket.room].push(socket.username);
    }else{
      rooms[socket.room] = new Array();
      rooms[socket.room].push(socket.username);
    }  
    console.log(rooms[socket.room]);
    //console.log(socket.username +' is now logged')     
    //socket.join(socket.room);
    //console.log(socket.adapter.rooms[socket.room]);
    //getting users in room 
    /*var tempRoom = io.sockets.adapter.rooms[socket.room];
      if( tempRoom ) { 
        Object.keys(tempRoom.sockets).forEach( function(socketId){
          var userChatBox = io.sockets.sockets[socketId].username; 
          (socket.rooms.users).append(userChatBox);
        });
      }*/
    // emit to the client that he has joined a room
    /*updateClient(socket, socket.room);
    updateChatRoom(socket, ' connected ');*/


      //TODO: Add updating the room list

      // Leaving a specific room
      socket.on('disconnect', function(){
        delete connectedUsers[socket.username];

        //io.sockets.emit('updateUsers', connectedUsers);
        console.log(socket.username+' LEAVING '+socket.roomname );
        //updateGlobal(socket, 'disconnected');
        socket.leave(socket.room);
      });
        
    })
      // send messages
      socket.on('add-message', (message) => {
          io.to(message.team).emit('tweet', { text: message.text , username: message.username})
        });

      //TODO: Switch room
      /*socket.on('switch room', (data)=>{
        if(data.newRoom != currentRoom){
          console.log('LEAVING '+currentRoom);
          socket.leave(currentRoom);
          currentRoom=data.newRoom;
          console.log('JOINING '+currentRoom);
          socket.join(currentRoom);
        }else{
          console.log('You are already in this room' )
        }
      })*/  
    
  });  

  function updateClient(socket, newRoom){
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

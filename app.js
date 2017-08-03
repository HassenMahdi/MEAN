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
const stats = require('./routes/stats');
const files = require('./routes/files');

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

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/surveys', surveys);
app.use('/teams', teams);
app.use('/stats', stats);
app.use('/files', files);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});


// Table
var connectedUsers = {};
var rooms = {};
// Make connection to the chat rooms
io.on('connection', (socket) => {
  socket.on('new user', function(data,callback){
    socket.username = data.username
    connectedUsers[data.username]=data.username;
    console.log(data.username + ' has joined SOLAIR !'); 
    console.log('Users currently on dashboard : ', connectedUsers); 


    socket.on('disconnect', function(){
      delete connectedUsers[socket.username];
      console.log(socket.username + ' has left SOLAIR !'); 
      socket.disconnect();
      console.log(' Users currently on dashboard : ', connectedUsers); 
    });
  })
  
  socket.on('new chatter', function(data,callback){
    socket.username = data.username;
    socket.roomname = data.teamname;
    socket.room = data.team_id; 
    //console.log(socket.username+' JOINING '+ socket.roomname);
    socket.join(socket.room);   
    if (rooms[socket.room]){
      if(rooms[socket.room].indexOf(socket.username)==-1){
      rooms[socket.room].push(socket.username);
      }else {}
    }else{
      rooms[socket.room] = new Array();
      rooms[socket.room].push(socket.username);
    }
    updateConnectedUsers(socket, rooms);    
    //console.log('Number of users currently in this room : '+ rooms[socket.room].length);
    //console.log(rooms[socket.room]);
    // emit to the client that he has joined a room
    updateClient(socket, socket.roomname);
    updateChatRoom(socket, ' connected ');

      //TODO: Add updating the room list

      // Leaving a specific room
      socket.on('disconnect', function(){
        delete connectedUsers[socket.username];
        rooms[socket.room].splice(rooms[socket.room].indexOf(socket.username),1)
        //console.log(rooms[socket.room]);
        //io.sockets.emit('updateUsers', connectedUsers);
        //console.log(socket.username+' LEAVING '+socket.roomname );
        updateGlobal(socket, 'disconnected');
        socket.leave(socket.room);
        updateConnectedUsers(socket,rooms);
      });
        
    })
      // send messages
      socket.on('add-message', (message) => {
          io.to(message.team).emit('tweet', {text: message.text , username: message.username})
        });
      
      socket.on('typing', function(data){
        socket.broadcast.to(data.room).emit('tweet', {typingUser: data.username})
      })  

      socket.on('typing end', function(data){
        socket.broadcast.to(data.room).emit('tweet', {noneTypingUser: data.username})
      })  
    
  });  

  function updateClient(socket, newRoom){
    socket.emit('tweet', {newRoom: newRoom,})
  }

  function updateChatRoom(socket, message){
    socket.broadcast.to(socket.room).emit('tweet', {newUser:socket.username, message:message});
  }

  function updateGlobal(socket, message) {
    socket.broadcast.to(socket.room).emit('tweet', {newUser:socket.username, message:message});
  }

  function updateConnectedUsers(socket, rooms) {
    io.to(socket.room).emit( 'tweet', {rooms: rooms[socket.room],});  
  }


// Start Server
http.listen(port,'0.0.0.0', () => {
  console.log('Server started on port '+port);
});

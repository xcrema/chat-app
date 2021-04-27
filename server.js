const express = require('express');
const path =  require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat-App Admin';

//run when client connects 
io.on('connection', socket => {
    
    //Welcomes current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chat-App'));

    //Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    //Runs when client disconnects
    socket.on('disconnect', () =>{
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    //listen to chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('User', msg));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
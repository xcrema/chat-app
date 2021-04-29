const express = require('express');
const path =  require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {joinUser, getCurrentUser, userLeaves, getAllUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat-App Admin';

//run when client connects 
io.on('connection', socket => {


    socket.on('joinChat', ({username}) => {
        const user = joinUser(socket.id, username);

        //Welcomes current user
        socket.emit('message', formatMessage(botName, 'Welcome to Chat-App'));

        //Broadcast when a user connects
        socket.broadcast.emit('message', formatMessage(botName, `${username} has joined the chat`));
    
        //user info 
        io.emit('currentUsers', {
            users: getAllUsers()
        });
        io.emit('currentUser', {});
    
    });
    
    //listen to chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () =>{
        const user = userLeaves(socket.id);
        if(user){
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
        //user info 
        io.emit('currentUsers', {
            users: getAllUsers()
        });
});
    

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
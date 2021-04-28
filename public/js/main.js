const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

//get username from URL
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// join chat
socket.emit('joinChat', {username});

//message from server
socket.on('message', message => {
    console.log(message); 
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('currentUsers', ({users}) => {
    outputUsers(users);
});

socket.on('currentUser', () => {
    const temp = document.getElementById('user');
    temp.innerHTML = `<li>${username}</li><br>`;
});


//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputUsers(users) {
    // console.log(users);
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
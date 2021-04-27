const users = [];

//join user to chat
function joinUser(id, username) {
    const user = {id, username};
    users.push(user);
    return user;
}

// get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//user leaves
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get all users
function getAllUsers() {
    return users;
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeaves,
    getAllUsers
};
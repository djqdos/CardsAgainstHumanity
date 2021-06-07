const users = [];

// Save the user to array
function userJoin(id, username, socketId) {
    const user = { id, username, socketId };

    const index = users.findIndex(u => u.id === id);
    if(index === -1){
        users.push(user);
    }
    else {
        users[index].socketId = socketId; // update the socketId, if we have an existing user
    }        
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function getUsers() {
    console.group("getusers");
    console.table(users);
    console.groupEnd();

    return users;
}

function userLeaves(id) {
    const index = users.findIndex(user => user.socketId === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function logUsers() {
    console.group("Current Users:");
    console.table(users);
    console.groupEnd();
}




module.exports = {
    userJoin,
    getCurrentUser,
    getUsers,
    userLeaves,

    logUsers
};
// Simualted database 
const users = [
    { id: 101, email: 'rodrigo.test@dev.com', name: 'Rodrigo', role: 'admin' },
    { id: 102, email: 'test@user.com', name: 'Test User', role: 'guest' }
];

const findUserEmail = (email) => {
    return users.find(user => user.email === email);
}

module.exports = { findUserEmail };
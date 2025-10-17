// simulating database with users credentials for token-based-auth

const users = [
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member' },
    { id: 2, username: 'Admin', password: 'adminpassword', role: 'admin' }
];

const findUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}

module.exports = { findUser };
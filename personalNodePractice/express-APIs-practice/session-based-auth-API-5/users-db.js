// Simulated User Database 
// ( in a real app, this data would come from a secure database )

const users = [ 
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member' },
    { id: 2, username: 'admin', password: 'adminpassword', role: 'admin' }
];

// function to find username and password
const findUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}

module.exports = { findUser };

const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'happyPets'
});

const users = [
    { id: 1, email: 'john.doe@example.com', password: 'password123' },
    { id: 2, email: 'jane.smith@example.com', password: 'password123' },
    { id: 3, email: 'emily.jones@example.com', password: 'password123' },
    { id: 4, email: 'michael.brown@example.com', password: 'password123' },
    { id: 5, email: 'sarah.davis@example.com', password: 'password123' }
];

users.forEach(user => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    connection.query(query, [hashedPassword, user.id], (err, results) => {
        if (err) {
            console.error('Error updating password for user:', user.email, err);
        } else {
            console.log('Password updated for user:', user.email);
        }
    });
});

connection.end();

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'happyPets'
});

router.use(express.json());  // Parse JSON request bodies

// User signup
router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const role = 'Member'; // Default role assigned to new users

    const query = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [firstName, lastName, email, hashedPassword, role], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.status(201).json({ message: 'User created successfully' });
    });
});

// User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Save the user ID in the session
        req.session.userId = user.id;

        // Respond with success message
        res.status(200).json({ message: 'Login successful' });
    });
});

// Check if user is logged in
router.get('/check', (req, res) => {

    const userId = req.session.userId;

    if (userId) {
        res.status(200).json({ message: 'User is logged in', userId });
    } else {
        res.status(401).json({ message: 'User is not logged in' });
    }
});

// Profile page routes
router.get('/profile', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = 'SELECT first_name, last_name, email FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(results[0]);
    });
});

router.post('/profile', (req, res) => {
    const userId = req.session.userId;
    const { firstName, lastName, email } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?';
    connection.query(query, [firstName, lastName, email, userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

// Create Event
router.post('/events', (req, res) => {
    const { image, title, details } = req.body;

    if (!image || !title || !details) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO events (image, title, details) VALUES (?, ?, ?)';
    connection.query(query, [image, title, details], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        res.status(201).json({ message: 'Event created successfully' });
    });
});

// Update Event
router.put('/events/:id', (req, res) => {
    const eventId = req.params.id;
    const { image_url, title, details } = req.body;

    const query = 'UPDATE events SET image = ?, title = ?, details = ? WHERE id = ?';
    connection.query(query, [image_url, title, details, eventId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully' });
    });
});


// DELETE event
router.delete('/events/:id', (req, res) => {
    const eventId = req.params.id;

    const query = 'DELETE FROM events WHERE id = ?';
    connection.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    });
});


// Get Events
router.get('/events', (req, res) => {
    const query = 'SELECT * FROM events';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});




// Get user information and menu items based on role
const rolesHierarchy = {

    'Member': ['Member'],
    'Manager': ['Member', 'Manager'],
    'Admin': ['Member', 'Manager', 'Admin']

};

router.post('/rsvp', (req, res) => {
    const { event_id } = req.body;

    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sql = `INSERT INTO eventsRSVP (event_id, user_id) VALUES (?, ?)`;
    const values = [event_id, userId];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting RSVP:', err);
        return res.status(500).json({ message: 'Failed to RSVP' });
      }
      console.log('RSVP inserted successfully');
      res.json({ message: 'RSVP successful' });

    });

});

router.get('/user/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE id = ${connection.escape(req.params.id)}`;
    connection.query(sql, (err, userResult) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (userResult.length > 0) {
            const user = userResult[0];
            const roles = rolesHierarchy[user.role] || [];
            sql = `SELECT * FROM menu_items WHERE role IN (${roles.map(role => connection.escape(role)).join(', ')}) ORDER BY position`;
            connection.query(sql, (err, menuResults) => {
                if (err) {
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json({ user, menu: menuResults });
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});

// Get announcements
router.get('/announcements', (req, res) => {
    const query = 'SELECT * FROM announcements ORDER BY created_at DESC'; // Fetch announcements sorted by most recent

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching announcements:', err);
            res.status(500).json({ error: 'Failed to fetch announcements' });
            return;
        }
        res.json(results); // Send JSON response with announcements data
    });
});

// Get user role
router.get('/role', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
    }

    console.log('User ID received:', userId);

    const sql = `SELECT role FROM users WHERE id = ?`;
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            console.error('No user found with id:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const role = results[0].role;
        return res.json({ role });
    });
});

// Post an announcement
router.post('/postAnn', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const sql = 'INSERT INTO announcements (title, content) VALUES (?, ?)';
    connection.query(sql, [title, content], (err, results) => {
        if (err) {
            console.error('Error creating announcement:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Announcement created successfully' });
    });
});

// Faculty routes
router.get('/faculties', (req, res) => {
    const query = `
        SELECT
            f.id,
            f.name,
            COUNT(u.id) AS members_count
        FROM faculties f
        LEFT JOIN users u ON f.id = u.faculty_id
        GROUP BY f.id
    `;
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

router.post('/add-faculty', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO faculties (name, members_count) VALUES (?, 0)';
    connection.query(query, [name], (err, result) => {
        if (err) {
            console.error('Error adding faculty:', err.message, 'Query:', query, 'Params:', [name]);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ success: true, id: result.insertId });
    });
});



router.put('/update-faculty/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE faculties SET name = ? WHERE id = ?';
    connection.query(query, [name, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ success: true });
    });
});


router.delete('/delete-faculty/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM faculties WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ success: true });
    });
});



/*For view members */
router.get('/members', (req, res) => {
    const query = 'SELECT u.id, u.first_name, u.last_name, u.email, f.name as faculty, u.role as role FROM users u LEFT JOIN faculties f ON u.faculty_id = f.id';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

router.put('/update-member/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, faculty, role } = req.body;
    const getFacultyIdQuery = 'SELECT id FROM faculties WHERE name = ?';
    connection.query(getFacultyIdQuery, [faculty], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving faculty ID' });
            return;
        }
        if (results.length > 0) {
            const facultyId = results[0].id;
            const updateQuery = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, faculty_id = ?, role = ? WHERE id = ?';
            connection.query(updateQuery, [first_name, last_name, email, facultyId, role, id], (error, result) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error while updating user' });
                    return;
                }
                res.json({ success: true });
            });
        } else {
            res.status(404).json({ error: 'Faculty not found' });
        }
    });
});


/*Adding a member*/
router.post('/add-member', (req, res) => {
    const { first_name, last_name, email, faculty, role, password } = req.body;
    // First, retrieving the faculty_id based on the faculty name
    connection.query('SELECT id FROM faculties WHERE name = ?', [faculty], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving faculty ID' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Faculty not found' });
            return;
        }
        const facultyId = results[0].id;

        // Now, inserting the new user with the retrieved facultyId and provided password
        const insertQuery = 'INSERT INTO users (first_name, last_name, email, faculty_id, role, password) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(insertQuery, [first_name, last_name, email, facultyId, role, password], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error during user insertion' });
                return;
            }
            res.json({ success: true, id: result.insertId });
        });
    });
});

router.post('/volunteer', (req, res) => {
    // Retrieve userId from session
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).json({ error: 'Please login to complete the form!' });
    }

    const { facultyId } = req.body;

    // Perform MySQL update
    const sql = `UPDATE users SET faculty_id = ? WHERE id = ?`;
    connection.query(sql, [facultyId, userId], (error, results, fields) => {
        if (error) {
            console.error('Error updating faculty in MySQL:', error);
            res.status(500).json({ error: 'Failed to update faculty' });
            return;
        }
        console.log('Updated faculty successfully in MySQL');
        res.json({ success: true });
    });
});

/*Deleting a member*/
router.delete('/delete-member/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ success: true });
    });
});


// Update username
router.post('/update-username', (req, res) => {
    const { username } = req.body;
    const userId = req.session.userId;

    connection.query('UPDATE users SET name = ? WHERE id = ?', [username, userId], (error, results) => {
        if (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        } else {
            res.json({ success: true });
        }
    });
});

// Get current username
router.get('/current-username', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    connection.query('SELECT name FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            const username = results[0].name;
            res.json({ success: true, username });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});

// User logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logout successful' });
    });
});

router.get('/events', (req, res) => {
    const query = 'SELECT * FROM events';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


module.exports = router;
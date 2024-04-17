const express = require('express');
const passport = require('passport');
const User = require('../models/user'); // Import User model

const router = express.Router();

// Render the registration form
router.get('/register', (req, res) => {
    const error = req.query.error;
    res.render('auth/register', { error }); // Pass any error as context data
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use:', email);
            return res.redirect('/api/auth/register?error=Email already in use');
        }

        // Create a new user and save it
        const newUser = new User({ name, email, password });
        await newUser.save(); // Save the user

        console.log('User registered successfully:', newUser);
        res.redirect('/api/auth/login?success=User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        // Redirect to register with the error message
        res.redirect('/api/auth/register?error=' + encodeURIComponent(err.message));
    }
});

// Render the login form
router.get('/login', (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    res.render('auth/login', { error, success });
});

// Handle login using Passport's local strategy
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/movies', // Redirect to the movies list page
    failureRedirect: '/api/auth/login?error=Invalid email or password',
}));

// Logout a user
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        // Redirect to login page with a success message
        res.redirect('/api/auth/login?success=Logout successful');
    });
});

module.exports = router;

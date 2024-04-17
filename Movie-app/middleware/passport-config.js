// Import necessary modules and the User model
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function(passport) {
    // Set up the LocalStrategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Find the user by email
            const user = await User.findOne({ email });

            // If the user is not found, return an error
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            // If passwords match, authentication is successful
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid email or password' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    // Serialize the user ID to the session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialize the user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

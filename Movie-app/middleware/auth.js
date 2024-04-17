module.exports = function authMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect the user to the login page if not authenticated
    res.redirect('/api/auth/login?error=Please log in to access this page');
};

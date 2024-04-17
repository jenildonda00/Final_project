const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const initializePassport = require('./middleware/passport-config'); // Import passport config

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jenildonda00:Jenil12@cluster0.ovmqhta.mongodb.net/';
const SESSION_SECRET = process.env.SESSION_SECRET || '3c9c05cf6344cebcc87bd7015802d3250a932d8d3b2fe6a7935767b71616ebed589c34da2325f5c54dcbcaf1560f0fed290f0ab52854d6d1dadef612adc5e573';

// Configure Handlebars view engine
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session
app.use(expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
}));

// Initialize Passport.js
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const moviesRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
app.use('/api/movies', moviesRoutes);
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

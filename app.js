require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const initializePassport = require('./middleware/passport-config');
const authMiddleware = require('./middleware/auth');
const moviesRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const methodOverride = require('method-override');

// App configuration
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jenildonda00:Jenil12@cluster0.ovmqhta.mongodb.net/sample_mflix';
const SESSION_SECRET = process.env.SESSION_SECRET || '3c9c05cf6344cebcc87bd7015802d3250a932d8d3b2fe6a7935767b71616ebed589c34da2325f5c54dcbcaf1560f0fed290f0ab52854d6d1dadef612adc5e573';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Configure session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
}));

// Initialize Passport.js
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configure Handlebars view engine
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        join: (array, delimiter) => Array.isArray(array) ? array.join(delimiter) : array,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        increment: (a, b) => a + b,
        decrement: (a, b) => a - b,
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/movies', authMiddleware, moviesRoutes); // Use authMiddleware to protect movies routes
app.use('/DeleteMovie/', authMiddleware, moviesRoutes);
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
    const user = req.user;
    res.render('home', { user });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Import updated DB connection
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Middleware to store last visited page
app.use((req, res, next) => {
    if (req.session && req.session.user && !['/login', '/register', '/logout'].includes(req.originalUrl)) {
        req.session.lastPage = req.originalUrl;
    }
    next();
});

app.get('/session-data', authController.getSessionData);

//Auth Routes
app.use('/', authRoutes);

// EJS View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
    if (req.session && req.session.lastPage && req.session.lastPage !== '/') {
        return res.redirect(req.session.lastPage);
    }
    res.render('pages/index');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

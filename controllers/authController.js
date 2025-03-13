const User = require('../models/user');
const { generateToken } = require('../utils/jwt'); 

// Render Registration Page
exports.getRegister = (req, res) => {
    res.render('pages/register', { error: null });
};

// Handle Registration Logic
exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('pages/register', { error: 'Email already exists!' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = generateToken(newUser); // Generate JWT token
        req.session.user = newUser;
        req.session.token = token; // Store token in session
        res.redirect('/dashboard');
    } catch (err) {
        res.render('pages/register', { error: 'Registration failed!' });
    }
};

// Render Login Page
exports.getLogin = (req, res) => {
    res.render('pages/login', { error: null });
};

// Handle Login Logic
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.render('pages/login', { error: 'Invalid email or password!' });
        }

        const token = generateToken(user); // Generate JWT token
        //console.log('Generated Token:', token); 
        req.session.user = user;
        req.session.token = token; // Store token in session
        const redirectTo = req.session.lastPage || '/dashboard';
        res.redirect(redirectTo);
    } catch (err) {
        console.error('Login Error:', err); // Log the error
        res.render('pages/login', { error: 'Login failed!' });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// Dashboard
exports.getDashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('pages/dashboard', { user: req.session.user });
};

// Get Session Data (for debugging)
exports.getSessionData = (req, res) => {
    res.json(req.session);
};

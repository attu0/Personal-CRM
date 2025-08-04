const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Load environment variables from .env file FIRST
dotenv.config();

// Passport config (now that .env is loaded)
require('./config/passport')(passport);

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Express Session Middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/share', require('./routes/shareRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

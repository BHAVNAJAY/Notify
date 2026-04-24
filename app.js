require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Body parsers - MOVED UP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware - MUST BE BEFORE PASSPORT
app.use(session({
  secret: 'keyboard cat', 
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
   //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  // Date.now() - 30 * 24 * 60 * 60 * 1000
}));

// Passport middleware - MUST BE AFTER SESSION
app.use(passport.initialize());
app.use(passport.session());

// Method override middleware for PUT and DELETE requests
app.use(methodOverride('_method'));

// Static files
app.use(express.static('public'));

// View engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

//  Start server
app.listen(port, () => {
  console.log(`App Listening on port ${port}`);
});
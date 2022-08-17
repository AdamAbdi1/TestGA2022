//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const session = require('express-session')
const mongoose = require ('mongoose');
const Employee = require('./models/employee.js')
const userController = require('./controllers/users_controller.js')
const sessionsController = require('./controllers/sessions_controller.js')
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI );

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  )
  
//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
app.use(express.session());

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

app.use('/users', userController)

app.use('/sessions', sessionsController)

//___________________
// Routes
//___________________
//localhost:3000

app.delete("/employee/:id", (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/employee')
    })
})

app.get('/home', (req, res) => {
    res.render('home.ejs')
})

app.get('/' , (req, res) => {
  res.render('welcome.ejs');
});


app.get('/homepage', (req, res) => {
    Employee.find({}, (err, data) => {
        res.render('index.ejs', {
            employee: data,
            currentUser: req.session.currentUser
        })
    })
})

app.get('/employee', (req, res) => {
    Employee.find({}, (err, data) => {
        res.render('show.ejs', {
            employee: data
        })
    })
})

app.get('/employee/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/employee/', (req, res) => {
    Employee.create(req.body, (err, data) => {
        res.redirect('/employee')
    })
})

app.get('/employee/:id', (req, res) => {
    Employee.findById(req.params.id, (err, data) => {
        res.render('indiv.ejs', {
            employee: data
        })
    })
})

app.get('/employee/:id/edit', (req, res) => {
    Employee.findById(req.params.id, (err, data) => {
        res.render('edit.ejs', {
            employee: data
        })
    })
})

app.put('/employee/:id', (req, res) => {
    Employee.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, data) => {
        res.redirect('/employee')
    })
})

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));

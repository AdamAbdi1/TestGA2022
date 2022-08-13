//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Employee = require('./models/employee.js')
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

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000

app.delete("/employee/:id", (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect('/employee')
    })
})

app.get('/' , (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/homepage', (req, res) => {
    res.render('index.ejs')
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
    res.send('change')
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

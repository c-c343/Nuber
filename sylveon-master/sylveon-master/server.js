// Main runner.
require('dotenv').config({ path: 'process.env'});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const chalk = require('chalk');

const auth = require('./controllers/auth');
const apiController = require('./controllers/api');
const AdminController = require('./controllers/adminController');
const RiderController = require('./controllers/riderController');
const DriverController = require('./controllers/driverController');

const User = require('./models/user');

// DB connect
mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/" + process.env.DB_NAME);

// Config
app.set('host', process.env.HOST);
app.set('port', process.env.PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route definitions
app.use('/api', apiController);
app.use('/admin', auth.passport.authenticate('jwt', {session: false}), auth.adminRequired, AdminController);
app.use('/driver', auth.passport.authenticate('jwt', {session: false}), auth.driverRequired, DriverController);
app.use('/rider', auth.passport.authenticate('jwt', {session: false}), auth.riderRequired, RiderController);

// Generate root user if not exists
 User.findOne({role:"admin"}, (err, user) => {
    if (!user) {
        User.create({name: "root", password: "rootpw", role: "admin"}, (err, rootUser) => {
            console.log("Generated root account, password: " + rootUser.password);
        });
    }
    else {
        
    }
});

module.exports = app;
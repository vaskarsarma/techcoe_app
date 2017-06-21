var express = require("express");
var app = express();
var path = require("path");
var hbs = require("express-handlebars");
var bodyparser = require("body-parser");
var db = require('./models/db');
var expressValidator = require('express-validator');
var flash = require('connect-flash');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs({
    defaultLayout: 'layout'
        // Example to use custom helper function for HandleBar
        ,
    helpers: {
        CheckEmpty: require("./public/js/customcheckempty"),
        CheckNumber: require("./public/js/customchecknumber"),
        IsAdmin: require("./public/js/isadmin"),
        CheckIsAdmin: require("./public/js/checkisadmin")
    }
}));
app.set('view engine', 'handlebars');

require("./passport/init");

// Configuring Passport
var passport = require("passport");
var expressSession = require('express-session');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Use Express-Validator to retrun form validation messages
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());

app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

var authRouter = require('./controllers/authroute');
app.use('/', authRouter);

var forgotpwd = require('./controllers/forgotpwd');
app.use('/', forgotpwd);

app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect("/login");
});

var homeroute = require('./controllers/home');
app.use("/", homeroute);

var adminroute = require('./controllers/adminroute');
app.use("/admin", adminroute);

//Error handling
app.get('*', function(req, res, next) {
    var err = new Error("Failed to load resource");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if (err.status == 404) {
        res.status(404);
        res.render('error', { errorcode: 404 });
        return true;
    } else
        next();
});

// Handle un-caught error
process.on("uncaughtException", function(err) {
    console.log("There is some unhandled errors in the application");
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

// Connect to Mongo on start
db.connect(db.url, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        console.log("Connected to database");
        // Initiate Server
        var port = 1337;
        app.listen(port, function() {
            console.log("Server started at port " + port);
        });
    }
});

module.exports = app;
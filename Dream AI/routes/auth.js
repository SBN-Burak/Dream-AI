const express = require("express");
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const session = require('express-session');

let db = require("./db");

require("dotenv").config();

const { PythonShell } = require("python-shell");
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    function (accessToken, refreshToken, params, profile, cb) {
        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //    return cb(err, user);
        //});
        return cb(null, profile);
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

router.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/google/',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

router.get('/google/callback/',
    passport.authenticate('google', {
        successRedirect: '/auth/playground',
        failureRedirect: '/auth/google/failure'
    })
);

//db.PrintTotalUsers();
//db.UpdateUser("acoopapoo@gmail.com", 1);
//db.DeleteUser("eldivas0671@gmail.com");
//db.InsertUser("şşş@gmail.com", 8585);
//db.PrintTable();
//db.DecreaseUserToken("eldivas0671@gmail.com", 1);

// successRedirect
router.get('/playground', isLoggedIn, (req, res, next) => {

    const name = req.user.displayName;
    const email = req.user.emails[0].value;

    // eskiden bunu yapıyordum ama şimdi bunların içine koydum. Otomatik çalışıyor.
    //db.RunDB();
    db.InsertUser(`${email}`, 0);

    res.render("playground", { userName: name });
});

router.post('/playground', isLoggedIn, (req, res, next) => {

    const name = req.user.displayName;

    try {
        const { ruyatextarea } = req.body;
        const options = {
            pythonPath: 'python',
            args: [ruyatextarea], // Pass the user input as an argument to the Python script
        };
        PythonShell.run('deneme.py', options).then(messages => {
            const messageText = messages.join('\n');
            res.render("playground", { outputText: messageText, userName: name });
        });
    } catch (error) {
        console.error('Error while calling Python:', error);
        res.status(500).send('An error occurred while calling Python.');
    }
});

// failureRedirect
router.get('/google/failure', (req, res) => {
    res.send("Failed! Try again.");
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

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

// successRedirect
router.get('/playground', isLoggedIn, async (req, res, next) => {

    const name = req.user.displayName;
    const email = req.user.emails[0].value;
    const jeton = await db.GetUserToken(`${email}`);

    db.InsertUser(`${email}`, 0);

    res.render("playground", { userName: name, token: jeton });
});

router.post('/playground', isLoggedIn, async (req, res, next) => {

    const email = req.user.emails[0].value;
    const name = req.user.displayName;
    let jeton = await db.GetUserToken(email);

    if (jeton >= 1) {
        try {
            const { ruyatextarea } = req.body; // Bunun açılımı bu: req.body.ruyatextarea 
            const options = {
                pythonPath: 'python',
                args: [ruyatextarea], // Pass the user input as an argument to the Python script
            };
            PythonShell.run('chatgpt.py', options).then(messages => {
                const messageText = messages.join('\n');
                db.DecreaseUserToken(email, 1);
                res.send({ outputText: messageText, userName: name, token: jeton });
            });
        } catch (error) {
            console.error('Error while calling Python:', error);
            res.status(500).send('An error occurred while calling Python.');
        }
    }
    else {
        res.send({ outputText: "Yeterli Jeton Kalmadı!", userName: name, token: jeton });
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

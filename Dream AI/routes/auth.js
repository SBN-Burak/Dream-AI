const express = require("express");
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const session = require('express-session');

require("dotenv").config();

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

router.get('/', (req, res) => {
    res.send('<a href="auth/google/">Login with Google</a>');
});

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

router.get('/playground/', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    res.render("playground", { userName: name });
});

router.get('/google/failure', (req, res) => {
    res.send("Failed!");
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

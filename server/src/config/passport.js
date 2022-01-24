


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const User = require('../models/User');
const passport = require('passport')

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) 
{
User.findOne({ _id: jwt_payload.id }, function (err, user) {
    if (err) {
        return done(err, false);
    }
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});
}
));




// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const LocalStrategy = require("passport-local").Strategy;
// const passport = require("passport");
// const User = require("../models/User");


// passport.use(new LocalStrategy({usernameField:"email"},
//     function(email, password, done) {
//       User.findOne({ email: email }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//             console.log("Not found")
//             return done(null, false,{ message: 'Incorrect username.' }); }
//         if (!bcrypt.compare(password,user.password)) { return done(null, false,{ message: 'Incorrect password.' }); }
//         console.log("passed")
//         return done(null, user);
//       });
//     }
//   ));


//   //Persists user data inside session
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// //Fetches session details using session id
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

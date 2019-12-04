const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
   ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
opts.secretOrKey = process.env.JWT_SECRET;

// Local strategy is used for generating JWTs
passport.use(new localStrategy((user, password, cb) => {
   // here is where we would do a DB call usually, stubbed until DB
      User.findOne({name: user, password: password}, (err, user) => {
         if (err) return cb(null, false, {message: 'An error occurred while logging in.'});
         if (!user) return cb(null, false, {message: 'Incorrect username/password.'});
         user = {
            name: user.name,
            role: user.role
         };
         return cb(null, user, {message: "Logged in."});
      });
   }
));

passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
   return done(null, jwtPayload);
}));

exports.adminRequired = function (req, res, next){
   if (req.user.role != "admin") return res.status(403).json({"msg": "You are not allowed to access this page."});
   return next();
}

exports.driverRequired = function (req, res, next){
   if (req.user.role != "driver") return res.status(403).json({"msg": "You are not allowed to access this page."});
   return next();
}

exports.riderRequired = function (req, res, next){
   if (req.user.role != "rider") return res.status(403).json({"msg": "You are not allowed to access this page."});
   return next();
}

exports.passport = passport;
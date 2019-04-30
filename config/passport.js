const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// load up the user model
const User = require("../models/User");

// load the auth variables
const configAuth = require("./auth");

const passport = require("passport");

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// code for login (use('local-login', new LocalStategy))
// code for signup (use('local-signup', new LocalStategy))

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(
  new FacebookStrategy(
    {
      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      passReqToCallback: true
    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, cb) {
      // console.log(accessToken, refreshToken, profile, cb);
      // cb(null, profile);
      // asynchronous
      process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {
          // find the user in the database based on their facebook id
          User.findOne({ "facebook.id": profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) {
              console.log("error");
              return cb(err);
            }

            // if the user is found, then log them in
            if (user) {
              console.log("User already exists");

              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.Name = profile.name.givenName + " " + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                user.save(function(err) {
                  if (err) return cb(err);
                  return done(null, user);
                });
              }
              return cb(null, user); // user found, return that user
            } else {
              // if there is no user found with that facebook id, create them
              const newUser = new User();

              // set all of the facebook information in our user model
              newUser.facebook.id = profile.id; // set the users facebook id
              newUser.facebook.token = token; // we will save the token that facebook provides to the user
              newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.facebook.email = profile._json.email; // facebook can return multiple emails so we'll take the first
              // save our user to the database
              newUser.save(function(err) {
                if (err) console.log(err);

                // if successful, return the new user
                console.log("new user created");
                return cb(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + " " + profile.name.familyName;
          user.facebook.email = profile._json.email;

          // save the user
          user.save(function(err) {
            if (err) return cb(err);
            return cb(null, user);
          });
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, cb) {
      // console.log(accessToken, refreshToken, profile, cb);
      // cb(null, profile);
      // asynchronous
      process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {
          // find the user in the database based on their facebook id
          User.findOne({ "google.id": profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) {
              console.log("error");
              return cb(err);
            }

            // if the user is found, then log them in
            if (user) {
              console.log("User already exists");

              if (!user.google.token) {
                user.google.token = req;
                user.google.Name = profile.name.displayName;
                user.google.email = profile.emails[0].value;
                console.log("User token updated");
                console.log(req);
                // save the user
                user.save(function(err) {
                  if (err) return cb(err);
                  return cb(null, user);
                });
              }
              return cb(null, user); // user found, return that user
            } else {
              // if there is no user found with that facebook id, create them
              const newUser = new User();

              // set all of the facebook information in our user model
              newUser.google.id = profile.id; // set the users facebook id
              newUser.google.token = token; // we will save the token that facebook provides to the user
              newUser.google.name = profile.name.displayName; // look at the passport user profile to see how names are returned
              newUser.google.email = profile._json.email; // facebook can return multiple emails so we'll take the first
              // save our user to the database
              newUser.save(function(err) {
                if (err) console.log(err);

                // if successful, return the new user
                console.log("new user created");
                return cb(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.google.id = profile.id;
          user.google.token = token;
          user.google.Name = profile.name.displayName;
          user.google.email = profile.emails[0].value;

          // save the user
          user.save(function(err) {
            if (err) return cb(err);
            return cb(null, user);
          });
        }
      });
    }
  )
);

module.exports = passport;

const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../../models/User");

router.post("/signup", (req, res, next) => {
  User.find({ "local.email": req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "email id already registered"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              error: err
            });
          } else {
            const newUser = new User();
            newUser._id = new mongoose.Types.ObjectId();
            newUser.local.email = req.body.email;
            newUser.local.password = hash;
            newUser.local.Name = req.body.name;
            newUser
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created",
                  result
                });
              })
              .catch(err => {
                res.status(500).send({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  if (req.body.token) {
    try {
      const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
      return res.status(200).json({
        message: "jwt decoded",
        user: decoded
      });
    } catch {
      return res.status(401).json({
        message: "Auth Failed"
      });
    }
  }
  User.find({ "local.email": req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      bcrypt
        .compare(req.body.password, user[0].local.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                id: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "2h"
              }
            );
            user[0].local.password = undefined;
            return res.status(200).json({
              // message: "Login Succesfull",
              local: user[0]
            });
          }
        })
        .catch(err => {
          res.status(405).json({
            message: "Auth Failed"
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get(
  "/auth/facebook/",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

// handle the callback after facebook has authenticated the user
router.get(
  "/auth/facebook/callback/",
  passport.authenticate("facebook", {
    // successRedirect: "http://localhost:3000/profile",
    failureRedirect: "/"
  }),
  function(req, res) {
    let token = req.user;
    res.redirect("http://localhost:3000?token=" + JSON.stringify(token));
  }
);

// send to facebook to do the authentication
router.get(
  "/connect/facebook",
  passport.authorize("facebook", {
    scope: ["public_profile", "email"]
  })
);

// handle the callback after facebook has authorized the user
router.get(
  "/connect/facebook/callback",
  passport.authorize("facebook", {
    // successRedirect: "http://localhost:3000/profile",
    failureRedirect: "/"
  }),
  function(req, res) {
    let token = req.user;
    res.redirect("http://localhost:3000?token=" + JSON.stringify(token));
  }
);

router.get("/unlink/facebook", function(req, res) {
  var user = req.user;
  user.facebook.token = undefined;
  user.save(function(err) {
    res.redirect("http://localhost:3000?token=" + JSON.stringify(user));
  });
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// the callback after google has authenticated the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    // successRedirect: "http://localhost:3000/profile",
    failureRedirect: "/"
  }),
  function(req, res) {
    let token = req.user;
    res.redirect("http://localhost:3000?token=" + JSON.stringify(token));
  }
);

router.get("/connect/google", passport.authorize("google", { scope: ["profile", "email"] }));

// the callback after google has authorized the user
router.get(
  "/connect/google/callback",
  passport.authorize("google", {
    // successRedirect: "http://localhost:3000/profile",
    failureRedirect: "/"
  }),
  function(req, res) {
    let token = req.user;
    res.redirect("http://localhost:3000?token=" + JSON.stringify(token));
  }
);

router.get("/unlink/google", function(req, res) {
  var user = req.user;
  user.google.token = undefined;
  user.save(function(err) {
    res.redirect("http://localhost:3000?token=" + JSON.stringify(user));
  });
});

router.get("/profile", function(req, res) {
  res.status(200).json({
    user: req.user
  });
});

// route for logging out
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.delete("/profile/:userId", (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(user => {
      res.status(200).json({
        message: "User Succesfully Deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

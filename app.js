//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");

const flash = require('express-flash')


var configDB = require('./config/database.js');

const app = express();

app.use(flash())

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

// =========== MONGOOSE CONNECTION =======================
mongoose.connect(configDB.url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

require('./config/passport')(passport)

// =========== SETUP SESSION ========================
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// =========== SETUP ROUTER ================
const userRouter = require("./routes/user.route");
app.use('/user', userRouter);

const adminRouter = require("./routes/admin.route");
app.use('/admin', adminRouter);

require("./routes/route")(app, passport)

















// app.route("/")
//     .get(function(req, res){
//         res.redirect("/admin")
//     });


// app.route("/login")
//     .get(function(req, res){
//         res.render("login");
//     })

//     .post( function(req, res){
//         const user = new User({
//           username: req.body.username,
//           password: req.body.password
//         });
      
//         req.login(user, function(err){
//           if (err) {
//             console.log("Hello");
//             res.redirect("/register")
//           } else {
//             passport.authenticate("local")(req, res, function(){
//               res.redirect("/admin");
//             });
//           }
//         });
//       });

// app.route("/register")
//     .get(function(req, res){
//         res.render("register");
//     })

//     .post(function(req, res){
//         User.register({username: req.body.username}, req.body.password, function(err, user){
//           if (err) {
//             console.log(err);
//             res.redirect("/register");
//           } else {
//             passport.authenticate("local")(req, res, function(){
//               res.redirect("/admin");
//             });
//           }
//         });
//     })


// app.route("/admin")
//     .get(function(req, res){
//         if (req.isAuthenticated()){
//           console.log(req.user.IDGV);
//             res.render("admin");
//         } else {
//             res.redirect("/login");
//         }
//     })

// app.get("/logout", function(req, res){
//   req.logout();
//   res.redirect("/");
// });

// app.route("/account")
//   .get((req, res) => {

//   });


const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
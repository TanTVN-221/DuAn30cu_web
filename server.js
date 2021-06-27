//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const path = require("path");
const flash = require('express-flash')

const publicDirectoryPath = path.join(__dirname, "/public")
// console.log(publicDirectoryPath);

var configDB = require('./config/database.js');

const app = express();

app.use(flash())

app.use(express.static(publicDirectoryPath));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

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

app.get('*', (req, res) => {
  res.send("404")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});
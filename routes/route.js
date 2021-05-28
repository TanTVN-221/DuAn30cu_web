const userModel = require("../models/user.model")

const router = require("express").Router()

module.exports = function(app, passport) {
    app.get("/", (req, res) => {
        res.redirect("/login")
    })
    
    app.get("/login", checkNotAuthenticated, (req, res) => {
        res.render('login')
    })

    app.get("/register", checkNotAuthenticated,(req, res) => {
        res.render('register')
    })

    app.get("/account", checkAuthenticated, (req, res) => {
        if (req.user.username === 'admin') {
            res.redirect("/admin")
        }
        else {
            res.redirect("/user/" + req.user._id)
        }
    })
    
    app.post('/login', checkNotAuthenticated, passport.authenticate("local-login", {
        successRedirect : '/account',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.post('/register', checkNotAuthenticated, passport.authenticate('local-signup', {
        successRedirect: '/login', // chuyển hướng tới trang được bảo vệ
        failureRedirect: '/register', // trở lại trang đăng ký nếu có lỗi
        failureFlash: true // allow flash messages
    }));

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/account')
    }
    next()
  }

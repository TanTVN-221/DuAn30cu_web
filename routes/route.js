const userModel = require("../models/user.model")

const router = require("express").Router()

module.exports = function (app, passport) {

    // Redirect route login
    app.get("/", (req, res) => {
        res.redirect("/login")
    })

    // Get login
    app.get("/login", checkNotAuthenticated, (req, res) => {
        res.render('login')
    })

    // Middle route to redirect correct
    app.get("/account", checkAuthenticated, (req, res) => {
        if (req.user.role === 'admin') { // Check admin or user to redirect correct
            res.redirect("/admin")
        } else {
            res.redirect("/user/" + req.user._id)
        }
    })

    // Post Login
    app.post('/login', checkNotAuthenticated, passport.authenticate("local-login", {
        successRedirect: '/account',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Post Register
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


// Check authenticate admin
function checkAuthenticated_admin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next()
    }

    res.redirect('/login')
}

// Check authenticate user
function checkAuthenticated_user(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "teacher") {
        return next()
    }

    res.redirect('/login')
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
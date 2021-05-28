// config/passport.js
// load những thứ chúng ta cần
var LocalStrategy = require('passport-local').Strategy;
// load  user model
var User = require('../models/user.model');
module.exports = function (passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // mặc định local strategy sử dụng username và password,
            // chúng ta cần cấu hình lại
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
        },
        function (req, username, password, done) {
            // asynchronous
            // Hàm callback của nextTick chỉ được thực hiện khi hàm trên nó trong stack (LIFO) được thực hiện
            // User.findOne sẽ không được gọi cho tới khi dữ liệu được gửi lại
            process.nextTick(function () {
                // Tìm một user theo email
                // chúng ta kiểm tra xem user đã tồn tại hay không
                User.findOne({'username': username}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false,  {message: 'That username is already taken.'});
                    } else {
                        // Nếu chưa user nào sử dụng email này
                        // tạo mới user
                        var newUser = new User();
                        // lưu thông tin cho tài khoản local
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        // lưu user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
    
    // =================== LOCAL-LOGIN ========================
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) { // callback với email và password từ html form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        // tìm một user với email
        // chúng ta sẽ kiểm tra xem user có thể đăng nhập không
        User.findOne({'username': username}, function (err, user) {
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null, false, {message: 'No found user'});
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, {message: 'Incorrect password'}); // thông báo lỗi chỉ này chỉ dùng khi dev
            // all is well, return successful user
            return done(null, user);
        });
    })
    );
    
};
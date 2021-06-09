const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

var userSchema = mongoose.Schema({
    id: String,
    password: String,
    name: String,
    isAdmin: String
})

// methods ======================
// // phương thực sinh chuỗi hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// kiểm tra password có hợp lệ không
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
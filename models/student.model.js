const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    name: String,
    phonenumber: String
})

module.exports = mongoose.model('Student', studentSchema)
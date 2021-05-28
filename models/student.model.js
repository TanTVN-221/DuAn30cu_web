const mongoose = require("mongoose")

const studentSchema = mongoose.Schema({
    studentname: String,
    studentphone: String
})

const student = mongoose.model("Student", studentSchema)

module.exports = student

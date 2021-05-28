const mongoose = require("mongoose")
const Class = require("../models/class.model")

const timeTableSchema = mongoose.Schema({
    date: Date,
    listClass: [Class]
})

module.exports = mongoose.model("Timetable", timeTableSchema)
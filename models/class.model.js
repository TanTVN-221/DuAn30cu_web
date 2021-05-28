const mongoose = require("mongoose")
const { deleteOne } = require("../models/student.model")
const Student = require("../models/student.model")

const classSchema = mongoose.Schema({
    classid: String,
    classname: String,
    liststudent: [Student.schema]
})

var Class = mongoose.model("Class", classSchema)

function addClass(classid, classname) {

    var Class = mongoose.model("Class", classSchema)
    const newclass = new Class({
        classid: classid,
        classname: classname,
        liststudent: []
    })
    newclass.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Add class successful");
        }
    })
}

function all () {
    return new Promise(function(resolve, reject) {
        Class.find({}, 'classid classname', function(err, found) {
            if (err) 
                reject(err)
            else 
                resolve(found)
        })
    })
}



module.exports = {
    addClass,
    all
}

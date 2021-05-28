const mongoose = require("mongoose")
const Student = require("../models/student.model")

const classSchema = mongoose.Schema({
    classid: String,
    classname: String,
    liststudent: [Student.schema]
})

var Class = mongoose.model("Class", classSchema)

function addClass(classid, classname) {
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

function all() {
    return new Promise(function (resolve, reject) {
        Class.find({}, 'classid classname', function (err, found) {
            if (err)
                reject(err)
            else
                resolve(found)
        })
    })
}

function getClassById(id) {
    return new Promise(function (resolve, reject) {
        Class.findById({
            _id: id
        }, 'classid classname liststudent', (err, foundClass) => {
            if (err)
                reject(err)
            else {
                // console.log(foundClass);
                resolve(foundClass)
            }

        })
    })

}

function addStudent(classid, student) {


    Class.findById({
        _id: classid
    }, 'liststudent', (err, foundClass) => {
        if (err)
            console.log(err);
        else {
            foundClass.liststudent.push(student)
            foundClass.save((err) => {
                if (err)
                    console.log(err);
                else {
                    console.log("Add student successful");
                }
            })
        }

    })


}

module.exports = {
    addClass,
    all,
    getClassById,
    addStudent
}
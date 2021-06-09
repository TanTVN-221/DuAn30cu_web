const mongoose = require("mongoose")
const Student = require("../models/student.model")

const classSchema = mongoose.Schema({
    classid: String,
    classname: String,
    liststudent: [Student.schema]
})

var Class = mongoose.model("Class", classSchema)

// Function add class
function addClass(classid, classname) {
    const newclass = new Class({
        classid: classid,
        classname: classname,
        liststudent: []
    })
    
    newclass
        .save(newclass)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
}

// Function update class
function updateClass(class_id, classid, classname) {
    try {
        return new Promise((resolve, reject) => {
            Class.updateOne({
                    _id: class_id,
                }, {
                    $set: {
                        "classid": classid,
                        "classname": classname
                    }
                },
                (error, doc) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                        return reject(error);
                    } else {
                        console.log(doc);
                        resolve(doc);
                    }
                })
        })
    } catch (error) {
        console.log(error);
    }
}

// Function view all class
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

// Function view class of spectific class
function getClassById(id) {
    return new Promise(function (resolve, reject) {
        Class.findById({
            _id: id
        }, 'classid classname liststudent', (err, foundClass) => {
            if (err)
                reject(err)
            else {
                resolve(foundClass)
            }
        })
    })

}

// Function get list student by classid
function getListStudentByClassId(classid) {
    return new Promise(function (resolve, reject) {
        Class.findOne({
            classid: classid
        }, (err, foundClass) => {
            if (err)
                reject(err)
            else {
                resolve(JSON.parse(JSON.stringify(foundClass)))
            }
        })
    })
}

// Function add student to class
function addStudent(classid, student) {
    Class.findById({
        _id: classid
    }, 'liststudent', (err, foundClass) => {
        if (err)
            console.log(err);
        else {
            foundClass.liststudent.push(student)
            foundClass
                .save()
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(result);
                })
            // foundClass.save((err) => {
            //     if (err)
            //         console.log(err);
            //     else {
            //         console.log("Add student successful");
            //     }
            // })
        }
    })
}

// Function update student in spectific class
function updateStudent(classid, studentid, studentname, studentphone) {
    console.log(studentid);
    console.log(studentname);
    console.log(studentphone);

    try {
        return new Promise((resolve, reject) => {
            Class.updateOne({
                    _id: classid,
                    "liststudent._id": studentid
                }, {
                    $set: {
                        "liststudent.$.studentname": studentname,
                        "liststudent.$.studentphone": studentphone
                    }
                },
                (error, doc) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                        return reject(error);
                    } else {
                        console.log(doc);
                        return resolve(doc);
                    }
                })
        })
    } catch (error) {
        console.log(error);
    }
}

// Function delete class
function deleteClass(class_id) {
    try {
        return new Promise((resolve, reject) => {
            Class.deleteOne({
                    _id: class_id,
                }, 
                (error, doc) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                        return reject(error);
                    } else {
                        console.log(doc);
                        resolve(doc);
                    }
                })
        })
    } catch (error) {
        console.log(error);
    }
}

// Function delete student in class
function deleteStudent(classid, studentid) {
    try {
        return new Promise((resolve, reject) => {
            Class.updateOne({
                    _id: classid,
                }, {
                    $pull: {
                        "liststudent": {
                            _id: studentid
                        }
                    }
                }, {
                    safe: true,
                    upsert: true
                },
                (error, doc) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                        return reject(error);
                    } else {
                        console.log(doc);
                        resolve(doc);
                    }
                })
        })
    } catch (error) {
        console.log(error);
    }
}

function getClassidAndClassname() {
    return new Promise((resolve, reject) => {
        Class.find({}, (err, doc) => {
            if (err) {
                return reject(err)
            }
            else {
                resolve((doc))
            }
        })
    })
    
}

module.exports = {
    addClass,
    updateClass,
    deleteClass,
    all,
    getClassById,
    getListStudentByClassId,
    addStudent,
    updateStudent,
    deleteStudent,
    getClassidAndClassname
}
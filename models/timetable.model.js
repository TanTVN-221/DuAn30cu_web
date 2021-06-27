const e = require("express")
const mongoose = require("mongoose")
const Class = require("../models/class.model")
const Student = require("../models/student.model")

const timeTableSchema = mongoose.Schema({
    date: Date,
    listStudent: [],
    teacherid: String,
    teachername: String,
    classid: String,
    classname: String,
    isPresent: String
})

const Timetable = new mongoose.model("Timetable", timeTableSchema)

async function add(classid, classname, teacherid, teachername, date) {
    const data = await Class.getListStudentByClassId(classid)

    const newlist = data.listStudent

    newlist.forEach(element => {
        element._id = mongoose.Types.ObjectId(element._id)
        element.isPresent = 'false'
        // console.log(element);
    });

    // console.log(newlist);

    let newTimetable = new Timetable({
        date: date,
        listStudent: newlist,
        teacherid: teacherid,
        teachername: teachername,
        classid: classid,
        classname: classname,
        isPresent: "false"
    })

    newTimetable
        .save()
        .then((data) => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
}

function getAll() {
    return new Promise((resolve, reject) => {
        Timetable.find({}, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function getByDate(date, teacherid) {
    let finishDate = new Date(date)

    // Tạo ra mốc thời gian cuối cùng trong ngày. Ở đây mình cộng thêm 1 ngày rồi chỉnh cho nó thành 12AM
    finishDate.setDate(finishDate.getDate() + 1)
    finishDate = finishDate.toLocaleString("en-US", {
        timeZone: 'Asia/Ho_Chi_Minh'
    });
    finishDate = finishDate.split(", ")[0] + ", 12:00:00 AM"

    // Tạo ra mốc thời gian đầu tiên trong ngày.
    date = date.toLocaleString("en-US", {
        timeZone: 'Asia/Ho_Chi_Minh'
    })
    date = date.split(", ")[0] + ", 12:00:00 AM"
    // finishDate.setHours(11)
    // finishDate.setMinutes(59)
    // finishDate.setSeconds(59)

    // console.log(date);
    // console.log(finishDate);
    // console.log(new Date(date));
    return new Promise((resolve, reject) => {
        Timetable.find({
            date: {
                $gte: new Date(date),
                $lt: new Date(finishDate)
            },
            teacherid: teacherid
        }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function getListStudentByTimetableId(timetableId) {
    return new Promise((resolve, reject) => {
        Timetable.findOne({
            _id: timetableId
        }, 'date listStudent', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function addStudent(timetableId, studentname, studentphone) {

    const student = new Student({
        studentname: studentname,
        studentphone: studentphone
    })

    let newStudent = {}

    // Trick to add property that aren't define in schema to object
    newStudent = JSON.parse(JSON.stringify(student))
    newStudent.isPresent = "false"
    newStudent._id = mongoose.Types.ObjectId(student._id)

    Timetable.findById({
        _id: timetableId
    }, 'listStudent', (err, foundClass) => {
        if (err)
            console.log(err);
        else {
            foundClass.listStudent.push(newStudent)
            foundClass
                .save()
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(result);
                })
        }
    })
}

function updateStudent(timetableId, studentid, studentname, studentphone) {
    // đang test có nên sửa lại cái isPresent hay khong


    try {
        return new Promise((resolve, reject) => {
            Timetable.updateOne({
                    _id: timetableId,
                    "listStudent._id": mongoose.Types.ObjectId(studentid) // do đây là chuyển studentid lậu không chính thống
                }, { // vì vậy cần chuyển qua objectId mới so sánh được
                    $set: {
                        "listStudent.$.studentname": studentname,
                        "listStudent.$.studentphone": studentphone
                    }
                },
                (error, doc) => {
                    if (error) {
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

function deleteStudent(timetableId, studentid) {
    try {
        return new Promise((resolve, reject) => {
            Timetable.updateOne({
                    _id: timetableId,
                }, {
                    $pull: {
                        "listStudent": {
                            _id: mongoose.Types.ObjectId(studentid) // do đây là chuyển studentid lậu không chính thống 
                        } // vì vậy cần chuyển qua objectId mới so sánh được
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

function deleteTimetable(timetableId) {
    try {
        return new Promise((resolve, reject) => {
            Timetable.findByIdAndDelete({
                    _id: timetableId,
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

function diemdanh(timetableId, listStudent) {
    if (listStudent === []) return;
    else {
        listStudent.forEach((element) => {
            Timetable.updateOne({
                    _id: timetableId,
                    "listStudent._id": mongoose.Types.ObjectId(element.studentId) // do đây là chuyển studentid lậu không chính thống       
                }, {
                    $set: {
                        "listStudent.$.isPresent": element.isPresent
                    }
                })
                .catch((err) => {
                    console.log(element.studentId + "\n" + err);
                })
        })
    }
}

function getIsPresentByTimetableId(timetableId) {
    return new Promise((resolve, reject) => {
        Timetable.findOne({
            _id: timetableId
        }, 'isPresent', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function chamcong(timetableId) {

    Timetable.updateOne({
            _id: timetableId,
        }, {
            $set: {
                "isPresent": 'true'
            }
        })
        .catch((err) => {
            console.log(timetableId + "\n" + err);
        })
}

module.exports = {
    add,
    getAll,
    getListStudentByTimetableId,
    getByDate,
    updateStudent,
    deleteStudent,
    addStudent,
    deleteTimetable,
    diemdanh,
    getIsPresentByTimetableId,
    chamcong
}
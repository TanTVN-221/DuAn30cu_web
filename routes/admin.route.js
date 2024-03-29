const express = require("express");
const router = express.Router();
const Class = require("../models/class.model")
const Student = require("../models/student.model");
const route = require("./route");
const Timetable = require('../models/timetable.model');
const User = require("../models/user.model");

router.get("/register", checkAuthenticated_admin, async (req, res) => {
  res.render("register.ejs")
})

// Admin
router.get("/", checkAuthenticated_admin, async (req, res) => {
  let listClass = await Class.all()

  res.render('admin', {
    listClass: listClass
  })
})

//============================= CLASS ==============================
// Class
router.get("/class", checkAuthenticated_admin, async (req, res) => {
  let listClass = await Class.all()
  // console.log(listClass);

  res.render('admin/class.admin.ejs', {
    listClass: listClass
  })
})

router.get("/class/all", checkAuthenticated_admin, async (req, res) => {
  res.send(await Class.all())
})

// Add class
router.post("/class", checkAuthenticated_admin, async (req, res) => {
  const classid = req.body.classid
  const classname = req.body.classname

  Class.addClass(classid, classname)
  res.redirect("/")
})

// Update class
router.post("/class/update", checkAuthenticated_admin, async (req, res) => {
  const class_id = req.body.class_id
  const classid = req.body.classid
  const classname = req.body.classname

  await Class.updateClass(class_id, classid, classname)
  res.redirect('back');
})

// Delete class
router.post("/class/delete", checkAuthenticated_admin, async (req, res) => {
  const class_id = req.body.class_id

  await Class.deleteClass(class_id)
  res.redirect('back')
})

// List student in class
router.get("/class/:classId", checkAuthenticated_admin, async (req, res) => {
  const classid = req.params.classId
  const foundClass = await Class.getClassById(classid)

  res.render("admin/liststudent.admin.ejs", {
    classid: classid,
    foundList: foundClass.listStudent
  })
})

// Add student to specfic class
router.post("/class/:classId", checkAuthenticated_admin, (req, res) => {
  const studentname = req.body.studentname
  const studentphone = req.body.studentphone

  let newStudent = new Student({
    studentname: studentname,
    studentphone: studentphone
  })

  Class.addStudent(req.params.classId, newStudent)
  res.redirect('back');
})

// Update student 
router.post("/class/:classId/update", checkAuthenticated_admin, async (req, res) => {
  const classid = req.params.classId
  const studentid = req.body.studentid
  const studentname = req.body.studentname
  const studentphone = req.body.studentphone

  await Class.updateStudent(classid, studentid, studentname, studentphone)
  res.redirect('back');
})

// Delete student
router.post("/class/:classId/delete", checkAuthenticated_admin, async (req, res) => {
  const classid = req.params.classId
  const studentid = req.body.studentid
  console.log(classid);
  console.log(studentid);
  await Class.deleteStudent(classid, studentid)
  res.redirect('back')
})



// ================================ TIMETABLE =================================
// Timetable
router.get("/timetable", checkAuthenticated_admin, async (req, res) => {


  res.render("admin/timetable.admin.ejs")
})

// Add to timetable
router.post("/timetable", checkAuthenticated_admin, async (req, res) => {

  const teachername = req.body.teachername
  const classname = req.body.classname
  const classid = req.body.classid
  const teacherid = req.body.teacherid
  const date = req.body.date

  await Timetable.add(classid, classname, teacherid, teachername, date)
  res.redirect('back')
})

// Get data from database
router.get("/timetable/all", checkAuthenticated_admin, async (req, res) => {
  res.send(await Timetable.getAll())
})

router.get("/timetable/getDate", checkNotAuthenticated, async (req, res) => {
  const date = {
    date: new Date(Date.parse(Date.now()))
  }
  res.send(date)
})

router.get("/timetable/:timetableId", checkAuthenticated_admin, async (req, res) => {
  const timetableId = req.params.timetableId
  const list = await Timetable.getListStudentByTimetableId(timetableId)
  // console.log(list.liststudent);
  if (list === null) {
    res.render('admin/detail.timetable.admin.ejs', {
      timetableId: timetableId,
      foundList: []
    })
  } else {
    res.render('admin/detail.timetable.admin.ejs', {
      timetableId: timetableId,
      foundList: list.listStudent
    })

  }
})

// Add student to timetable
router.post("/timetable/:timetableId/add", checkAuthenticated_admin, async (req, res) => {
  const timetableId = req.params.timetableId
  const studentname = req.body.studentname
  const studentphone = req.body.studentphone

  await Timetable.addStudent(timetableId, studentname, studentphone)
  res.redirect('back')
})

router.post("/timetable/:timetableId/update", checkAuthenticated_admin, async (req, res) => {
  const timetableId = req.params.timetableId
  const studentid = req.body.studentid
  const studentname = req.body.studentname
  const studentphone = req.body.studentphone
  // console.log(timetableId);
  // console.log(studentid);
  // console.log(studentname);
  // console.log(studentphone);

  await Timetable.updateStudent(timetableId, studentid, studentname, studentphone)
  res.redirect('back')
})

router.post("/timetable/:timetableId/delete", checkAuthenticated_admin, async (req, res) => {
  const timetableId = req.params.timetableId
  const studentid = req.body.studentid

  await Timetable.deleteStudent(timetableId, studentid)
  res.redirect('back')
})

router.post("/timetable/:timetableId/deleteTimetable", checkAuthenticated_admin, async (req, res) => {
  const timetableId = req.params.timetableId

  await Timetable.deleteTimetable(timetableId)
  res.redirect('back')
})

// ================================== ACCOUNT ===================================
router.get("/account", checkAuthenticated_admin, async (req, res) => {
  User.find()
  .then(data => {
    // console.log(data);
    res.render("admin/account.admin.ejs", {listAccount: data}) 
  })
  .catch(err => {
    console.log(err);
    res.render("admin/account.admin.ejs", {listAccount: []})
  })

})



// ================================ AUTHENTICATE ================================
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


// Check authenticate
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


module.exports = router
const express = require("express");
const router = express.Router();
const Class = require("../models/class.model")
const Student = require("../models/student.model")

router.get("/", checkAuthenticated, async (req, res) => {
  let listClass = await Class.all()

  res.render('admin', {listClass: listClass})  
})

router.get("/class/add", checkAuthenticated, (req, res) => {
    res.render('admin/add.admin.ejs')
    
})

router.post("/class", checkAuthenticated, async (req, res) => {
    const classid = req.body.classid
    const classname = req.body.classname

    Class.addClass(classid, classname)
    res.redirect("/")
})

router.get("/class/:classId", checkAuthenticated, async (req, res) => {
  // console.log(req.params);
  const classid = req.params.classId
  const foundClass = await Class.getClassById(classid)
  // console.log(foundClass);
  res.render("admin/liststudent.admin.ejs", {classid: classid, foundList: foundClass.liststudent})
})

router.post("/class/:classId", checkAuthenticated, (req, res) => {
  const studentname = req.body.studentname
  const studentphone = req.body.studentphone

  let newStudent = new Student({
    studentname: studentname,
    studentphone: studentphone
  })

  Class.addStudent(req.params.classId, newStudent)
  res.redirect('back');
})

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
const express = require("express");
const router = express.Router();
let {addClass, all} = require("../models/class.model")

router.get("/", checkAuthenticated, async (req, res) => {
    res.render('admin')
    // let listClass = (Class.viewAllClass())
    // console.log(listClass);
    
})

router.get("/class/add", checkAuthenticated, (req, res) => {
    res.render('admin/add.admin.ejs')
    
})

router.post("/class", checkAuthenticated, async (req, res) => {
    const classid = req.body.classid
    const classname = req.body.classname

    addClass(classid, classname)
    // const newClass = new Class({
    //   classid: classid,
    //   classname: classname,
    //   listStudent: []
    // })

    // newClass.save()
    // console.log(newClass.viewAll());

    
    // listData.forEach(element => {
    //   console.log(element);
    // });
    let all1 = await all()
    console.log(all1);
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
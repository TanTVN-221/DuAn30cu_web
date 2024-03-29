const express = require("express")
const router = express.Router()
const User = require("../models/user.model")
const Timetable = require("../models/timetable.model")

router.get("/all", (req, res) => {
    User.find({}, 'id name')
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot Update user with ${id}. Maybe user not found!`
                })
            } else {
                res.send(data)
            }
        })
})

router.get("/:user_id", checkAuthenticated_user, async (req, res) => {
    let datenow = (new Date(new Date()).toLocaleString("en-US", {
        timeZone: 'Asia/Ho_Chi_Minh'
    })) //convert UTC to timezone VietNam
    // .toISOString()

    // console.log(datenow);

    const teacherId = req.user.id

    let date = datenow

    if (req.query.date) {
        date = (new Date(new Date(req.query.date)).toLocaleString("en-US", {
            timeZone: 'Asia/Ho_Chi_Minh'
        }))
    }
    console.log(date);
    var listTimetable = []
    try {
        listTimetable = await Timetable.getByDate(date, req.user.id) 
    } catch (error) {
        console.log(error);
    }

    if (!listTimetable) listTimetable = []

    // console.log(listTimetable);
    res.render("user.ejs", {
        listTimetable: listTimetable,
        teacherId: teacherId
    })
})

router.get('/:userId/:timetableId', checkAuthenticated_user, async (req, res) => {
    const userId = req.params.userId
    const timetableId = req.params.timetableId

    const list = await Timetable.getListStudentByTimetableId(timetableId)
    const isPresent = await Timetable.getIsPresentByTimetableId(timetableId)
    console.log(list.date);
    if (list === null) {
        res.render("user/timetable.user.ejs", {
            userId: userId,
            timetableId: timetableId,
            isPresent: isPresent.isPresent,
            date: "",
            listStudent: []
        })
    } else {
        res.render("user/timetable.user.ejs", {
            userId: userId,
            timetableId: timetableId,
            isPresent: isPresent.isPresent,
            date: list.date,
            listStudent: list.listStudent
        })
    }
})

router.post('/:userId/:timetableId/diemdanh', checkAuthenticated_user, async (req, res) => {
    const userId = req.params.userId
    const timetableId = req.params.timetableId

    const listStudent = req.body.listStudent

    Timetable.diemdanh(timetableId, listStudent)
    res.redirect('back')
})

router.post('/:userId/:timetableId/chamcong', checkAuthenticated_user, async (req, res) => {
    const userId = req.params.userId
    const timetableId = req.params.timetableId

    Timetable.chamcong(timetableId)
    res.redirect('back')
})

// =========================== AUTHENTICATE ========================================
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
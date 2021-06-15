const express = require("express")
const router = express.Router()
const User = require("../models/user.model")
const Timetable = require("../models/timetable.model")

router.get("/all", (req, res) => {
    User.find({})
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

    const teacherId = req.params.user_id

    let listTimetable = await Timetable.getByDate(datenow)
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
    console.log(isPresent);

    if (list === null) {
        res.render("user/timetable.user.ejs", {
            userId: userId,
            timetableId: timetableId,
            isPresent: isPresent.isPresent,
            listStudent: []
        })
    } else {
        res.render("user/timetable.user.ejs", {
            userId: userId,
            timetableId: timetableId,
            isPresent: isPresent.isPresent,
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
    if (req.isAuthenticated() && req.user.isAdmin === "1") {
        return next()
    }
  
    res.redirect('/login')
  }
  
  // Check authenticate user
  function checkAuthenticated_user(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin === "0") {
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
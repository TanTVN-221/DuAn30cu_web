var btn_update = document.querySelectorAll(".btn-update")
btn_update.forEach(element => {
    element.addEventListener("click", function() {
        var id = element.classList[4]
        document.getElementsByClassName(id + " input_studentname")[0].setAttribute("contenteditable", "true")
        document.getElementsByClassName(id + " input_studentphone")[0].setAttribute("contenteditable", "true")
        document.getElementsByClassName(id + " btn-save")[0].style.display = "block"
        document.getElementsByClassName(id + " btn-cancel")[0].style.display = "block"
    })
})

var btn_cancel = document.querySelectorAll(".btn-cancel")
btn_cancel.forEach(element => {
    element.addEventListener("click", function() {
        var id = element.classList[0]
        document.getElementsByClassName(id + " input_studentname")[0].setAttribute("contenteditable", "false")
        document.getElementsByClassName(id + " input_studentphone")[0].setAttribute("contenteditable", "false")
        document.getElementsByClassName(id + " btn-save")[0].style.display = "none"
        document.getElementsByClassName(id + " btn-cancel")[0].style.display = "none"
    })
})
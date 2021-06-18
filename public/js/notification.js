export function alertNotification(message) {
    $('.notification-alert').text(message)
    $('.alert').addClass("show");
    $('.alert').removeClass("hide");
    $('.alert').addClass("showAlert");
    setTimeout(function () {
        $('.alert').removeClass("show");
        $('.alert').addClass("hide");
    }, 1000);

    $('.close-btn-alert').click(function () {
        $('.alert').removeClass("show");
        $('.alert').addClass("hide");
    });
}

export function successNotification(message) {
    $('.notification-success').text(message)
    $('.success').addClass("show");
    $('.success').removeClass("hide");
    $('.success').addClass("showSuccess");
    setTimeout(function () {
        $('.success').removeClass("show");
        $('.success').addClass("hide");
    }, 1000);
    $('.close-btn-success').click(function () {
        $('.success').removeClass("show");
        $('.success').addClass("hide");
    });
}
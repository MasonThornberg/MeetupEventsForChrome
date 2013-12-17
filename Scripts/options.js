$(document).ready(function () {

    var userId = localStorage["userId"];

    $("#options-form-userId").val(userId);

    $("#options-form-button").click(function () {
        setLocalStorage("userId", $("#options-form-userId").val());
        $("#options-form-confirm").show();
    });
});


function setLocalStorage(key,value) {
    localStorage[key] = value;
}
apiKey = "17112c1d283660383e134bc36515b24";
var userId;
var _groupArray = [];

$(document).ready(function () {

    userId = localStorage["userId"];

    if (userId == null || userId == '') {
        chrome.tabs.create({ url: "options.html" });
        window.close();
        return;
    }

    getEvents();
});

function getEvents() {

    var apiUrl = "https://api.meetup.com/2/events?&format=json&sign=true&member_id=" + userId + "&page=10&key=" + apiKey;
    $.ajax({
        url: apiUrl,
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    var group = getGroup(data.results[i].group.id);
                    var date = new Date(data.results[i].time);

                    var event = "<div class='event'>";

                    event += "<div class='event-date'>";
                    event += "<div class='date-day'>" + getFormattedDay(date.getDay()) + "</div>";
                    event += "<div class='date-month'>" + getMonthString(date.getMonth()) + "</div>";
                    event += "<div class='date-date'>" + date.getDate() + "</div>";
                    event += "<div class='date-time'>" + getHourFormatted(date.getHours()) + ":" + getMinuteFormatted(date.getMinutes()) + getAMPM(date.getHours()) + "</div>";
                    event += "</div>";

                    event += "<div class='event-content'><a href='" + data.results[i].event_url + "' target='_blank'>" + data.results[i].group.name + "</a><br>";
                    event += data.results[i].name + "<br>";
                    event += "</div>";
                    event += "<div class='event-thumb'><a href='" + group.link + "' target='_blank'><img src='" + group.group_photo.thumb_link + "' /></a></div>";
                    event += "</div>";
                    
                    $("#popup-event-container").append(event);
                }
            }
        }
    });//end of ajax
}

function getGroup(groupId) {
    //Check if group is already in array
    for (i = 0; i < _groupArray.length; i++) {
        if (_groupArray[i].id == groupId) {
            return _groupArray[i];
        }
    }

    //Get group from API
    var group;

    $.ajax({
        url: "https://api.meetup.com/2/groups?&sign=true&page=1&key=" + apiKey + "&group_id=" + groupId,
        dataType: "json",
        async: false,
        success: function (data) {
            group = data.results[0];
            _groupArray.push(group);
        }
    });//end of ajax
    return group;
}

function getMonthString(month) {
    var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month_names_short[month];
}
function getFormattedDay(day) {
    var day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return day_names[day];
}
function getHourFormatted(hour) {
    if (hour > 12) { hour = (hour - 12); }
    var hour_formatted = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    return hour_formatted[hour];
}
function getMinuteFormatted(minute) {
    if (minute == 0) return "00";
    return minute;
}
function getAMPM(hour) {
    var AMPM = " AM";
    if (hour > 11)  AMPM = " PM";
    return  AMPM;
}

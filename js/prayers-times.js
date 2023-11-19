let today = new Date(),
    dayLink = today.getDate(),
    monthLink = today.getMonth() + 1,
    yearLink = today.getFullYear(),
    userLat = localStorage.getItem('userLatitude') ?? '30.0444',
    userLon = localStorage.getItem('userLongitude') ?? '31.2357';

if (!localStorage.getItem('userLatitude') || !localStorage.getItem('userLongitude')) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            localStorage.setItem('userLatitude', position.coords.latitude);
            localStorage.setItem('userLongitude', position.coords.longitude);
            location.reload();
        },
        function (error) {
            localStorage.setItem('userLatitude', '30.0444');
            localStorage.setItem('userLongitude', '31.2357');
        }
    );
}
function showTime(){
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let session = "AM";
    
    if(hours == 0){
        hours = 12;
    }
    if(hours > 12){
        hours = hours - 12;
        session = "PM";
    }
    
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    
    let time = hours + ":" + minutes + ":" + seconds + " " + session;
    document.querySelector(".clockNow").textContent = `الساعة الأن |  ${time}`;
    setTimeout(showTime, 1000);
}
showTime();

let getCalendar = (lat, long) => {
    let url = `https://api.aladhan.com/v1/calendar/${yearLink}/${monthLink}?latitude=${lat}&longitude=${long}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const apiId = dayLink - 1;
            document.getElementById('weekDay').textContent = `${data.data[apiId].date.hijri.weekday.ar}`
            document.getElementById('gregDate').innerHTML = `${data.data[apiId].date.gregorian.date}`
            document.getElementById('hijriDate').innerHTML = `${data.data[apiId].date.hijri.date}`

            document.getElementById('elFajr').innerHTML = `${data.data[apiId].timings.Fajr.substring(0, 5)}`
            document.getElementById('elSunrise').innerHTML = `${data.data[apiId].timings.Sunrise.substring(0, 5)}`
            document.getElementById('elDhuhr').innerHTML = `${data.data[apiId].timings.Dhuhr.substring(0, 5)}`
            document.getElementById('elAsr').innerHTML = `${data.data[apiId].timings.Asr.substring(0, 5)}`
            document.getElementById('elMaghrib').innerHTML = `${data.data[apiId].timings.Maghrib.substring(0, 5)}`
            document.getElementById('elIsha').innerHTML = `${data.data[apiId].timings.Isha.substring(0, 5)}`
        })
        .catch(error => console.error(error));
}

getCalendar(userLat, userLon);
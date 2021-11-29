

function getWeatherData(lat, long, lang){
    fetch("https://community-open-weather-map.p.rapidapi.com/forecast/daily?lat=" + lat + "&lon="+ long + "&cnt=7&units=metric&lang=" + lang, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "3b7c8d911dmsh74f0fea868e2847p1e052cjsn7766d4f05600"
        }
    })
    .then(response => {
        if(response.ok){
            response.text().then(data => processData(JSON.parse(data)));
        }
    })
    .catch(err => {
        console.error(err);
    });
}

function processData(data){
    console.log(data);
    var city = data.city.name;

    var i = 0;
    data.list.forEach(element => {
        console.log(element);
        i += 1;
        generateDayDiv(element, i);
    });

    
}
function generateDayDiv(day, i){
    var now = Date.now();
    var date = day.dt;
    var maxTemp = day.temp.max;
    var temp = day.temp.day;
    var minTemp = day.temp.min;
    var clouds = day.clouds;
    var description = day.weather[0].description;
    var icon = day.weather[0].icon;
}

window.addEventListener('load', (event) => {
    getWeatherData(35, 139, "nl");
});
    
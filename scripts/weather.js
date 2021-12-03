
const _DAYTODAY = 0;
const _LIST6DAY = 1;

function getWeatherDataFuture(lat, long, lang){
    fetch("https://community-open-weather-map.p.rapidapi.com/forecast/daily?lat=" + lat + "&lon="+ long + "&cnt=7&units=metric&lang=" + lang, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "3b7c8d911dmsh74f0fea868e2847p1e052cjsn7766d4f05600"
        }
    })
    .then(response => {
        if(response.ok){
            response.text().then(data => processData(JSON.parse(data), _LIST6DAY));
        }
    })
    .catch(err => {
        console.error(err);
    });
}

function getWeatherDataNow(lat, long, lang){
    fetch("https://community-open-weather-map.p.rapidapi.com/weather?lat=" + lat + "&lon="+long+"&lang="+lang+"&units=metric", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "3b7c8d911dmsh74f0fea868e2847p1e052cjsn7766d4f05600"
        }
    })
    .then(response => {
        if(response.ok){
            response.text().then(data => processData(JSON.parse(data), _DAYTODAY));
        }
    })
    .catch(err => {
        console.error(err);
    });
}

function processData(data, type){
    console.log(data);
    var city = type == _LIST6DAY ? data.city.name : data.name;

    var i = 0;
    if(type == _LIST6DAY){
        data.list.forEach(element => {
            console.log(element);
            i += 1;
            generateDayDiv(element, i, type);
        });
    }else if(type = _DAYTODAY){
        generateDayDiv(element, null, type);
    }
}
function generateDayDiv(day, i, type){
    var now = Date.now();
    var date;
    var maxTemp;
    var minTemp;
    var temp;
    var humidity;
    var pressure;
    var feels_like;
    var wind_speed;
    var wind_deg;
    var description;
    var icon;
    var id;
    if(type == _DAYTODAY){
        date = day.dt;
        maxTemp = day.main.temp_max;
        minTemp = day.main.temp_min;
        temp = day.main.temp;
        humidity = day.humidity;
        pressure = day.pressure;
        feels_like = day.feels_like.day;
        wind_speed = day.speed;
        wind_deg = day.deg;
        description = day.weather[0].description;
        icon = day.weather[0].icon;
        id = day.weather[0].id;
    }else if(type == _LIST6DAY){
        date = day.dt;
        maxTemp = day.temp.max;
        minTemp = day.temp.min;
        temp = day.temp.day;
        humidity = day.main.humidity;
        pressure = day.main.pressure;
        feels_like = day.main.feels_like;
        wind_speed = day.wind.speed;
        wind_deg = day.wind.deg;
        description = day.weather[0].description;
        icon = day.weather[0].icon;
        id = day.weather[0].id;
    }

    main_div = document.createElement('div');
    main_div.classList.add(type == _LIST6DAY ? "weekDay " + i : "todayDay");
    if(type == _DAYTODAY){
        //add all needed elements
    }else if(tpye == _LIST6DAY){
        //add all needed elements for future week days
    }
}

window.addEventListener('load', (event) => {
    getWeatherDataNow(35,139, "nl");
    getWeatherDataFuture(35, 139, "nl");
});
    
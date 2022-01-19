$(window).ready(function(){

    failedToLoad("loading");
    getLocation();
  
  });

function updateWeather(){
    getWeatherAPIWeek();
}

function processesData(data) {
    console.log(data);
    //future days
    var days = document.getElementsByClassName('day');
    var locElement = document.querySelector('.location');
    locElement.innerHTML = loc;
    data.daily.forEach((day, i) => {
      if(i < days.length){
        var iconElement = days[i].children[1];
        var tempElement = days[i].children[2];
        var windIconElement = days[i].children[3].children[0];
        var windSpeedElement = days[i].children[3].children[1];
        var pressureElement = days[i].children[4].children[1].children[0];
        var humidityElement = days[i].children[5].children[1].children[0];
        var dewPointElement = days[i].children[6].children[1].children[0];
  
        var icon = day.weather[0].icon;
        var temp = Math.round(day.temp.max - 273.14);
        var windDeg = getDeg(45 + 180 + day.wind_deg);
        var windSpeed = Math.round(day.wind_speed * 3.6 * 10)/10;
        var disc = day.weather[0].description;
        var pressure = day.pressure;
        var humidity = day.humidity;
        var dewpoint = Math.round((day.dew_point -273.15)*1000)/1000;

        iconElement.innerHTML = `<img src='../assets/photos/weather_icons/${icon}.png' alt='${disc}'>`;
        tempElement.innerHTML = `${temp}°<span>C</span>`;
        windIconElement.innerHTML = `<img style='transform: rotate(${windDeg}deg)' src='../assets/photos/wind-dir.svg' alt='${windDeg}°'>`;
        windSpeedElement.innerHTML = windSpeed + " km/h";

        pressureElement.innerHTML = pressure + 'hPa';
        humidityElement.innerHTML = humidity + '%';
        dewPointElement.innerHTML = dewpoint + '°C';
      }
    });
  
  }
  
  function failedToLoad(loading = ""){
    var discriptionElement = document.querySelector('.today .discription');
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    if(loading){
  
      var days = document.getElementsByClassName('day');
      for(var i = 0; i < days.length; i++){
        var dateElement = days[i].children[0];
        var iconElement = days[i].children[1];
        var tempElement = days[i].children[2];
        dateElement.innerHTML = i == 0 ? 'Tomorrow' : days_lookup[new Date(date.getFullYear(), date.getMonth(), date.getDate() + i).getDay()];
        iconElement.innerHTML = `<img src='../assets/photos/weather_icons/unknown.png' alt='unknown'>`;
        tempElement.innerHTML = `--°<span>C</span>`;
      }
    }else{
      discriptionElement.innerHTML = "Couldn't reach API";
    }
  
  }
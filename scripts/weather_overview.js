$(window).ready(function(){

    failedToLoad("loading");
    getLocation();
  
  });

function updateWeather(){
    getWeatherAPIWeek();
}

function processesData(data) {
    console.log(data);
    //today
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    var locElement = document.querySelector('.today .location');
    var discriptionElement = document.querySelector('.today .discription');
    var windIconElement = document.querySelector('.today .windicon');
    var windSpeedElement =  document.querySelector('.today .speed');
  
    var temp = Math.round(data.current.temp - 273.14);
    var icon = data.current.weather[0].icon;
    var disc = data.current.weather[0].description;
    var windDeg = getDeg(data.current.wind_deg + 45 + 180);
    var windSpeed = Math.round(data.current.wind_speed * 3.6 * 10)/10;
  
    temperatureElement.innerHTML = `${temp}°<span>C</span>`;
    iconElement.innerHTML = `<img src='../assets/photos/weather_icons_big/${icon}.png' alt='${disc}'>`;
    windIconElement.innerHTML = `<img style='transform: rotate(${windDeg}deg)' src='../assets/photos/wind-dir.svg' alt='${windDeg}°'>`;
    windSpeedElement.innerHTML = windSpeed + " km/h"
    discriptionElement.innerHTML = disc;
    locElement.innerHTML = loc;
  
    //future days
    var days = document.getElementsByClassName('day');
    data.daily.forEach((day, i) => {
      if(i < days.length){
        var iconElement = days[i].children[1];
        var tempElement = days[i].children[2];
        var windIconElement = days[i].children[3].children[0];
        var windSpeedElement = days[i].children[3].children[1];
  
        var icon = day.weather[0].icon;
        var temp = Math.round(day.temp.max - 273.14);
        var windDeg = getDeg(45 + 180 + day.wind_deg);
        var windSpeed = Math.round(day.wind_speed * 3.6 * 10)/10;
        iconElement.innerHTML = `<img src='../assets/photos/weather_icons/${icon}.png' alt='${disc}'>`;
        tempElement.innerHTML = `${temp}°<span>C</span>`;
        windIconElement.innerHTML = `<img style='transform: rotate(${windDeg}deg)' src='../assets/photos/wind-dir.svg' alt='${windDeg}°'>`;
        windSpeedElement.innerHTML = windSpeed + " km/h"
      }
    });
  
  }
  
  function failedToLoad(loading = ""){
    var discriptionElement = document.querySelector('.today .discription');
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    if(loading){
      temperatureElement.innerHTML = `--°<span>C</span>`;
      iconElement.innerHTML = `<img src='../assets/photos/weather_icons_big/unknown.png' alt='unknown'>`;
      discriptionElement.innerHTML = "Loading ...";
  
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
var date = new Date();
//default brussel
var long = 4.351721;
var lat = 50.850346;
var loc = 'Brussels, Belgium';


$(window).ready(function(){

  failedToLoad("loading");
  getLocation();

});

//searchbar using jquery UI
$('#city_search').autocomplete({
  source: function (request, response){
    var input = document.getElementById('city_search').value;
    fetch("https://api.opencagedata.com/geocode/v1/json?language=en&key=a328dba18fee4d2591a7c0f799d4e192&q=" + input)
    .then(response => response.json())
    .then(data => {
      var results = data.results;
      var suggest = [];
      results.forEach(result => {
        var value = formatLocation(result);
        suggest.push({
          "value": value, "data": result.geometry
        })
      });
      response(suggest)
    })
    
  },
  response: function(event, ui){
    if (!ui.content.length) {
      var noResult = { value:"",label:"No results found" };
      ui.content.push(noResult);
    } 
  },
  select: function(event, ui){
    long = ui.item.data.lng;
    lat = ui.item.data.lat;
    loc = ui.item.value ;
    updateWeather();
  }
},{
  disabled: false,
  autoFocus: true,
  minLength: 1,
  delay: 200
}).focus(function(){            
  $(this).autocomplete('search');
});

function formatLocation(result){
  var city = '';

  if(result.components.city !== undefined){
    city = result.components.city;
  }
  else if(result.components.town !== undefined){
    city = result.components.town;
  }
  else if(result.components.village !== undefined){
    city = result.components.village;
  }
  else if(result.components.municipality !== undefined){
    city = result.components.municipality;
  }
  
  if(result.components.state !== undefined){
    var state = result.components.state;
    city += city === '' ? state: ', ' + state;
  }
  else if(result.components.state_district !== undefined){
    var distric = result.components.state_district;
    city += city === '' ? distric: ', ' + distric;
  }
  

  var country = result.components.country;
  var value = city !== '' ? city + ', ' + country : country;
  return value;
}

function setLocation(){
  input = lat + '+' + long;
  fetch("https://api.opencagedata.com/geocode/v1/json?language=en&key=a328dba18fee4d2591a7c0f799d4e192&q=" + input)
  .then(response => response.json())
  .then(data => {
    loc = formatLocation(data.results[0]);
    getWeatherAPI(this.long, this.lat);
  })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
    failedToLoad();
  })
  

}

function updateWeather(){
  getWeatherAPI(long, lat);
}

function getLocation() {
    if (navigator.geolocation) {                  //allow     //deny
        navigator.geolocation.getCurrentPosition(setPosition, getWeatherAPI(4.351721, 50.850346));
    } else {
        alert("Geolocation is not supported by this browser. Defaulting to Brussels");
        getWeatherAPI(4.351721, 50.850346);
    }
}

function setPosition(position) {
    this.long = position.coords.longitude;
    this.lat = position.coords.latitude;
    setLocation();
}

//******************add callback if fetch failed and set assets acoordingly*****************
// lat and long have been defined previously in datageolocation
function getWeatherAPI(long, lat) {
  var key = 'f5e76488de20e5944d66a73317c6ca05';
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=${key}&lang=en`)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            failedToLoad();
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // console.log(data);
          processesData(data);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
      failedToLoad();
    });
    //
}

var days_lookup = [
  "Mon",
  "Tue",
  "Wed",
  "Thur",
  "Fri",
  "Sat",
  "Sun"
]

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
function getDeg(deg){
  while(deg >= 360){
    deg -= 360;
  }
  return deg;
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
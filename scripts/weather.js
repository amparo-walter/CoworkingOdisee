$(window).ready(function(){

    failedToLoad("loading");
    getWeatherAPI();
  
  });
  
  //******************add callback if fetch failed and set assets acoordingly*****************
  function getWeatherAPI() {
    var key = 'f5e76488de20e5944d66a73317c6ca05';
    var lat = '37.9847003';
    var long = '-0.6808233';
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,minutely&appid=${key}&lang=nl`)
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
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ]
  
  function processesData(data) {
    //today
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    var discriptionElement = document.querySelector('.today .discription');
    var temp = Math.round(data.current.temp - 273.14);
    var icon = data.current.weather[0].icon;
    var disc = data.current.weather[0].description;
  
    temperatureElement.innerHTML = `${temp}°<span>C</span>`;
    iconElement.innerHTML = `<img src='assets/photos/weather_icons_big/${icon}.png' alt='Weather icon'>`;
    discriptionElement.innerHTML = disc;
  
    //future days
    var days = document.getElementsByClassName('day');
    data.daily.forEach((day, i) => {
      if(i < days.length){
        var iconElement = days[i].children[1];
        var tempElement = days[i].children[2];
  
        var icon = day.weather[0].icon;
        var temp = Math.round(day.temp.max - 273.14);
  
        iconElement.innerHTML = `<img src='assets/photos/weather_icons/${icon}.png' alt='Weather icon'>`;
        tempElement.innerHTML = `${temp}°<span>C</span>`;
      }
    });
  
  }
  
  function failedToLoad(loading = ""){
    var discriptionElement = document.querySelector('.today .discription');
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    if(loading){
      temperatureElement.innerHTML = `--°<span>C</span>`;
      iconElement.innerHTML = `<img src='assets/photos/weather_icons_big/unknown.png' alt='Weather icon'>`;
      discriptionElement.innerHTML = "Laden ...";
  
      var days = document.getElementsByClassName('day');
      var date = new Date();
      for(var i = 0; i < days.length; i++){
        var dateElement = days[i].children[0];
        var iconElement = days[i].children[1];
        var tempElement = days[i].children[2];
  
        dateElement.innerHTML = days_lookup[new Date(date.getFullYear(), date.getMonth(), date.getDay() + i).getDay()];
        iconElement.innerHTML = `<img src='assets/photos/weather_icons/unknown.png' alt='Weather icon'>`;
        tempElement.innerHTML = `--°<span>C</span>`;
      }
    }else{
      discriptionElement.innerHTML = "Kon de API niet bereiken";
    }
  
  }
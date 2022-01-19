/*
Useage:
  Every script must include an updateWeather() function.
  This must contain the call to getWeahterAPIWeek() or getWeatherAPIHour()

  Every script must include a processesData(data) and a failedToLoad.
  The failed to load is called so default info can be displayed.


Globals:
  - date : hold the current date and time.

  - lat  : holds the latitude of the current location (default brussels)
  - long : holds the longtitude of the current location (default brussels)
  - loc  : holds the stringvalue of the current location (default brussels, belgium)

  - days_lookup : used to map numbers to days of the week.

Functions:

  - setLocation() -- null -- null
        Sets global var 'loc' to be the location using global vars 'long' & 'lat'

    SHOULD BE CALLED FIRST
  - getLocation() -- null -- null
        Gets location from user.
            denied: use default 'long' and 'lat'
            allowed: calls setPosition()

  - setPosition() -- position (getLocation) -- null (setLocation)
        Sets the global vars 'long' and 'lat'
        callback to setLocation()


  - getWeatherAPIWeek() -- null -- null (processesData(data) / failedToLoad())
        Calls weather api for weekly forecast
        Callback to processesData(data) *** this callback should be used by its corresponding processor ***
        Callback to failedToLoad() *** this callback should display the default values if api failes to load.
                                       it is still required to be handeled by the processor. ***

  - getWeatherAPIHour() -- null -- null (processesData(data) / failedToLoad())
        Calls weather api for hourly forecast (24h)
        Callback to processesData(data) *** this callback should be used by its corresponding processor ***
        Callback to failedToLoad() *** this callback should display the default values if api failes to load.
                                       it is still required to be handeled by the processor. ***


  - getDeg(deg) -- degrees -- degrees
        Maps the degrees between 0 and 359.
  
  - formatLocation() -- result-item -- string
        used for making a valid string of location form api callback



*/



var date = new Date();
//default brussel
var long = 4.351721;
var lat = 50.850346;
var loc = 'Brussels, Belgium';

//searchbar using jquery UI
$('#city_search').autocomplete({
  source: function (request, response){
    var input = document.getElementById('city_search').value;
    fetch("https://api.opencagedata.com/geocode/v1/json?language=en&key=a328dba18fee4d2591a7c0f799d4e192&q=" + input)
    .then(response => response.json())
    .then(data => {
      var results = data.results;
      console.log(results);
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

function getLocation() {
    if (navigator.geolocation) {                  //allow     //deny
        navigator.geolocation.getCurrentPosition(setPosition, updateWeather());
    } else {
        alert("Geolocation is not supported by this browser. Defaulting to Brussels");
        updateWeather();
    }
}

function setPosition(position) {
    this.long = position.coords.longitude;
    this.lat = position.coords.latitude;
    setLocation();
}

function setLocation(){
  input = lat + '+' + long;
  fetch("https://api.opencagedata.com/geocode/v1/json?language=en&key=a328dba18fee4d2591a7c0f799d4e192&q=" + input)
  .then(response => response.json())
  .then(data => {
    loc = formatLocation(data.results[0]);
    updateWeather();
  })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
    failedToLoad();
  })

}

//******************add callback if fetch failed and set assets acoordingly*****************
// lat and long have been defined previously in datageolocation
function getWeatherAPIWeek() {
  var key = 'f5e76488de20e5944d66a73317c6ca05';
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.long}&exclude=hourly,minutely&appid=${key}&lang=en`)
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

function getWeatherAPIHour() {
  var key = 'f5e76488de20e5944d66a73317c6ca05';
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.long}&exclude=minutely,daily&appid=${key}&lang=en`)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            failedToLoad();
        }

        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
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

function getDeg(deg){
  while(deg >= 360){
    deg -= 360;
  }
  return deg;
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
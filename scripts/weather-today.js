$(window).ready(function(){

    failedToLoad("loading");
    getLocation();
  });

function updateWeather(){
    getWeatherAPIHour();
}

function processesData(data) {
    //today
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    var locElement = document.querySelector('.today .location');
    var discriptionElement = document.querySelector('.today .discription');
    var windIconElement = document.querySelector('.today .windicon');
    var windSpeedElement =  document.querySelector('.today .speed');
    var pressureElement = document.querySelector('.info .pressure');
    var humidityElement = document.querySelector('.info .humidity');
    var visibilityElement = document.querySelector('.info .visibility');
    var dewPointElement = document.querySelector('.info .dewpoint');
    var uviElement = document.querySelector('.sun .uvi');
    var dawnElement = document.querySelector('.sun .dawn');
    var duskElement = document.querySelector('.sun .dusk');
  
    var temp = Math.round(data.current.temp - 273.14);
    var icon = data.current.weather[0].icon;
    var disc = data.current.weather[0].description;
    var windDeg = getDeg(data.current.wind_deg + 45 + 180);
    var windSpeed = Math.round(data.current.wind_speed * 3.6 * 10)/10;
    var pressure = data.current.pressure;
    var humidity = data.current.humidity;
    var visibility = data.current.visibility;
    var dewpoint = data.current.dew_point;
    var uvi = data.current.uvi;
    var dusk = new Date(data.current.sunset * 1000);
    dusk = dusk.getHours() + ':' + (dusk.getMinutes() < 10 ? '0'+dusk.getMinutes() : dusk.getMinutes());
    var dawn = new Date(data.current.sunrise * 1000);
    dawn = dawn.getHours() + ':' + (dawn.getMinutes() < 10 ? '0'+dawn.getMinutes() : dawn.getMinutes());
  
    temperatureElement.innerHTML = `${temp}°<span>C</span>`;
    iconElement.innerHTML = `<img src='../assets/photos/weather_icons_big/${icon}.png' alt='${disc}'>`;
    windIconElement.innerHTML = `<img style='transform: rotate(${windDeg}deg)' src='../assets/photos/wind-dir.svg' alt='${windDeg}°'>`;
    windSpeedElement.innerHTML = windSpeed + " km/h"
    discriptionElement.innerHTML = disc;
    locElement.innerHTML = loc;
    pressureElement.innerHTML = pressure + ' hPa';
    humidityElement.innerHTML = humidity + '%';
    visibilityElement.innerHTML = visibility + 'm';
    dewPointElement.innerHTML = Math.round(dewpoint - 273.15) + '°C';
    uviElement.innerHTML = 'UV-index: '+uvi;
    dawnElement.innerHTML = 'Sunrise<br>'+dawn;
    duskElement.innerHTML = 'Sunset<br>'+dusk;

    var begin = data.current.sunrise;
    var end = data.current.sunset;
    var current = data.current.dt;
    drawCanvasCycle(begin, end, current);

    //hour
    var start_time = new Date(data.hourly[0].dt * 1000);
    var start_hour = start_time.getHours();
    var temps = []
    var min_temp = 100;
    var max_temp = -100;
    for(var i = 0; i < 24; i++){
        var temp = Math.round((data.hourly[i].temp - 273.15)*100)/100;
        temps.push(temp);
        if(temp < min_temp){
            min_temp = temp;
        }
        if(temp > max_temp){
            max_temp = temp;
        }
    }
    drawCanvasHourly(start_hour, temps, max_temp, min_temp);
    
    //warning
    var warningElement = document.querySelector('.alerts .warnings');
    var inner;
    if(data.alerts === undefined){
        inner = `
        <li>
            <div class='warning'>
                <p class='event'>No warnings to report</p>
            </di>
        </li>
        `
        warningElement.innerHTML = inner;
    }
    else{

        data.alerts.forEach(alert => {
            console.log(alert);
            var start_date = new Date(alert.start*1000);
            var start = start_date.getDate() + '/' + (start_date.getMonth() + 1) + '/' + start_date.getFullYear();
            var end_date = new Date(alert.end*1000);
            var end = end_date.getDate() +'/' + (end_date.getMonth() + 1) + '/' + end_date.getFullYear();
            
            inner = `
            <li>
                <div class='warning'>
                    <p class='event'>${alert.event} (${start} -- ${end})</p>
                    <p class='disc'>${alert.description}</p>
                </di>
            </li>
            `
            warningElement.innerHTML += inner;
        });
    }
  }
  
  function failedToLoad(loading = ""){
    var discriptionElement = document.querySelector('.today .discription');
    var temperatureElement = document.querySelector('.today .temperature');
    var iconElement = document.querySelector('.today .icon');
    if(loading){
      temperatureElement.innerHTML = `--°<span>C</span>`;
      iconElement.innerHTML = `<img src='../assets/photos/weather_icons_big/unknown.png' alt='unknown'>`;
      discriptionElement.innerHTML = "Loading ...";
    }else{
      discriptionElement.innerHTML = "Couldn't reach API";
    }
  
  }

  function drawCanvasHourly(start_h, temps, t_max, t_min){
      var canvas = document.querySelector('#hour_temp');
      var ctx = canvas.getContext('2d');
      var w = 1200;
      var h = 213;
      canvas.width = w;
      canvas.height = h;
    
      var y_min = 40;
      var y_max = h - y_min;
      var dx = w / 24;
      var x_offset = w / 24 / 2;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.font = "20px Fjalla One";
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      for(var i = 0; i < 24; i++){
          var x = dx * i + x_offset;
          var y = h - y_min - (h - 2 * y_min)/(t_max-t_min)*(temps[i] - t_min);
          if(i == 0){
            ctx.moveTo(x, y);
            ctx.fillText(temps[0] + '°C', x, h - 10);
            ctx.fillText(start_h + ':00', x , 20);
          }else{
            ctx.lineTo(x, y);
            ctx.stroke();
            if( i % 2 == 0){
                ctx.fillText(temps[i] + '°C', x, h - 10);
                var hour = start_h + i;
                if(hour >= 24){
                    hour -= 24;
                }
                ctx.fillText(hour + ':00', x , 20);
            }
          }

      }

  }


  function drawCanvasCycle(begin, end, current){
    var canvas = document.querySelector('#sunpos');
    var ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 300;
    ctx.strokeStyle = "#ffffff";

    var r = canvas.width / 2 - 10;
    var a_offset = 20;
    var x_offset = 0;
    var y_offset = 20;
    var isday = true;

    var w = canvas.width;
    var h = canvas.height;

    ctx.lineWidth = 5;
    ctx.arc(w/2 + x_offset, h+y_offset, r, Math.PI+rad(a_offset), -rad(a_offset), false);
    ctx.stroke();
    
    var L = Math.sin(rad(90-a_offset)) * 2 * r;
    var daytime = end - begin;
    var suntime = current - begin;

    if(suntime < 0){
        suntime = daytime + suntime;
        isday = false;
    }
    else if(current > end){
        suntime = current-end;
        isday = false;
    }

    var scale = L / daytime;
    var x_start = w - w/2 - Math.cos(rad(a_offset))*r;
    var x_sun = scale*suntime + x_start - 25;
    var x_loc = w/2 - x_sun - 25;
    var y_sun = h- Math.sin(Math.acos((x_loc)/r))*r + y_offset - 25;
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x_sun, y_sun, 50, 50);
    }
    img.src = isday ? "../assets/photos/sun.svg" : "../assets/photos/moon.svg";
    var img2 = new Image();
    img2.onload = function() {
        ctx.drawImage(img2, w/2 - 50, h - 150, 100, 100);
    }
    img2.src = "../assets/photos/town.svg";
}

  function rad(deg){
    var pi = Math.PI;
    return deg * (pi/180);
  }
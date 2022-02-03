var apiKey = "ff8650a55971d04838c69e88908614ab";
var cityInputEl = document.getElementById("city-input");
var searchFormEl = document.getElementById("search-form");
var searchButtonEl = document.getElementById("search-btn");
var conditionsEl = document.getElementById("conditions");
var cityNameEl = document.getElementById("city-name")
var currentEl = document.getElementById("current-container");
var today = new Date().toLocaleDateString();
var forecastDateEl = document.getElementById("date")
var forecastInfo = document.getElementById("up-conditions")

var cityNameArr = [];
// get city name
var cityNameHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    cityNameArr.push(cityName);
    localStorage.setItem("city-name", cityNameArr);

    if (cityName) {
        getCityName(cityName);
        cityInputEl.value = "";
        cityNameEl.textContent = `${cityName} (${today})`


    } else {
        alert("Please enter city name")
    }

};



var getCityName = function (city) {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getConditions(data[0].lon, data[0].lat);

            })

        } else {
            alert("Error: " + response.statusText)
        }
    })
        .catch(function (error) {
            alert("unable to connect to Open Weather");
        });
};


var getConditions = function (lat, lon) {

    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=imperial&appid=${apiKey}`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (dataCon) {
                displayConditions(dataCon);
            })

        } else {
            alert("Error: " + response.statusText)
        }
    })
        .catch(function (error) {
            alert("unable to connect to Open Weather");
        });

}


var displayConditions = function (dataCon) {
    var icon = dataCon.daily[0].weather[0].icon;
    var temp = dataCon.daily[0].temp.day;
    var wind = dataCon.daily[0].wind_speed;
    var humidity = dataCon.daily[0].humidity;
    var uvi = dataCon.daily[0].uvi;

    var iconEl = document.createElement("img")
    iconEl.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    var tempLi = document.createElement("li")
    tempLi.textContent = `Temp: ${temp}F`
    var windLi = document.createElement("li")
    windLi.textContent = `Wind: ${wind}mph`
    var humidityLi = document.createElement("li")
    humidityLi.textContent = `Humidity: ${humidity}%`
    var uvIndexEl = document.createElement("li")
    uvIndexEl.innerHTML = `UV Index: <span class="uv-btn">${uvi}</span>`;
    conditionsEl.appendChild(tempLi);
    conditionsEl.appendChild(windLi);
    conditionsEl.appendChild(humidityLi);
    cityNameEl.appendChild(iconEl)
    conditionsEl.appendChild(uvIndexEl);

    for (i = 1; i < 6; i++) {

        var forecastDate = new Date(dataCon.daily[i].dt * 1000).toLocaleDateString();
        console.log(forecastDate);
        var forecastIcon = dataCon.daily[i].weather[0].icon;
        console.log(forecastIcon);
        var forecastTemp = dataCon.daily[i].temp.day;
        console.log(forecastTemp);
        var forecastWind = dataCon.daily[i].wind_speed;
        var forecastHumidity = dataCon.daily[i].humidity;

        var forecastIconEl = document.createElement("img")
        forecastIconEl.src = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
        forecastDateEl.textContent = forecastDate;
        var forecastTempLi = document.createElement('li')
        forecastTempLi.textContent = `Temp: ${forecastTemp}F`
        var forecastWindLi = document.createElement('li')
        forecastWindLi.textContent = `Wind: ${forecastWind}mph`
        var forecastHumidityLi = document.createElement('li')
        forecastHumidityLi.textContent = `Humidity: ${forecastHumidity}%`

        forecastDateEl.appendChild(forecastIconEl);
        // forecastTempLi.appendChild(forecastInfo);


    }
}



searchButtonEl.addEventListener("click", cityNameHandler);

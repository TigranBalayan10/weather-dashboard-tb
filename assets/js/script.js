var apiKey = "fb6399a2819ef492d50006a15ec7816f";
var cityInputEl = document.getElementById("city-input");
var searchFormEl = document.getElementById("search-form");
var searchButtonEl = document.getElementById("search-btn");
var conditionsEl = document.getElementById("conditions");
var cityNameEl = document.getElementById("city-name")
var today = new Date().toISOString().slice(0, 10);

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
                getForecast(data[0].lon, data[0].lat);
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

    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&.04&units=imperial&appid=${apiKey}`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (dataCon) {
                displayConditions(dataCon.current.temp, dataCon.current.wind_speed, dataCon.current.humidity, dataCon.current.weather[0].icon, dataCon.current.uvi);
            })

        } else {
            alert("Error: " + response.statusText)
        }
    })
        .catch(function (error) {
            alert("unable to connect to Open Weather");
        });

}

var displayConditions = function (temp, wind, humidity, icon, uvi) {

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
}

var getForecast = function (lat, lon) {

    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (dataFor) {
                console.log(dataFor);
            })

        } else {
            alert("Error: " + response.statusText)
        }
    })
        .catch(function (error) {
            alert("unable to connect to Open Weather");
        });

}



searchButtonEl.addEventListener("click", cityNameHandler);

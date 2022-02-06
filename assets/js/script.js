var apiKey = "ff8650a55971d04838c69e88908614ab";
var cityInputEl = document.getElementById("city-input");
var searchFormEl = document.getElementById("search-form");
var searchButtonEl = document.getElementById("search-btn");
var conditionsEl = document.getElementById("conditions");
var cityNameEl = document.getElementById("city-name");
var currentEl = document.getElementById("current-container");
var today = new Date().toLocaleDateString();
var forecastDateEl = document.getElementById("date");
var forecastInfo = document.getElementById("up-conditions");
var forecastCardEl = document.getElementById("forecast-card");
var weatherContainerEl = document.getElementById("current-weather");
var forecastContainer = document.getElementById("day-forecast");
var historyContainerEl = document.getElementById("history-container");
// make an array for storing city names
var cityNameArr = [];
// show stored city names 
var showSearchHistory = function () {
// get city names as an array or as JSON parsed
  cityNameArr = JSON.parse(localStorage.getItem("cities")) || [];
  displaySearchHistory();
};
// display city names in corresponding elements 
var displaySearchHistory = function () {
    // clear history container 
  historyContainerEl.innerHTML = "";
// create and append from local storage by looping
  for (i = 0; i < cityNameArr.length; i++) {
    var cityButtonEl = document.createElement("button");
    cityButtonEl.classList.add("btn", "btn-sm", "m-1", "city-btn");
    cityButtonEl.id = "city-btn" + i;
    cityButtonEl.textContent = cityNameArr[i];
    var buttonDivEl = document.createElement("div");
    buttonDivEl.classList.add(
      "col-auto",
      "d-flex",
      "flex-column",
      "btn-layout"
    );
    historyContainerEl.appendChild(buttonDivEl);
    buttonDivEl.appendChild(cityButtonEl);
  }
};
// get data for stored city by clicking on the name 
historyContainerEl.addEventListener("click", (event) => {
    //Get city name
  var storedCityName = event.target.textContent;
  if (storedCityName) {
    if (weatherContainerEl.classList.contains("hidden")) {
      weatherContainerEl.classList.remove("hidden");
    } else {
      cityNameEl.textContent = "";
      conditionsEl.textContent = "";
      forecastContainer.textContent = "";
    }
    //pass stored city name to get city name function
    getCityName(storedCityName);
    cityInputEl.value = "";
    cityNameEl.textContent = `${storedCityName} (${today})`;
  } else {
    return;
  }
});
// save input city names in local storage
var saveSearchHistory = function (cityName) {
    // add city names to array
  cityNameArr.push(cityName);
  // reverse the order to show last input first
  cityNameArr.reverse();
  // make it 7 saved cities only
  cityNameArr.splice(7);
  // store in local storage
  localStorage.setItem("cities", JSON.stringify(cityNameArr));
  displaySearchHistory();
};

var cityNameHandler = function (event) {
  event.preventDefault();
  // get city name
  var cityName = cityInputEl.value.trim();
  // if there is an input, removed hidden class
  if (cityName) {
    if (weatherContainerEl.classList.contains("hidden")) {
      weatherContainerEl.classList.remove("hidden");
    }
    //pass city name to get city name function
    getCityName(cityName);
    saveSearchHistory(cityName);
    // clear input field
    cityInputEl.value = "";
    cityNameEl.textContent = `${cityName} (${today})`;
  } else {
    alert("Please enter city name");
  }
};
// get latitude and longitude
var getCityName = function (city) {
  // variable for api to fetch
  var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  // fetch api
  fetch(apiUrl)
    .then(function (response) {
      // if there is a response make it json
      if (response.ok) {
        response.json().then(function (data) {
          //extract longitude and latitude from api and pass it to getConditions function
          getConditions(data[0].lon, data[0].lat);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("unable to connect to Open Weather");
    });
};
// get city name and weather conditions by lon and lat
var getConditions = function (lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=imperial&appid=${apiKey}`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (dataCon) {
          // pass all fetched data to display function
          displayConditions(dataCon);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("unable to connect to Open Weather");
    });
};
// display current and upcoming forecast
var displayConditions = function (dataCon) {
  // get all needed data from api
  var icon = dataCon.daily[0].weather[0].icon;
  var temp = dataCon.daily[0].temp.day;
  var wind = dataCon.daily[0].wind_speed;
  var humidity = dataCon.daily[0].humidity;
  var uvi = dataCon.daily[0].uvi;
  // make element to append with data
  var iconEl = document.createElement("img");
  iconEl.src = `http://openweathermap.org/img/wn/${icon}.png`;
  var tempLi = document.createElement("li");
  tempLi.textContent = `Temp: ${temp}F`;
  var windLi = document.createElement("li");
  windLi.textContent = `Wind: ${wind}mph`;
  var humidityLi = document.createElement("li");
  humidityLi.textContent = `Humidity: ${humidity}%`;
  var uvIndexEl = document.createElement("li");
  uvIndexEl.innerHTML = `UV Index: <span class="uv-btn">${uvi}</span>`;
  // append data to the page
  conditionsEl.appendChild(tempLi);
  conditionsEl.appendChild(windLi);
  conditionsEl.appendChild(humidityLi);
  cityNameEl.appendChild(iconEl);
  conditionsEl.appendChild(uvIndexEl);
  // make a loop for forecast for next 5 days
  for (i = 1; i < 6; i++) {
    // create elements for the card to be appended
    var forecastCard = document.createElement("div");
    forecastCard.className = "col-sm";
    var card = document.createElement("div");
    card.className = "card";
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";
    var h3 = document.createElement("h3");
    h3.className = "card-title";

    var ul = document.createElement("ul");
    ul.className = "card-text";
    // get data from api for next 5 days
    // time with milliseconds wasnt in proper format needed to multiply by 1000 to get accurate one
    var forecastDate = new Date(
      dataCon.daily[i].dt * 1000
    ).toLocaleDateString();
    var forecastIcon = dataCon.daily[i].weather[0].icon;
    var forecastTemp = dataCon.daily[i].temp.day;
    var forecastWind = dataCon.daily[i].wind_speed;
    var forecastHumidity = dataCon.daily[i].humidity;
    // make child elements for div with fetched data
    var forecastIconEl = document.createElement("img");
    forecastIconEl.src = `http://openweathermap.org/img/wn/${forecastIcon}.png`;
    h3.textContent = forecastDate;
    var forecastTempLi = document.createElement("li");
    forecastTempLi.textContent = `Temp: ${forecastTemp}F`;
    var forecastWindLi = document.createElement("li");
    forecastWindLi.textContent = `Wind: ${forecastWind}mph`;
    var forecastHumidityLi = document.createElement("li");
    forecastHumidityLi.textContent = `Humidity: ${forecastHumidity}%`;
    // append accordingly
    ul.appendChild(forecastTempLi);
    ul.appendChild(forecastWindLi);
    ul.appendChild(forecastHumidityLi);

    cardBody.appendChild(h3);
    cardBody.appendChild(forecastIconEl);
    cardBody.appendChild(ul);
    card.appendChild(cardBody);
    forecastCard.appendChild(card);

    forecastContainer.appendChild(forecastCard);
  }
};

showSearchHistory();
searchButtonEl.addEventListener("click", cityNameHandler);

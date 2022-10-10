let key = '27c96cea7ab25779d66dc61f613a0f9c';
let city = 'Seattle';
let currentDataCity = $('.currentCityData');
let forecastEl = $('.forecast');


// moment.js for current and future dates
let date = moment().format('dddd, MMMM Do YYYY');
let dateTime = moment().format('YYYY/MM/DD HH:MM:SS');


// function to get current city weather data
function weatherToday () {
    let currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
    $(currentDataCity).empty();
    $.ajax({
        url: currentWeather,
        method: 'GET',
    }).then(function (response) {
        $('.currentCityName').text(response.name);
        $('.currentDate').text(date);
    // Append weather data to the main weather card
    // Weather icons
        $('.icons').attr('src', "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
    // Temperature
		let temp = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		currentDataCity.append(temp);
	// Humidity
		let humidity = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		currentDataCity.append(humidity);
	// Wind Speed
		let wind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		currentDataCity.append(wind);
	// Set the latitude and longitude from the searched city
		let cityLon = response.coord.lon;
		let cityLat = response.coord.lat;
    // function for UVI
		let weatherUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;
        $.ajax({
            url: weatherUvi,
            method: 'GET',
        }).then(function (response) {
            let pElUvi = $('<p>').text(`UV Index: `);
            let uviSpan = $('<span>').text(response.current.uvi);
            let uvi = response.current.uvi;
            pElUvi.append(uviSpan);
            currentDataCity.append(pElUvi);

    // Set the colors of the UV index according to the value
            if (uvi >= 0 && uvi <= 2) {
                uviSpan.attr('class', 'green');
            } else if (uvi > 2 && uvi <= 5) {
                uviSpan.attr('class', 'yellow');
            } else if (uvi > 5 && uvi <= 7) {
                uviSpan.attr('class', 'orange');
            } else if (uvi > 7 && uvi <= 10) {
                uviSpan.attr('class', 'red');
            } else {
                uviSpan.attr('class', 'purple');
            }
        });
    });
    // Call the 5 day weather forecast
    forecast();
};

// Function for 5 day weather forecast
function forecast () {
    let forecastFive = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;
    $.ajax({
        url: forecastFive,
        method: 'GET',
    }).then(function (response) {
        let forecastArray = response.list;
        let myWeather = [];
        //Weather object
        $.each(forecastArray, function (index, value) {
            dataObject = {
                date: value.dt_txt.split(' ')[0],
                time: value.dt_txt.split(' ')[1],
                temp: value.main.temp,
                icon: value.weather[0].icon,
                humidity: value.main.humidity,
            }
            if (value.dt_txt.split(' ')[1] === "12:00:00") {
                myWeather.push(dataObject);
            }
        })
        // Append weather data to 5 day forecast container
        for (let i = 0; i < myWeather.length; i++) {
            let divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			forecastEl.append(divElCard);

			let divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			let m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			let divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			let divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			// Temperature
			let pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			// Humidity
			let pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
        }
    });
};


// Button for running weather functions and saving user input to local storage as an array
let history = [];
$('.search').on('click', function (event) {
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === '') {
        return;
    };
    history.push(city);
    localStorage.setItem('city', JSON.stringify(history));
    forecastEl.empty();
    weatherToday();
    cityHistory();
});


// Make buttons for search history
let cityInputs = $('.history');
function cityHistory() {
    cityInputs.empty();
    for (let i = 0; i < history.length; i++) {
        let rowEl = $('<row>');
        let btnEl = $('<button>').text(`${history[i]}`)
        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');
        cityInputs.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    }
    // Allow the cities in search history to load data on click
    $('.histBtn').on('click', function (event) {
        event.preventDefault();
        city = $(this).text();
        forecastEl.empty();
        weatherToday();
    });
};

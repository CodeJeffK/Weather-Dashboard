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
    
    });
};

function forecast () {
    let forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;
    $.ajax({
        url: forecast,
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

    })
};




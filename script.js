var cityList = $(".list");
// store api key
var apiKey = "207892b800595df6c438c64942627e3b";

var date = new Date();
var cities = [];

init();

$("#searchTerm").keypress(function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        $("#searchBtn").click();
    }
});

$("#searchBtn").on("click", function () {

    $('#forecastH5').addClass('show');

    // get the value of the input from user
    var city = $("#searchTerm").val();
    // Add new city to cities array, clear the input
    cities.push(city);

    // Store updated cities in localStorage, re-render the list
    storeCities();
    renderCities();

    $("#searchTerm").val("");
    getCurrentConditions(city);
    getCurrentForecast(city);

});

function init() {
    // Get stored cities from localStorage
    // Parsing the JSON string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
    }

    // Render cities to the DOM
    renderCities();
}

function renderCities() {
    cityList.empty();

    // Render a new li for each city
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var listItem = $("<li>").addClass("list-group-item city").text(city);
        cityList.append(listItem);
    }
}

function storeCities() {
    // Stringify and set "cities" key in localStorage to cities array
    localStorage.setItem("cities", JSON.stringify(cities));
}

function getCurrentConditions(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (response) {

            // get the temperature and convert to fahrenheit 
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            tempF = Math.floor(tempF);

            $('#currentCity').empty();

            // get and set the content 
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var city = $("<h4>").addClass("card-title").text(response.name);
            var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
            var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
            var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
            var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
            var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

            // add to page
            city.append(cityDate, image)
            cardBody.append(city, temperature, humidity, wind);
            card.append(cardBody);
            $("#currentCity").append(card)

            // $.ajax({
                // make a call to the uvi api
            // })
        })

}

function getCurrentForecast(city) {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey,
        method: "GET"
    }).then(function (response) {

        $('#forecast').empty();

        // variable to hold response.list
        var results = response.list;

        //declare start date to check against
        // startDate = 20
        //have end date, endDate = startDate + 5

        for (var i = 0; i < results.length; i++) {
            if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                // get the temperature and convert to fahrenheit 
                var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
                var tempF = Math.floor(temp);

                var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
                var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
                var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
                var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

                var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

                cardBody.append(cityDate, image, temperature, humidity);
                card.append(cardBody);
                $("#forecast").append(card);

            }
        }
    });

}

// Adding a click event listener to all elements with a class of "city"
$(document).on("click", ".city", function () {
    var city = $(this).text();
    getCurrentConditions(city);
    getCurrentForecast(city);
});
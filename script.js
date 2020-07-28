$(document).ready(function() {
    const cityContainer = $('#cityWeather');
    const recentSearches = $('#recentSearches');
    let storedCity = [];

rendersearchHistory();

    $('#searchBtn').on('click', function(event){
        event.preventDefault();
        cityContainer.empty();

        let city = $('#cityInput').val().trim();
        searchWeather(city);
        fiveDay(city);

        storedCity.push(city);
       
        localStorage.setItem('searchHistory', JSON.stringify(storedCity));
         $('#cityInput').val('');
        rendersearchHistory(city);
    })

function rendersearchHistory () {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    recentSearches.empty();

    for (let i = 0; i < searchHistory.length; i++) {
        
        let searchHistoryEL = $('<button id="previousBtn">').text(searchHistory[i]).val(searchHistory[i]);
        searchHistoryEL.addClass('historyBtn');

       
        recentSearches.prepend(searchHistoryEL);
    };
}

    $('#recentSearches').on('click', 'button', function(event) {
        event.preventDefault();
       
        let city = event.target.value;
        
        searchWeather(city);
        fiveDay(city);
        cityContainer.empty();
    });


function searchWeather(city) {
    // var weather = $(this).attr("data-name");
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=ab1f8fef34f0e489ad088b4507c416a5';

    $.ajax({
    url: queryURL,
    method: 'GET'
    }).then(function(response) {
        
        let date = moment().format('MM/DD/YYYY');
        let city = $('<h2>').text(response.name);
        let mainDate = city.append(' ' + date) 
        let iconimg = $("<img>").attr('src', 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
        let temperature = $('<p>').text(`Temperature: ${response.main.temp.toFixed(0)}\xB0F`);
        let humidity = $('<p>').text(`Humidity: ${response.main.humidity}%`);
        let windSpeed = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        
        cityContainer.append(mainDate)
        cityContainer.append(iconimg, temperature, humidity, windSpeed);
    
    let uvURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=ab1f8fef34f0e489ad088b4507c416a5&lat=' + response.coord.lat + '&lon=' + response.coord.lon;

    $.ajax({
        url: uvURL,
        method: 'GET'
    }).then(function(response) {
        let uvIndex = JSON.parse(response.value);
        let uvElement = $('<span>').text(`UV Index: ${response.value}`);
        
        if (uvIndex <= 2) {
            uvElement.css('background-color', 'green')
        } 
        if (uvIndex >= 3 || uvIndex <= 5) {
            uvElement.css('background-color', 'yellow')
        }  
        if (uvIndex >= 6 || uvIndex <=7) {
            uvElement.css('background-color', 'orange')
        }  
        if (uvIndex > 8) {
            uvElement.css('background-color', 'red')
        };
            
        cityContainer.append(uvElement);
        
    })
    });
};

function fiveDay(city) {
    let fivedayURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=ab1f8fef34f0e489ad088b4507c416a5';

    let fiveDayEL = $('#fiveDayCard');
    $.ajax({
        url: fivedayURL,
        method: 'GET'
    }).then(function(response) {
        
        fiveDayEL.empty();
        for (let i = 0; i < 5; i++) {
            let fivedaySpan = $('<span class= fiveSpan>')
            let fiveDate = $('<p>').text(`${response.list[i * 8 + 4].dt_txt.slice(0, 10)}`);
            let fiveTemp = $('<p>').text(`Temperature: ${response.list[i * 8 + 4].main.temp.toFixed(0)}\xB0F`);
            let fiveHumidity = $('<p>').text(`Humidity: ${response.list[i * 8 + 4].main.temp.toFixed(0)}%`);
            let fiveIcon = $("<img>").attr('src', 'https://openweathermap.org/img/wn/' + response.list[i * 8 + 4].weather[0].icon + '.png');
    
            fivedaySpan.append(fiveDate, fiveIcon, fiveTemp, fiveHumidity);
            fiveDayEL.append(fivedaySpan);

        }
    });
};
      
});
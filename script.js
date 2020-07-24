$(document).ready(function() {
    const cityContainer = $('#cityWeather');

    $('#searchBtn').on('click', function(event){
        event.preventDefault();
        cityContainer.empty();
        let city = $('#cityInput').val().trim();
        searchWeather(city);
    })

function searchWeather(cityName) {
    // var weather = $(this).attr("data-name");
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=ab1f8fef34f0e489ad088b4507c416a5'

    $.ajax({
    url: queryURL,
    method: 'GET'
    }).then(function(response) {
        
        let date = moment().format('MM/DD/YYYY');
        let city = $('<h2>').text(response.name);
        let iconimg = $("<img>").attr('src', 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png')
        let temperature = $('<p>').text(`Temperature: ${response.main.temp.toFixed(0)}`);
        let humidity = $('<p>').text(`Humidity: ${response.main.humidity}`);
        let windSpeed = $('<p>').text(`Wind Speed: ${response.wind.speed}`);
        
        cityContainer.append(city, date, iconimg, temperature, humidity, windSpeed);
    
    let uvURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=ab1f8fef34f0e489ad088b4507c416a5&lat=' + response.coord.lat + '&lon=' + response.coord.lon;

    $.ajax({
        url: uvURL,
        method: 'GET'
    }).then(function(response) {
        let uvindex = response.value;
        let uv = $('<div>').text(`UV Index: ${response.value}`);
    

        if (uvindex <= 2) {
            cityContainer.attr('class', 'low')
        } else if (uvindex >= 3 || uvindex <= 5) {
            cityContainer.attr('class', 'moderate')
        } else if (uvindex >= 6 || uvindex <=7) {
            cityContainer.attr('class', 'high')
        } else {
            cityContainer.attr('class', 'veryHigh')
        };

        cityContainer.append(uv)
        
       
    })
    
    });
      
      
    
}
})
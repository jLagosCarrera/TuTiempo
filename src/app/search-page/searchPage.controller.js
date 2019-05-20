export default class SearchPageController {
    constructor(openWeatherMapsService, geoNamesService, latestSearchesUtilService, $timeout, $state) {
        this.openWeatherMapsService = openWeatherMapsService;
        this.geoNamesService = geoNamesService;
        this.latestSearchesUtilService = latestSearchesUtilService;
        this.$timeout = $timeout;
        this.$state = $state;
        this.nearbyCities = [];
    }

    $onInit() {
        if (this.$state.params.city) {
            this.cityParam = this.$state.params.city.toLowerCase();
        }
        this.latestSearches = this.latestSearchesUtilService.getLatestSearches();
        this.latestSearchesUtilService.addCity(this.cityParam, this.latestSearches);

        this.geoNamesService.getNearbyCities(this.cityParam)
            .then((data) => {
                const cities = data.map(city => city.name);
                this.$timeout(() => this.nearbyCities = cities);
            })
            .catch((error) => {
                console.log(error); //TODO on next tickets
            });

        this.openWeatherMapsService.getFiveDayForecastCity(this.cityParam)
            .then((data) => {
                const todayForecast = [];
                const fiveDayForecast = new Map();

                data.data.list.forEach((hourlyForecast) => {
                    //Forecast Date, converted from unix to miliseconds
                    const forecastDate = new Date(hourlyForecast.dt * 1000);

                    //If todays date equals forecast date, push it to the array
                    //So we get the data for all the today hours
                    //If not, push it to the map with the day key and only take
                    //The data for forecasts at 09, 15 and 21
                    if (forecastDate.getDate() === new Date().getDate()) {
                        todayForecast.push(hourlyForecast);
                    } else {
                        if ([9, 15, 21].includes(forecastDate.getHours() + (forecastDate.getTimezoneOffset() / 60))) {
                            if (fiveDayForecast.has(forecastDate)) {
                                fiveDayForecast.set(forecastDate, fiveDayForecast.get(forecastDate).push(hourlyForecast));
                            } else {
                                fiveDayForecast.set(forecastDate, [hourlyForecast]);
                            }
                        }
                    }
                });

                console.log(todayForecast);
                console.log(fiveDayForecast);
            })
            .catch((error) => {
                console.log(error); //TODO on next tickets
            });
    }
}

SearchPageController.$inject = ['openWeatherMapsService', 'geoNamesService', 'latestSearchesUtilService', '$timeout', '$state'];
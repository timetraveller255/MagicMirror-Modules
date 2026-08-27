/* MagicMirror²
 * Module: Onecall OpenWeatherMap
 *
 * Redesigned by Răzvan Cristea
 * for iPad 3 & HD display
 *
 * https://github.com/razvanh255
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 */
Module.register("onecall", {
	// Default module config.
	defaults: {
		// optional settings only if oneLoader is not used
		lat: config.lat,			 		 // your location latitude,
		lon: config.lon,			   		 // your location longitude,
		appId: config.apiKey,
		dayUpdateInterval: 10 * 60 * 1000,   // every 10 minutes
		nightUpdateInterval: 30 * 60 * 1000, // every 30 minutes
		random: false,
		appIds: {
			random: [

			]
		},

		// important settings
		endpointType: "onecall",			// "onecall", "current", "hourly" or "daily"
		oneLoader: false,					// very important for just one API call
		pollutionOneLoader: true,			// very important for Air Pollution API call
		processAir: true,

		// general settings
		location: config.location,
		units: config.units,
		initialLoadDelay: 2000,
		animationSpeed: config.animationSpeed,
		timeFormat: config.timeFormat,
		language: config.language,
		decimalSymbol: config.decimalSymbol,
		degreeLabel: true,
		appendLocationNameToHeader: false,
		useLocationAsHeader: false,
		tempClass: "xxlarge",
		tableClass: "xmedium",
		showRainAmount: true,				// snow show only in winter months
		onlyTemp: false,
		plusForecast: false,
		hideTemp: false,
		roundTemp: false,					// error if is true
		addExtra: true,
		showTopDescription: false,

		// current settings
		showWindDirection: true,
		showWindDirectionAsArrow: true,		// not realy working
		showIndoorTemp_Hum: true,
		useBeaufort: false,
		useKMPHwind: true,
		showFeelsLike: true,
		realFeelsLike: true,				// show real not calculated
		showCurrentRainAmount: true,
		showVisibility: true,
		showHumidity: true,
		showPressure: true,
		showDew: true,						// dew point
		showUvi: true,						// UV index
		showMinMax: true,
		showAlerts: true,
		notificationAlert: true,			// "full" for detailed alert notification
		defaultIcons: false,				// with or without default icons

		// hourly & daily settings
		flexDayForecast: true,				// show Flex Daily Forecast, set maxNumberOfDays to 3 or 6
		hourlyForecast: true,
		flexHourForecast: true,				// show Flex Hourly Forecast, set maxNumberOfDays to 3 to 48
		maxNumberOfDays: 6,
		maxNumberOfHours: 6,
		fadeDaily: false,
		fadeHourly: false,
		fadePoint: 0.25,					// Start on 1/4th of the list.
		colored: true,
		extraHourly: true,					// show extra hourly humidity, dew point, pressure, real feel and rain or snow,
		extraDaily: true,
		dailyDesc: true,					// show description
		daily: "dddd",						// "ddd" for short day name or "dddd" for full day name
		hourly: "HH.mm",					// "HH [h]" for hourly forecast or "HH.mm" for hour and minutes

		// Air pollution
		calculateAqi: true,			// calculate AQI from pollutants concentration (not fully tested)
		showAqiTime: true,			// show last update time
		showAqiData: true,			// show AQI calculation pollutants, hidding last update
		showPollution: false,		// snow list of all pollutants, hidding AQI calculation of all pollutants

		// DHT22
		gpioPin: 4,
		updateSensor: 60 * 1000,
		temperatureOffset: -1.5,		// Default temperature offset adjustment
		humidityOffset: 0,			// Default humidity offset adjustment
		temperatureUnit: 'C',		// Default temperature unit (Celsius)
		humidityUnit: '%',

		iconTable: {
			"01d": "day-sunny",
			"02d": "day-cloudy",
			"03d": "cloudy",
			"04d": "day-cloudy-windy",
			"09d": "day-showers",
			"10d": "day-rain",
			"11d": "day-thunderstorm",
			"13d": "day-snow",
			"50d": "day-fog",
			"01n": "night-clear",
			"02n": "night-alt-cloudy",
			"03n": "night-cloudy",
			"04n": "night-alt-cloudy",
			"09n": "night-alt-showers",
			"10n": "night-alt-rain",
			"11n": "night-alt-thunderstorm",
			"13n": "night-alt-snow",
			"50n": "night-alt-cloudy-windy"
		}
	},

	// Define required scripts.
	getScripts: function () {
		return [
				//	"moment.js"
				];
	},

	// Define required scripts.
	getStyles: function () {
		return ["onecall.css"
				//	, "fontawesome.css", "weather-icons-wind.css"
				];
	},

	// Define required translations.
	getTranslations: function () {
		return {
			en: "en.json",
			ro: "ro.json"
		};
	},

	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);
		this.loaded = false;
		this.lastappIdsIndex = -1;

		if (!this.config.oneLoader) {
			this.OneUpdate();
			this.scheduleUpdate();
		}

		// Set locale.
		moment.locale(this.config.language);
		this.now = moment().format("HH:mm");
		this.date = moment().format("DD.MM.YYYY");

		this.windSpeed = 0;
		this.windDirection = 0;
		this.windDeg = 0;
		this.temperature = "0";
		this.weatherType = 0;
		this.feelsLike = 0;
		this.dew = 0;
		this.uvi = 0;
		this.desc = 0;
		this.dailyDesc = 0;
		this.hourlyailyDesc = 0;
		this.rain = 0;
		this.snow = 0;
		this.minTemp = "0";
		this.maxTemp = "0";
		this.pressure = 0;
		this.visibility = 0;
		this.start = 0;
		this.end = 0;
		this.startDate = 0;
		this.endDate = 0;
		this.alert = 0;

		this.aqi = 0;
		this.aqi_t = 0;
		this.aqi_i = 0;
		this.aqi_s = 0;
		this.c_co = 0;
		this.c_no = 0;
		this.c_no2 = 0;
		this.c_o3 = 0;
		this.c_so2 = 0;
		this.c_pm25 = 0;
		this.c_pm10 = 0;
		this.c_nh3 = 0;

		var self = this;
		if (this.config.pollutionOneLoader) {
			setTimeout(function () {
				self.AirUpdate();
			}, this.config.initialLoadDelay);
		}

		if (this.config.showIndoorTemp_Hum) {
			this.indoorTemperature = "";
			this.indoorHumidity = "";
			this.sendSocketNotification('START_DHT_READING', { gpioPin: this.config.gpioPin });

			setInterval(function() {
				self.sendSocketNotification('START_DHT_READING', { gpioPin: self.config.gpioPin });
			}, this.config.updateSensor);
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'DHT_DATA') {
			if (payload.humidity >= 0 && payload.humidity <= 100) {
				var temperature = payload.temperature + this.config.temperatureOffset;
				temperature = this.convertTemperature(temperature);
				var humidity = payload.humidity + this.config.humidityOffset;

				this.indoorTemperature = temperature;
				this.indoorHumidity = humidity.toFixed(1) + this.config.humidityUnit;
				document.querySelector('.indoorTemp').innerHTML = " <i class=\"wi wi-thermometer orange\"></i> " + this.indoorTemperature.replace(".", this.config.decimalSymbol);
				document.querySelector('.indoorHum').innerHTML = " <i class=\"wi wi-humidity skyblue\"></i> " + this.indoorHumidity.replace(".", this.config.decimalSymbol);
			//	Log.info('DHT22: H' + payload.humidity + " T" + payload.temperature);
			} else {
				Log.warn('Invalid humidity reading:', payload.humidity);
			}
		}
	},

	convertTemperature: function(celsiusTemperature) {
		// Conversion formula from Celsius to Fahrenheit
		if (this.config.temperatureUnit === 'F') {
			return ((celsiusTemperature * 9/5 + 32).toFixed(1) + '°F');
		}
		return (celsiusTemperature.toFixed(1) + '°C'); // Default to Celsius
	},

	// add extra information of current weather
	// windDirection, pressure, visibility and humidity
	addExtraInfoWeather: function (wrapper) {
		var small = document.createElement("div");
		small.className = "center normal medium currentweather";

		var windIcon = document.createElement("span");
		windIcon.className = "wi wi-strong-wind skyblue";
		small.appendChild(windIcon);

		if (this.config.showWindDirection) {
			var windDirection = document.createElement("span");
			if (this.config.showWindDirectionAsArrow) {
				if (this.windDeg !== null) {
					windDirection.className = "wind";
					windDirection.innerHTML = " <i class=\"wi wi-direction-down\" style=\"transform:rotate(" + this.windDeg + "deg);\"></i>";
				}
			} else {
				windDirection.className = "wind subs";
				windDirection.innerHTML = " " + this.translate(this.windDirection);
			}
			small.appendChild(windDirection);
		}

		var windSpeed = document.createElement("span");
		if (this.windSpeed > 50 && this.windSpeed < 75) {
			windSpeed.className = "skyblue";
		} else if (this.windSpeed > 75 && this.windSpeed < 100) {
			windSpeed.className = "yellow";
		} else if (this.windSpeed > 100) {
			windSpeed.className = "orange";
		} else windSpeed.className = " ";
		windSpeed.innerHTML = " " + this.windSpeed;
		small.appendChild(windSpeed);

		var windSpeedUnit = document.createElement("span");
		windSpeedUnit.className = "subs";
		if (this.config.units === "metric" || this.config.units === "default") {
			windSpeedUnit.innerHTML = "km/h ";
		} else if (this.config.units === "imperial") {
			windSpeedUnit.innerHTML = "mph ";
		}
		small.appendChild(windSpeedUnit);

		// pressure.
		if (this.config.showPressure) {
			var pressure = document.createElement("span");
			var atpressure = Math.round(this.pressure * 750.062 / 1000);
				if (atpressure < 745) {
					pressure.className = "pressure skyblue";
				} else if (atpressure > 775) {
					pressure.className = "pressure orange";
				} else pressure.className = "pressure green";
			pressure.innerHTML = " <i class=\"wi wi-barometer gold\"></i>" + Math.round(this.pressure * 750.062 / 1000);
			small.appendChild(pressure);

			var pressureSub = document.createElement("span");
			pressureSub.className = "subs";
			pressureSub.innerHTML = "Hg ";
			small.appendChild(pressureSub);
		}

		// visibility.
		if (this.config.showVisibility) {
			var visibility = document.createElement("span");
			visibility.className = "visibility";
			visibility.innerHTML = " <i class=\"fa fa-binoculars violet\"></i>" + this.visibility / 1000;
			small.appendChild(visibility);

			var visibilityUnit = document.createElement("span");
			visibilityUnit.className = "subs";
			if (this.config.units === "metric" || this.config.units === "default") {
				visibilityUnit.innerHTML = "km ";
			} else if (this.config.units === "imperial") {
				visibilityUnit.innerHTML = "mi ";
			}
			small.appendChild(visibilityUnit);
		}

		// humidity.
		if (this.config.showHumidity) {
			var humidity = document.createElement("span");
			if (this.humidity < 30) {
				humidity.className = "skyblue";
			} else if (this.humidity > 50 && this.humidity < 80) {
				humidity.className = "yellow";
			} else if (this.humidity > 80) {
				humidity.className = "orange";
			} else humidity.className = " ";
			humidity.innerHTML = " <i class=\"wi wi-humidity skyblue\"></i>" + this.humidity + "%";
			small.appendChild(humidity);
		}

		wrapper.appendChild(small);
	},

	// Override dom generator.
	getDom: function () {
		if (!this.config.oneLoader) {
			if (this.config.appId === "" && this.config.random === false) {
				var wrapper = document.createElement("div");
				wrapper.innerHTML = "Please set the correct openweather <i>appId</i> in the config for module: " + this.name + ".";
				wrapper.className = "dimmed light small";
				this.sendNotification("SHOW_ALERT", {type: "notification", title: 'Eroare Onecall', message: 'Eroare la aducerea datelor meteo'});
				return wrapper;
			}
		}
	
		if (!this.config.colored) {
			var onegray = Array.from(document.querySelectorAll(".onecall"));
			onegray.forEach(function(element) {return element.style.filter = "grayscale(1)";});
		}

		var wrapper = document.createElement("div");
		wrapper.className = "current weather normal";
		
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;

			this.OneUpdate();
			var self = this;
			if (this.config.pollutionOneLoader) {
				setTimeout(function () {
					self.AirUpdate();
				}, this.config.initialLoadDelay);
			}
		}

		if (this.config.endpointType === "current" || this.config.endpointType === "onecall") {

			if (this.config.addExtra !== false) {
				this.addExtraInfoWeather(wrapper);
			}

			if (this.config.showTopDescription) {
				var description = document.createElement("div");
				if (this.alert === null || !(this.now >= this.start && this.now < this.end) || !(this.date >= this.startDate && this.date <= this.endDate)) {
					description.className = "bright current-description slarge details";
					description.innerHTML = this.desc;
				} else if (this.alert !== null && (this.now >= this.start && this.now < this.end) && (this.date >= this.startDate && this.date <= this.endDate)) {
					description.className = "orangered current-description medium details";
					description.innerHTML = "<i class=\"fas fa-wind\"></i> " + this.translate("ALERTS") + this.start + "-" + this.end;
				} 
				wrapper.appendChild(description);
			}

			var large = document.createElement("div");
			large.className = "center light";

			var degreeLabel = "";
			if (this.config.units === "metric" || this.config.units === "imperial") {
				degreeLabel;
			}
			if (this.config.degreeLabel) {
				switch (this.config.units) {
					case "metric":
						degreeLabel += "C";
						break;
					case "imperial":
						degreeLabel += "F";
						break;
					case "default":
						degreeLabel += "K";
						break;
				}
			}

			if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
				this.config.decimalSymbol = ".";
			}

			if (this.config.hideTemp === false) {
				var iconwrapper = document.createElement("span");
				if (this.config.defaultIcons) {
					iconwrapper.className = "current-weather mlarge";
					iconwrapper.style.transform = "translate(0) !important";
				} else {
					iconwrapper.className = "currentweather";
				}
				large.appendChild(iconwrapper);

				var weatherIcon = document.createElement("span");
				weatherIcon.className = "wi weathericon wi-" + this.weatherType;
				iconwrapper.appendChild(weatherIcon);

				var tempwrapper = document.createElement("span");
				tempwrapper.className = "currentweather";
				large.appendChild(tempwrapper);

				var temperature = document.createElement("span");
				temperature.className = "bright light " + this.config.tempClass;
				temperature.innerHTML = " " + this.temperature.replace(".", this.config.decimalSymbol) + "<sup>&deg;" + degreeLabel + "</sup";
				tempwrapper.appendChild(temperature);
			}

			wrapper.appendChild(large);

			if (this.config.showIndoorTemp_Hum) {
				var inDoor = document.createElement("div");
				inDoor.className = "inDoor"; // hidden";

				var indoorIcon = document.createElement("span");
				indoorIcon.className = "medium";
				indoorIcon.innerHTML = "<i class=\"fa fa-home gold\"></i> " + this.translate("HOME");
				inDoor.appendChild(indoorIcon);

				var indoorTemperature = document.createElement("span");
				indoorTemperature.className = "medium bright indoorTemp";
				indoorTemperature.innerHTML = " Update";
				inDoor.appendChild(indoorTemperature);

				var indoorHumidity = document.createElement("span");
				indoorHumidity.className = "medium bright indoorHum";
				indoorHumidity.innerHTML = " sensor";
				inDoor.appendChild(indoorHumidity);
			}

			wrapper.appendChild(inDoor);

			if (this.config.onlyTemp === false) {
				var small = document.createElement("div");
				small.className = "normal medium details";

				// only for metric.
				if (this.config.showFeelsLike) {
					var feelsLike = document.createElement("div");
					if (this.config.units == "metric") {
						if (this.feelsLike == -0) {this.feelsLike = 0}
						if (this.feelsLike >= 45) {
							feelsLike.className = "real redrf";
						} else if (this.feelsLike >= 40 && this.feelsLike < 45) {
							feelsLike.className = "real orangered";
						} else if (this.feelsLike >= 35 && this.feelsLike < 40) {
							feelsLike.className = "real tomato";
						} else if (this.feelsLike >= 30 && this.feelsLike < 35) {
							feelsLike.className = "real coral";
						} else if (this.feelsLike >= 25 && this.feelsLike < 30) {
							feelsLike.className = "real darkorange";
						} else if (this.feelsLike >= 20 && this.feelsLike < 25) {
							feelsLike.className = "real gold";
						} else if (this.feelsLike >= 15 && this.feelsLike < 20) {
							feelsLike.className = "real yellow";
						} else if (this.feelsLike >= 10 && this.feelsLike < 15) {
							feelsLike.className = "real greenyellow";
						} else if (this.feelsLike >= 5 && this.feelsLike < 10) {
							feelsLike.className = "real chartreuse";
						} else if (this.feelsLike >= 0 && this.feelsLike < 5) {
							feelsLike.className = "real lawngreen";
						} else if (this.feelsLike >= -5 && this.feelsLike < 0) {
							feelsLike.className = "real lime";
						} else if (this.feelsLike >= -10 && this.feelsLike < -5) {
							feelsLike.className = "real powderblue";
						} else if (this.feelsLike >= -15 && this.feelsLike < -10) {
							feelsLike.className = "real lightblue";
						} else if (this.feelsLike >= -20 && this.feelsLike < -15) {
							feelsLike.className = "real skyblue";
						} else if (this.feelsLike >= -25 && this.feelsLike < -20) {
							feelsLike.className = "real lightskyblue";
						} else if (this.feelsLike >= -30 && this.feelsLike < -25) {
							feelsLike.className = "real deepskyblue";
						} else if (this.feelsLike < 30) {
							feelsLike.className = "real dodgerblue";
						}
					} else feelsLike.className = "dimmed real";

					feelsLike.innerHTML = this.translate("Real feel: ") + "<i class=\"wi wi-thermometer yellow xmedium\"></i> " + this.feelsLike + "&deg;" + degreeLabel;
					small.appendChild(feelsLike);
				}

				// min max temp.
				if (this.config.showMinMax) {
					var minmax = document.createElement("div"); 
					minmax.className = "medium";
					minmax.innerHTML = "<span class='coral'>Max. <i class=\"wi wi-thermometer xmedium\"></i> " + this.maxTemp.replace(".", this.config.decimalSymbol) + "&deg;" + degreeLabel + "</span> &nbsp; <span class='skyblue'>Min. <i class=\"wi wi-thermometer xmedium\"></i> " + this.minTemp.replace(".", this.config.decimalSymbol) + "&deg;" + degreeLabel + "</span>";
					small.appendChild(minmax);
				}

				// dew point.
				if (this.config.showDew) {
					var dew = document.createElement("span"); 
					dew.className = "dew medium cyan";
					dew.innerHTML = "<i class=\"wi wi-raindrops lightgreen\"></i> " + this.dew.toFixed(1).replace(".", this.config.decimalSymbol) + "&deg;" + degreeLabel + " &nbsp; "; // this.translate("Dew Point: ") + "<i class=\"wi wi-raindrops lightgreen\"></i> " + this.dew.toFixed(1).replace(".", this.config.decimalSymbol) + "&deg;" + degreeLabel + " &nbsp; ";
					small.appendChild(dew);
				}

				// uv index.
				if (this.config.showUvi) {
					var uvi = document.createElement("span");
					uvi.className = "uvi medium";
					uvi.innerHTML = "<i class=\"wi wi-hot gold\"></i> " + this.uvi.toFixed(1).replace(".", this.config.decimalSymbol) + " &nbsp; "; // this.translate("UVI") + "<i class=\"wi wi-hot gold\"></i> " + this.uvi.toFixed(1).replace(".", this.config.decimalSymbol);
					if (this.uvi < 0.1) {
						uvi.className = uvi.className + " lightgreen";
						uvi.innerHTML = "<i class=\"wi wi-stars\"></i> 0 &nbsp; "; // this.translate("UVI") + "<i class=\"wi wi-stars\"></i> 0";
					} else if (this.uvi > 0 && this.uvi < 3) {
						uvi.className = uvi.className + " lime";
					} else if (this.uvi >= 3 && this.uvi < 6) {
						uvi.className = uvi.className + " yellow";
					} else if (this.uvi >= 6 && this.uvi < 8) {
						uvi.className = uvi.className + " orange";
					} else if (this.uvi >= 8 && this.uvi < 11) {
						uvi.className = uvi.className + " orangered";
					} else if (this.uvi >= 11) {
						uvi.className = uvi.className + " violet";
					}
					small.appendChild(uvi);
				}

				// precipitation
				if (this.config.showCurrentRainAmount) {
					var precipitation = document.createElement("span");
					precipitation.className = "prep medium";
					if (this.precipitation > 0) {
						if(config.units === "imperial") {
							precipitation.innerHTML = (this.precipitation / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>"; // this.translate("PRECIP") + (this.precipitation / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
						} else {
							precipitation.innerHTML = this.precipitation.toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>"; // this.translate("PRECIP") + this.precipitation.toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
						}
					} else {
						precipitation.innerHTML = this.translate("No prep") + " <i class=\"fa fa-tint-slash skyblue\"></i>";
					}
					small.appendChild(precipitation);
				}
				wrapper.appendChild(small);
			}

			//weather description and alerts.
			if (!this.config.showTopDescription) {
				var description = document.createElement("div");
				description.className = "bright current-description details slarge";
				if (this.alert === null || !(this.now >= this.start && this.now < this.end) || !(this.date >= this.startDate && this.date <= this.endDate)) {
					description.innerHTML = this.desc;
				} else if (this.alert !== null && (this.now >= this.start && this.now < this.end) && (this.date >= this.startDate && this.date <= this.endDate)) {
					description.innerHTML = this.desc + "<div class='orangered medium'><i class=\"fas fa-wind\"></i> " + this.translate("ALERTS") + this.start + "-" + this.end + "<br>" + this.alert + "</div>";
				} 
				wrapper.appendChild(description);
			}
		}

		// Air quality
		if (this.config.processAir) {

			var aqi = document.createElement("div");
			aqi.className = "normal xslarge aqi bright";
			var aqi_q = null; var aqi_c = null; var aqi_b = null;
			if (this.config.calculateAqi) {
				if (this.aqi_i <= 25) {
					aqi_q = this.translate("Good");
					aqi_c = "lime";
				} else if (this.aqi_i > 25 && this.aqi_i <= 50) {
					aqi_q = this.translate("Fair");
					aqi_c = "yellow";
				} else if (this.aqi_i > 50 && this.aqi_i <= 75) {
					aqi_q = this.translate("Moderate");
					aqi_c = "orange";
				} else if (this.aqi_i > 75 && this.aqi_i <= 100) {
					aqi_q = this.translate("Poor");
					aqi_c = "orangered";
				} else if (this.aqi_i > 100) {
					aqi_q = this.translate("Unhealty");
					aqi_c = "red";
				}

				aqi.innerHTML = "<i class=\"fa-solid fa-leaf medium lime\"></i> " + this.translate("Index") + ": <span class=" + aqi_c + ">" + aqi_q + "</span>"; //" (" + this.aqi_i + ")</span>";
				
			} else {
				if (this.aqi === 1) { 
					aqi_q = this.translate("Good");
					aqi_c = "lime";
				} else if (this.aqi === 2) { 
					aqi_q = this.translate("Fair");
					aqi_c = "yellow";
				} else if (this.aqi === 3) { 
					aqi_q = this.translate("Moderate");
					aqi_c = "orange";
				} else if (this.aqi === 4) { 
					aqi_q = this.translate("Poor");
					aqi_c = "orangered";
				} else if (this.aqi === 5) { 
					aqi_q = this.translate("Unhealty");
					aqi_c = "red";
				}
				aqi.innerHTML = "<i class=\"fa-solid fa-leaf medium lime\"></i> " + this.translate("Index") + ": <span class=" + aqi_c + ">" + aqi_q + "</span>";

			}
			
			wrapper.appendChild(aqi);
				
			if (this.config.showAqiData && !this.config.showPollution) {
				var aqi_d = document.createElement("div");
				aqi_d.className = "center normal small aqi_d";
				aqi_d.innerHTML = "PM<sub>10</sub> <span class=bright>" + Math.round(this.c_pm10/1.8)
						+ "</span>; PM<sub>2.5</sub> <span class=bright>" + Math.round(this.c_pm25/1.1)
						+ "</span>; O<sub>3</sub> <span class=bright>" + Math.round(this.c_o3/2.4*1.7)
						+ "</span>; NO<sub>2</sub> <span class=bright>" + Math.round(this.c_no2/4)
						+ "</span>; SO<sub>2</sub> <span class=bright>" + Math.round(this.c_so2/5*1.3)
						+ "</span>";
				wrapper.appendChild(aqi_d);

			} else if (this.config.showAqiTime) {
				var aqi_t = document.createElement("div");
				aqi_t.className = "shade small aqi_t";
				aqi_t.innerHTML = this.translate("Update") + this.aqi_t + ", " + this.config.location;
				wrapper.appendChild(aqi_t);
			}
				
			if (this.config.showPollution) {
				this.config.showAqiData = false;
				var spacer = document.createElement("br");
				wrapper.appendChild(spacer);

				var c_pm10 = document.createElement("div");
				c_pm10.className = "normal small c_pm10";
				c_pm10.innerHTML = "10μm particle (PM<sub>10</sub>) <span class=bright>" + this.c_pm10.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_pm10);

				var c_pm25 = document.createElement("div");
				c_pm25.className = "normal small c_pm25";
				c_pm25.innerHTML = "2.5μm particle (PM<sub>2.5</sub>) <span class=bright>" + this.c_pm25.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_pm25);
					
				var c_o3 = document.createElement("div");
				c_o3.className = "normal small c_o3";
				c_o3.innerHTML = "Ozone (O<sub>3</sub>) <span class=bright>" + this.c_o3.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_o3);

				var c_no2 = document.createElement("div");
				c_no2.className = "normal small c_no2";
				c_no2.innerHTML = "Nitrogen dioxide (NO<sub>2</sub>) <span class=bright>" + this.c_no2.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_no2);

				var c_no = document.createElement("div");
				c_no.className = "normal small c_no";
				c_no.innerHTML = "Nitrogen monoxide (NO) <span class=bright>" + this.c_no.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_no);

				var c_so2 = document.createElement("div");
				c_so2.className = "normal small c_so2";
				c_so2.innerHTML = "Sulphur dioxide (SO<sub>2</sub>) <span class=bright>" + this.c_so2.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_so2);

				var c_co = document.createElement("div");
				c_co.className = "normal small c_co";
				c_co.innerHTML = "Carbon monoxide (CO) <span class=bright>" + (this.c_co/1000).toFixed(2).replace(".", this.config.decimalSymbol) + " mg/m³</span>";
				wrapper.appendChild(c_co);

				var c_nh3 = document.createElement("div");
				c_nh3.className = "normal small c_nh3";
				c_nh3.innerHTML = "Ammonia (NH<sub>3</sub>) <span class=bright>" + this.c_nh3.toFixed(2).replace(".", this.config.decimalSymbol) + " µg/m³</span>";
				wrapper.appendChild(c_nh3);
			}
		}

		//daily forecast
		if ((this.config.endpointType === "daily" || this.config.endpointType === "onecall") && this.config.onlyTemp === false || this.config.plusForecast === true) {

			if (this.config.appendLocationNameToHeader) {
				var header = document.createElement("header");
				header.className = "header";
				header.innerHTML = "<i class=\"wi wi-day-cloudy skyblue\"></i>&nbsp; " + this.translate("Next days") + this.config.location;
				wrapper.appendChild(header);
			} else {
				var header = document.createElement("header");
				header.className = "header";
				header.innerHTML = "<i class=\"wi wi-day-cloudy skyblue\"></i>&nbsp; " + this.translate("Next days");
				wrapper.appendChild(header);
			}

			if (this.config.flexDayForecast) {
				var container = document.createElement("div");
				container.className = "daily flex-container weatherforecast normal";

				for (var f in this.forecastDaily) {
					var forecast = this.forecastDaily[f];

					var item = document.createElement("div");
					if (this.config.defaultIcons) {
						item.className = "item forecast weatherforecast";
						item.style.lineHeight = "1.8rem";
					} else {
						item.className = "item forecast currentweather";
					}
					container.appendChild(item);

					var dayCell = document.createElement("div");
					dayCell.className = "fday medium";
					dayCell.style.textTransform = "capitalize";
					dayCell.innerHTML = forecast.day;
					item.appendChild(dayCell);

					var icon = document.createElement("div");
					icon.className = "wi forecasticon wi-" + forecast.icon;
					if (this.config.defaultIcons) {
						icon.style.transform = "scale(2)";
						icon.style.padding = "17px";
					} else {
						icon.style.transform = "scale(0.8)";
					}
					item.appendChild(icon);

					var degreeLabel = "";
					if (this.config.units === "metric" || this.config.units === "imperial") {
						degreeLabel += "&deg;";
					}
					if (this.config.degreeLabel) {
						switch (this.config.units) {
							case "metric":
								degreeLabel += "C";
								break;
							case "imperial":
								degreeLabel += "F";
								break;
							case "default":
								degreeLabel = "K";
								break;
						}
					}

					if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
						this.config.decimalSymbol = ".";
					}

					var maxTempCell = document.createElement("div");
					maxTempCell.innerHTML = "<i class=\"wi wi-thermometer\"></i> " + forecast.maxTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					maxTempCell.className = "maxtemp coral medium";
					item.appendChild(maxTempCell);

					var minTempCell = document.createElement("div");
					minTempCell.innerHTML = "<i class=\"wi wi-thermometer\"></i> " + forecast.minTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					minTempCell.className = "mintemp skyblue medium";
					item.appendChild(minTempCell);

					if (this.config.dailyDesc) {
						var dailyDesc = document.createElement("span");
						dailyDesc.innerHTML = "<span class='desc'>" + forecast.dailyDesc + '</span>';
						dailyDesc.className = "forecast-description smedium";
						item.appendChild(dailyDesc);
					}


					if (this.config.showRainAmount) {
						var rainCell = document.createElement("div");
						rainCell.className = "xmedium bright";
						if (!forecast.snow && !forecast.rain) {
							rainCell.className = "xmedium normal";
							rainCell.innerHTML = this.translate("No rain") + "&nbsp; <i class=\"fa fa-tint-slash skyblue small\"></i>";
						} else if (forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							}
						} else if (forecast.rain) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						} else if (forecast.rain && forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain + forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain + forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						}

						item.appendChild(rainCell);
					}

					if (this.config.extraDaily) {
						var humidity = document.createElement("span");
						humidity.innerHTML = "<i class=\"wi wi-humidity\"></i> " + parseFloat(forecast.humidity).toFixed(0) + "%";
						humidity.className = "humidity skyblue extra small";
						item.appendChild(humidity);

						var dewPoint = document.createElement("span");
						dewPoint.innerHTML = "&nbsp; " + parseFloat(forecast.dewPoint).toFixed(1).replace(".", this.config.decimalSymbol) + degreeLabel;
						dewPoint.className = "dewPoint cyan extra small";
						item.appendChild(dewPoint);

						var pressure = document.createElement("span");
						pressure.innerHTML = "<br>" + Math.round(forecast.pressure * 750.062 / 1000).toFixed(0) + "Hg";
						pressure.className = "pressure gold extra small";
						item.appendChild(pressure);
						
						var uvIndex = document.createElement("span");
						uvIndex.innerHTML = "&nbsp; UVI " + parseFloat(forecast.uvIndex).toFixed(1).replace(".", this.config.decimalSymbol);
						uvIndex.className = "uvIndex lightgreen extra small";
						item.appendChild(uvIndex);

						container.appendChild(item);
					}
				}

				wrapper.appendChild(container);

			} else {

				var table = document.createElement("table");
				table.className = "daily weatherforecast " + this.config.tableClass;

				for (var f in this.forecastDaily) {
					var forecast = this.forecastDaily[f];

					var row = document.createElement("tr");
					row.className = "forecast normal";
					table.appendChild(row);

					var dayCell = document.createElement("td");
					if (this.config.language == "ro") {
						dayCell.className = "align-left day ro";
					} else dayCell.className = "align-left day en";
					dayCell.innerHTML = forecast.day;
					row.appendChild(dayCell);

					var iconCell = document.createElement("td");
					iconCell.className = "align-center bright weather-icon";
					row.appendChild(iconCell);

					var icon = document.createElement("span");
					icon.className = "align-center wi forecast-icon wi-" + forecast.icon;
					iconCell.appendChild(icon);

					var degreeLabel = "";
					if (this.config.units === "metric" || this.config.units === "imperial") {
						degreeLabel += "&deg;";
					}
					if (this.config.degreeLabel) {
						switch (this.config.units) {
							case "metric":
								degreeLabel += "C";
								break;
							case "imperial":
								degreeLabel += "F";
								break;
							case "default":
								degreeLabel = "K";
								break;
						}
					}

					if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
						this.config.decimalSymbol = ".";
					}

					var maxTempCell = document.createElement("td");
					maxTempCell.innerHTML = forecast.maxTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					maxTempCell.className = "align-center max-temp coral";
					row.appendChild(maxTempCell);

					var minTempCell = document.createElement("td");
					minTempCell.innerHTML = forecast.minTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					minTempCell.className = "align-center min-temp skyblue";
					row.appendChild(minTempCell);

					if (this.config.showRainAmount) {
						var rainCell = document.createElement("td");
						rainCell.className = "align-right bright";
						if (!forecast.snow && !forecast.rain) {
							rainCell.className = "align-right rain";
							rainCell.innerHTML = this.translate("No rain") + " <i class=\"fa fa-tint-slash skyblue\"></i>";
						} else if (forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							}
						} else if (forecast.rain) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						} else if (forecast.rain && forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain + forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain + forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						}

						row.appendChild(rainCell);
					}

					if (this.config.fadeDaily && this.config.fadePoint < 1) {
						if (this.config.fadePoint < 0) {
							this.config.fadePoint = 0;
						}
						var startingPoint = this.forecastDaily.length * this.config.fadePoint;
						var steps = this.forecastDaily.length - startingPoint;
						if (f >= startingPoint) {
							var currentStep = f - startingPoint;
							row.style.opacity = 1 - (1 / steps) * currentStep;
						}
					}

					// add extra information of weather forecast
					// humidity, dew point,, pressure, feels like and UV index

					if (this.config.extraDaily) {
						var row = document.createElement("tr");
						row.className = "extra normal";
						table.appendChild(row);

						var humidity = document.createElement("td");
						humidity.innerHTML = "<i class=\"wi wi-humidity skyblue little\"></i> " + parseFloat(forecast.humidity).toFixed(0) + "%";
						humidity.className = "align-left humidity";
						row.appendChild(humidity);

						var dewPoint = document.createElement("td");
						dewPoint.innerHTML = parseFloat(forecast.dewPoint).toFixed(1).replace(".", this.config.decimalSymbol) + degreeLabel;
						dewPoint.className = "align-right dewPoint cyan";
						row.appendChild(dewPoint);

						var pressure = document.createElement("td");
						pressure.innerHTML = Math.round(forecast.pressure * 750.062 / 1000).toFixed(0) + "Hg";
						pressure.className = "align-rightr pressure gold";
						row.appendChild(pressure);

						var realFeelDay = document.createElement("td");
						realFeelDay.innerHTML =  "<span class=\"currentweather\"><i class=\"wi wi-thermometer yellow\"></i></span> " + parseFloat(forecast.realFeelsDay).toFixed(0) + degreeLabel;
						realFeelDay.className = "align-right realFeel yellow";
						row.appendChild(realFeelDay);
							
						var uvIndex = document.createElement("td");
						uvIndex.innerHTML = "UV Idx " + parseFloat(forecast.uvIndex).toFixed(1).replace(".", this.config.decimalSymbol);
						uvIndex.className = "align-right uvIndex lightgreen";
						row.appendChild(uvIndex);
					}

					if (this.config.fadeDaily && this.config.fadePoint < 1) {
						if (this.config.fadePoint < 0) {
							this.config.fadePoint = 0;
						}
						var startingPoint = this.forecastDaily.length * this.config.fadePoint;
						var steps = this.forecastDaily.length - startingPoint;
						if (f >= startingPoint) {
							var currentStep = f - startingPoint;
							row.style.opacity = 1 - (1 / steps) * currentStep;
						}
					}
				}

				wrapper.appendChild(table);
			}
		}

		//hourly forecast
		if ((this.config.endpointType === "hourly" || this.config.endpointType === "onecall") && this.config.onlyTemp === false && this.config.hourlyForecast === true) {

			if (this.config.appendLocationNameToHeader) {
				var header = document.createElement("header");
				header.className = "header";
				header.innerHTML = "<i class=\"wi wi-day-cloudy skyblue\"></i>&nbsp; " + this.translate("Next hours") + this.config.location;
				wrapper.appendChild(header);
			} else {
				var header = document.createElement("header");
				header.className = "header";
				header.innerHTML = "<i class=\"wi wi-day-cloudy skyblue\"></i>&nbsp; " + this.translate("Next hours");
				wrapper.appendChild(header);
			}

			if (this.config.flexHourForecast) {
				var container = document.createElement("div");
				container.className = "hourly flex-container weatherforecast normal";
				if (this.config.defaultIcons) {
					container.style.flexWrap = "nowrap";
					container.style.gap = "30px";
				} else {
					container.style.flexWarp = "warp";
				}

				for (var f in this.forecastHourly) {
					var forecast = this.forecastHourly[f];

					var item = document.createElement("div");
					if (this.config.defaultIcons) {
						item.className = "item forecast weatherforecast";
						item.style.lineHeight = "1.8rem";
					} else {
						item.className = "item forecast currentweather";
					}
					container.appendChild(item);

					var dayCell = document.createElement("div");
					dayCell.className = "fday medium";
					dayCell.innerHTML = "<i class='wi wi-time-4 green'></i> " + forecast.hour;
					item.appendChild(dayCell);

					var icon = document.createElement("div");
					icon.className = "wi forecasticon wi-" + forecast.icon;
					if (this.config.defaultIcons) {
						icon.style.transform = "scale(2)";
						icon.style.padding = "17px";
					} else {
						icon.style.transform = "scale(0.8)";
					}
					item.appendChild(icon);

					var degreeLabel = "";
					if (this.config.units === "metric" || this.config.units === "imperial") {
						degreeLabel += "&deg;";
					}
					if (this.config.degreeLabel) {
						switch (this.config.units) {
							case "metric":
								degreeLabel += "C";
								break;
							case "imperial":
								degreeLabel += "F";
								break;
							case "default":
								degreeLabel = "K";
								break;
						}
					}

					if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
						this.config.decimalSymbol = ".";
					}

					var medTempCell = document.createElement("div");
					medTempCell.innerHTML = "<i class=\"wi wi-thermometer\"></i> " + forecast.hourTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					medTempCell.className = "dayTemp yellow medium";
					item.appendChild(medTempCell);

					if (this.config.showRainAmount) {
						var rainCell = document.createElement("div");
						rainCell.className = "xmedium bright";
						if (!forecast.snow && !forecast.rain) {
							rainCell.className = "xmedium normal";
							rainCell.innerHTML = this.translate("No rain") + "&nbsp; <i class=\"fa fa-tint-slash skyblue small\"></i>";
						} else if (forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							}
						} else if (forecast.rain) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						} else if (forecast.rain && forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain + forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain + forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						}

						item.appendChild(rainCell);
					} 

					if (this.config.extraHourly) {
						var humidity = document.createElement("span");
						humidity.innerHTML = "<i class=\"wi wi-humidity\"></i> " + parseFloat(forecast.humidity).toFixed(0) + "%";
						humidity.className = "humidity skyblue extra small";
						item.appendChild(humidity);

						var dewPoint = document.createElement("span");
						dewPoint.innerHTML = "&nbsp; " + parseFloat(forecast.dewPoint).toFixed(1).replace(".", this.config.decimalSymbol) + degreeLabel;
						dewPoint.className = "dewPoint cyan extra small";
						item.appendChild(dewPoint);

						var pressure = document.createElement("span");
						pressure.innerHTML = "<br>" + Math.round(forecast.pressure * 750.062 / 1000).toFixed(0) + "Hg";
						pressure.className = "pressure gold extra small";
						item.appendChild(pressure);
						
						var uvIndex = document.createElement("span");
						uvIndex.innerHTML = "&nbsp; UVI " + parseFloat(forecast.uvIndex).toFixed(1).replace(".", this.config.decimalSymbol);
						uvIndex.className = "uvIndex lightgreen extra small";
						item.appendChild(uvIndex);
					}

					container.appendChild(item);
				}

				wrapper.appendChild(container);

			} else {

				var table = document.createElement("table");
				table.className = "hourly weatherforecast " + this.config.tableClass;

				for (var f in this.forecastHourly) {
					var forecast = this.forecastHourly[f];

					var row = document.createElement("tr");
					row.className = "forecast normal";
					table.appendChild(row);

					var dayCell = document.createElement("td");

					if (this.config.language == "ro") {
						dayCell.className = "align-left day ro";
					} else dayCell.className = "align-left day en";

					dayCell.innerHTML = forecast.hour;
					row.appendChild(dayCell);

					var iconCell = document.createElement("td");
					iconCell.className = "align-center bright weather-icon";
					row.appendChild(iconCell);

					var icon = document.createElement("span");
					icon.className = "align-center wi forecast-icon wi-" + forecast.icon;
					iconCell.appendChild(icon);

					var degreeLabel = "";
					if (this.config.units === "metric" || this.config.units === "imperial") {
						degreeLabel += "&deg;";
					}
					if (this.config.degreeLabel) {
						switch (this.config.units) {
							case "metric":
								degreeLabel += "C";
								break;
							case "imperial":
								degreeLabel += "F";
								break;
							case "default":
								degreeLabel = "K";
								break;
						}
					}

					if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
						this.config.decimalSymbol = ".";
					}

					var medTempCell = document.createElement("td");
					medTempCell.innerHTML = forecast.hourTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
					medTempCell.className = "align-right lime";
					row.appendChild(medTempCell);

					var realFeel = document.createElement("td");
					realFeel.innerHTML = "<span class=\"currentweather\"><i class=\"wi wi-thermometer yellow\"></i></span> " + parseFloat(forecast.realFeels).toFixed(0).replace(".", this.config.decimalSymbol) + degreeLabel;
					realFeel.className = "align-right yellow";
					row.appendChild(realFeel);	

					if (this.config.showRainAmount) {
						var rainCell = document.createElement("td");
						rainCell.className = "align-right bright";
						if (!forecast.snow && !forecast.rain) {
							rainCell.className = "align-right rain";
							rainCell.innerHTML = this.translate("No rain") + " <i class=\"fa fa-tint-slash skyblue\"></i>";
						} else if (forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-snowflake-cold lightblue\"></i>";
							}
						} else if (forecast.rain) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						} else if (forecast.rain && forecast.snow) {
							if (config.units !== "imperial") {
								rainCell.innerHTML = parseFloat(forecast.rain + forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm <i class=\"wi wi-umbrella lime\"></i>";
							} else {
								rainCell.innerHTML = (parseFloat(forecast.rain + forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in <i class=\"wi wi-umbrella lime\"></i>";
							}
						}

						row.appendChild(rainCell);
					}

					if (this.config.fadeHourly && this.config.fadePoint < 1) {
						if (this.config.fadePoint < 0) {
							this.config.fadePoint = 0;
						}
						var startingPoint = this.forecastHourly.length * this.config.fadePoint;
						var steps = this.forecastHourly.length - startingPoint;
						if (f >= startingPoint) {
							var currentStep = f - startingPoint;
							row.style.opacity = 1 - (1 / steps) * currentStep;
						}
					}

					// add extra information of weather forecast
					// humidity, dew point,, pressure, visibility and UV index

					if (this.config.extraHourly) {
						var row = document.createElement("tr");
						row.className = "extra normal";
						table.appendChild(row);

						var humidity = document.createElement("td");
						humidity.innerHTML = "<i class=\"wi wi-humidity skyblue little\"></i> " + parseFloat(forecast.humidity).toFixed(0) + "%";
						humidity.className = "align-left humidity";
						row.appendChild(humidity);

						var dewPoint = document.createElement("td");
						dewPoint.innerHTML = parseFloat(forecast.dewPoint).toFixed(1).replace(".", this.config.decimalSymbol) + degreeLabel;
						dewPoint.className = "align-center dewPoint cyan";
						row.appendChild(dewPoint);

						var pressure = document.createElement("td");
						pressure.innerHTML = Math.round(forecast.pressure * 750.062 / 1000).toFixed(0) + "Hg";
						pressure.className = "align-center pressure gold";
						row.appendChild(pressure);

						var visible = document.createElement("td");
						if (this.config.units === "metric" || this.config.units === "default") {
							visible.innerHTML =  forecast.visibility/1000 + " Km";
						} else if (this.config.units === "imperial") {
							visible.innerHTML =  Math.round(forecast.visibility/1000).toFixed(2) + " mi";
						}
						visible.className = "align-center violet visibility";
						row.appendChild(visible);

						var uvIndex = document.createElement("td");
						uvIndex.innerHTML = "UV Idx " + parseFloat(forecast.uvIndex).toFixed(1).replace(".", this.config.decimalSymbol);
						uvIndex.className = "align-right uvIndex lightgreen";
						row.appendChild(uvIndex);
					}

					if (this.config.fadeHourly && this.config.fadePoint < 1) {
						if (this.config.fadePoint < 0) {
							this.config.fadePoint = 0;
						}
						var startingPoint = this.forecastHourly.length * this.config.fadePoint;
						var steps = this.forecastHourly.length - startingPoint;
						if (f >= startingPoint) {
							var currentStep = f - startingPoint;
							row.style.opacity = 1 - (1 / steps) * currentStep;
						}
					}
				}

				wrapper.appendChild(table);
			}
		}

		return wrapper;
	},

	// Override getHeader method.
	getHeader: function () {
		if (this.config.useLocationAsHeader && this.config.location !== false) {
			if (this.data.header) return this.config.location;
		}

		if (this.config.appendLocationNameToHeader) {
			if (this.data.header) return this.data.header + " " + this.config.location;
		}

		return this.data.header ? this.data.header : "";
	},

	randomIndex: function (appIds) {
		if (appIds.length === 1) {
			return 0;
		}
		var generate = function () {
			return Math.floor(Math.random() * appIds.length);
		};
		var appIdsIndex = generate();
		while (appIdsIndex === this.lastappIdsIndex) {
			appIdsIndex = generate();
		}
		this.lastappIdsIndex = appIdsIndex;
		return appIdsIndex;
	},
	
	appIdsArray: function () {
		var appIds;
		appIds = this.config.appIds.random;
		return appIds;
	},
	
	randomappIds: function () {
		var appIds = this.appIdsArray();
		var index = this.randomIndex(appIds);
		return appIds[index];
	},

	/* updateWeather(compliments)
	 * Requests new data from openweather.org.
	 * Calls processWeather on succesfull response.
	 */
	OneUpdate: function () {
		if ((this.config.appId === "") && !this.config.random) {
			return Log.error("OneCall: appId not set!");
		}

		var params = "?lat=" + this.config.lat + "&lon=" + this.config.lon + "&units=" + config.units + "&lang=" + this.config.language;
		if (this.config.random) {
			url = "https://api.openweathermap.org/data/3.0/onecall" + params + "&exclude=minutely" + "&appId=" + this.randomappIds();
		} else {
			url = "https://api.openweathermap.org/data/3.0/onecall" + params + "&exclude=minutely" + "&appId=" + this.config.appId;
		}

		var self = this;
		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, true);
		weatherRequest.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
				//	send payload for other instances
					self.sendNotification("ONE_RESPONSE", JSON.parse(this.response));
				//	Log.info("ONE_RESPONSE", JSON.parse(this.response));
					if (self.config.endpointType === "current") {
						self.processWeather(JSON.parse(this.response));
					}
					else if (self.config.endpointType === "hourly") {
						self.processHourly(JSON.parse(this.response));
					}
					else if (self.config.endpointType === "daily") {
						self.processDaily(JSON.parse(this.response));
					}
					else if (self.config.endpointType === "onecall"){
						self.processWeather(JSON.parse(this.response));
						self.processDaily(JSON.parse(this.response));
						self.processHourly(JSON.parse(this.response));
					}
				} else if (this.status === 401) {
					self.DomUpdate(this.config.initialLoadDelay)
					return Log.error("OneCall: appId not available!");
				} else if (this.status === 429) {
					return Log.error("Onecall: Exceeding of requests!");
				} else {
					Log.error(self.name + ": Incorrect appId. Could not load weather.");
				}
			}
		};
		weatherRequest.send();
	},

	AirUpdate: function () {
		if ((this.config.appId === "") && !this.config.random) {
			return Log.error("OneCall: appId not set!");
		}

		if (this.config.random) {
			url = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + this.config.lat + "&lon=" + this.config.lon + "&appId=" + this.randomappIds();
		} else {
			url = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + this.config.lat + "&lon=" + this.config.lon + "&appId=" + this.config.appId;
		}

		var self = this;
		var airRequest = new XMLHttpRequest();
		airRequest.open("GET", url, true);
		airRequest.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.sendNotification("AIR_RESPONSE", JSON.parse(this.response));
					if (self.config.processAir) {
						self.processAir(JSON.parse(this.response));
					}
				//	Log.info("AIR_RESPONSE", JSON.parse(this.response));
				} else if (this.status === 401) {
					return Log.error("Air Pollution: appId not available!");
				} else if (this.status === 429) {
					return Log.error("Air Pollution: Exceeding of requests!");
				} else {
					Log.error(self.name + ": Incorrect appId. Could not load Air Pollution.");
				}
			}
		};
		airRequest.send();
	},

	/* processAir(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - air quality information received form openweathermap.org.
	 */
	processAir: function (data) {
		if (!data || !data.list || typeof data.list[0] === "undefined") {
			return Log.error("NO AIR POLLUTION DATA");
		}
		
		if (data.list[0].hasOwnProperty("main")) {
			this.aqi = data.list[0].main.aqi;
		}

		if (data.list[0].hasOwnProperty("dt")) {
			this.aqi_t = moment(data.list[0].dt, "X").format("HH:mm");
		}

		if (data.list[0].hasOwnProperty("components")) {
			var aqi_p = data.list[0].components;
			this.c_co = aqi_p.co;
			this.c_no = aqi_p.no;
			this.c_no2 = aqi_p.no2;
			this.c_o3 = aqi_p.o3;
			this.c_so2 = aqi_p.so2;
			this.c_pm25 = aqi_p.pm2_5;
			this.c_pm10 = aqi_p.pm10;
			this.c_nh3 = aqi_p.nh3;
		}

		if (this.config.calculateAqi) {
			this.aqi_i = Math.max(
				Math.round(this.c_no2/4*1.3),   // mandatory
				Math.round(this.c_no/4)*1.3,	// optional
				Math.round(this.c_pm10/1.8),	// mandatory 
				Math.round(this.c_o3/2.4*1.7),  // mandatory
				Math.round(this.c_pm25/1.1),	// optional
				Math.round(this.c_so2/5),	   // optional
				Math.round(this.c_nh3/16*0.9),  // optional
				Math.round(this.c_co/2000*0.9)  // optional
			).toFixed(0);

			if (this.aqi_i <= 25) {
				this.aqi_s = 1;
			} else if (this.aqi_i > 25 && this.aqi_i <= 50) {
				this.aqi_s = 2;
			} else if (this.aqi_i > 50 && this.aqi_i <= 75) {
				this.aqi_s = 3;
			} else if (this.aqi_i > 75 && this.aqi_i <= 100) {
				this.aqi_s = 4;
			} else if (this.aqi_i > 100) {
				this.aqi_s = 5;
			}

			this.sendNotification("AIRQUALITY_INDEX", { index: "AQI_" + this.aqi_s });
			Log.log("AIRQUALITY_INDEX", { index: "AQI_" + this.aqi_s + " (" + this.aqi_i + ")" });
			if ((this.aqi_i > 100) && (this.config.notificationAlert)) {
				this.sendNotification("DAY_NOTIFICATION", {imageFA: "leaf red", title: this.translate("Index"), message: "Aerul este " + this.translate("Unhealty") + " (" + this.aqi_i + ")", timer: 10000000});
			}
		} else {
			this.sendNotification("AIRQUALITY_INDEX", { index: "AQI_" + this.aqi });
			Log.log("AIRQUALITY_INDEX", { index: "AQI_" + this.aqi });
			if ((this.aqi > 4) && (this.config.notificationAlert)) {
				this.sendNotification("DAY_NOTIFICATION", {imageFA: "leaf red", title: this.translate("Index"), message: "Aerul este " + this.translate("Unhealty") + " (" + this.aqi + ")", timer: 10000000});
			}
		}

		this.DomUpdate(this.config.initialLoadDelay)
	},

	// Override notification handler.
	notificationReceived: function (notification, payload, sender) {
		if (notification === "DOM_OBJECTS_CREATED") {
			var empty = "";
			this.hide(0, empty, { lockString: this.identifier });
		}

		//	recevie payload for other instances
		if (notification === "ONE_RESPONSE" && this.config.oneLoader) {
			if (this.config.endpointType === "current") {
				this.processWeather(payload);
			}
			if (this.config.endpointType === "daily") {
				this.processDaily(payload);
			}
			if (this.config.endpointType === "hourly") {
				this.processHourly(payload);
			}
			if (this.config.endpointType === "onecall") {
				this.processWeather(payload);
				this.processDaily(payload);
				this.processHourly(payload);
			}
		}
	},

	/* processWeather(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Weather information received form openweather.org.
	 */
	processWeather: function (data) {
		if (!data || !data.current || typeof data.current.temp === "undefined") {
			// Did not receive usable new data. Maybe this needs a better check?
			return Log.error("NO CURRENT WEATHETR DATA");
		}

		this.humidity = parseFloat(data.current.humidity);
		this.temperature = this.roundValue(data.current.temp);
		this.feelsLike = 0
		this.desc = data.current.weather[0].description;			// weather description.
		this.pressure = data.current.pressure;						// main pressure.
		this.visibility = data.current.visibility;					// visibility.
		this.dew = data.current.dew_point;							// dew point.
		this.uvi = data.current.uvi;								// uv index.
		this.minTemp = parseFloat(data.daily[0].temp.min).toFixed(1);	// temp min.
		this.maxTemp = parseFloat(data.daily[0].temp.max).toFixed(1);	// temp max.

		if (data.hasOwnProperty("alerts") && this.config.showAlerts) {
			this.start = moment.unix(data.alerts[0].start).format("HH:mm");
			this.end = moment.unix(data.alerts[0].end).format("HH:mm");
			this.startDate = moment.unix(data.alerts[0].start).format("DD.MM.YYYY");
			this.endDate = moment.unix(data.alerts[0].end).format("DD.MM.YYYY");
			this.alert = data.alerts[0].description;
			this.event = data.alerts[0].event;
			this.sender = data.alerts[0].sender_name;
			this.tags = data.alerts[0].tags;
			if (this.config.notificationAlert === "full" && (this.now >= this.start && this.now < this.end) && (this.date >= this.startDate && this.date <= this.endDate)) {
				this.sendNotification("DAY_NOTIFICATION", {imageFA: "wind red", title: this.translate("ALERTS") + "<br>" + this.start + " - " + this.end, message: this.alert , timer: 15000});
				this.sendNotification("CURRENTWEATHER_ALERT", { tags: "weather_alert" }); // this.tags
			} else if (this.config.notificationAlert === true && (this.now >= this.start && this.now < this.end) && (this.date >= this.startDate && this.date <= this.endDate)) {
				this.sendNotification("DAY_NOTIFICATION", {imageFA: "wind red", title: this.translate("ALERT!"), message: this.translate("ALERT") + this.translate(" between ") + this.start + " - " + this.end , timer: 10000});
				this.sendNotification("CURRENTWEATHER_ALERT", { tags: "weather_alert" }); // this.tags
			}
			Log.log("CURRENTWEATHER_ALERT", { tags: "weather_alert" });
			Log.log("Start: " + this.startDate + " at "+ this.start + " Stop: " + this.endDate + " at "+ this.end);
		}
		
		this.temperature === "-0.0" ? 0.0 : this.temperature;

		var precip = false;
		if (data.current.hasOwnProperty("rain") && !isNaN(data.current["rain"]["1h"])) {
			if (this.config.units === "imperial") {
				this.rain = data.current["rain"]["1h"] / 25.4;
			} else {
				this.rain = data.current["rain"]["1h"];
			}
			precip = true;
		}
		if (data.current.hasOwnProperty("snow") && !isNaN(data.current["snow"]["1h"])) {
			if (this.config.units === "imperial") {
				this.snow = data.current["snow"]["1h"] / 25.4;
			} else {
				this.snow = data.current["snow"]["1h"];
			}
			precip = true;
		}
		if (precip) {
			this.precipitation = this.rain + this.snow;
		}

		if (this.config.realFeelsLike) {
			this.feelsLike = parseFloat(data.current.feels_like).toFixed(0);
		} else if (windInMph > 3 && tempInF < 50) {
			// windchill
			var windChillInF = Math.round(35.74 + 0.6215 * tempInF - 35.75 * Math.pow(windInMph, 0.16) + 0.4275 * tempInF * Math.pow(windInMph, 0.16));
			var windChillInC = (windChillInF - 32) * (5 / 9);

			switch (this.config.units) {
				case "metric":
					this.feelsLike = windChillInC.toFixed(0);
					break;
				case "imperial":
					this.feelsLike = windChillInF.toFixed(0);
					break;
				case "default":
					this.feelsLike = (windChillInC + 273.15).toFixed(0);
					break;
			}
		} else if (tempInF > 80 && this.humidity > 40) {
			// heat index
			var Hindex =
				-42.379 +
				2.04901523 * tempInF +
				10.14333127 * this.humidity -
				0.22475541 * tempInF * this.humidity -
				6.83783 * Math.pow(10, -3) * tempInF * tempInF -
				5.481717 * Math.pow(10, -2) * this.humidity * this.humidity +
				1.22874 * Math.pow(10, -3) * tempInF * tempInF * this.humidity +
				8.5282 * Math.pow(10, -4) * tempInF * this.humidity * this.humidity -
				1.99 * Math.pow(10, -6) * tempInF * tempInF * this.humidity * this.humidity;

			switch (this.config.units) {
				case "metric":
					this.feelsLike = parseFloat((Hindex - 32) / 1.8).toFixed(0);
					break;
				case "imperial":
					this.feelsLike = Hindex.toFixed(0);
					break;
				case "default":
					var tc = parseFloat((Hindex - 32) / 1.8) + 273.15;
					this.feelsLike = tc.toFixed(0);
					break;
			}
		}

		if (this.config.useBeaufort) {
			this.windSpeed = this.ms2Beaufort(this.roundValue(data.current.wind_speed));
		} else if (this.config.useKMPHwind) {
			this.windSpeed = parseFloat((data.current.wind_speed * 60 * 60) / 1000).toFixed(0);
		} else {
			this.windSpeed = parseFloat(data.current.wind_speed).toFixed(0);
		}

		this.windDirection = this.deg2Cardinal(data.current.wind_deg);
		this.windDeg = data.wind_deg;
		this.weatherType = this.config.iconTable[data.current.weather[0].icon];

		this.sendNotification("CURRENTWEATHER_TYPE", { type: this.config.iconTable[data.current.weather[0].icon].replace("-", "_") });
		this.DomUpdate(this.config.initialLoadDelay);
	},

	processDaily: function (data) {
		if (!data || !data.daily || typeof data.daily[0] === "undefined") {
			return Log.error("NO DAILY FORECAST DATA");
		}

		this.forecastDaily = [];
		var lastDay = null;
		var forecastData = {};
		var dayStarts = 7;
		var dayEnds = 18;

		// Handle different structs between onecall endpoints
		var forecastList = null;
		if (data.daily) {
			forecastList = data.daily;
		} else {
			Log.error("Unexpected forecast data");
			return undefined;
		}

		for (var i = 1, count = forecastList.length; i < count; i++) {
			var forecast = forecastList[i];

			var day;
			if (forecast.dt_txt) {
				day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format(this.config.daily);
			} else {
				day = moment.unix(forecast.dt).format(this.config.daily);
			}

			var self = this;
			if (day !== lastDay) {
				forecastData = {
					day: day,
					icon: this.config.iconTable[forecast.weather[0].icon],
					maxTemp: this.roundValue(forecast.temp.max),
					minTemp: this.roundValue(forecast.temp.min),
					rain: this.processRain(forecast, forecastList, moment),
					snow: this.processSnow(forecast, forecastList, moment),
					humidity: forecast.humidity,
					pressure: forecast.pressure,
					precip: this.roundValue(forecast.pop),
					realFeelsDay: this.roundValue(forecast.feels_like.day),
					dewPoint: this.roundValue(forecast.dew_point),
					uvIndex: forecast.uvi,
					visibility: forecast.visibility,
					dailyDesc: forecast.weather[0].description,
				};

				this.forecastDaily.push(forecastData);
				lastDay = day;

				// Stop processing when maxNumberOfDays is reached
				if (this.forecastDaily.length === this.config.maxNumberOfDays) {
					break;
				}
			} else {
				forecastData.maxTemp = forecast.temp.max > parseFloat(forecastData.maxTemp) ? this.roundValue(forecast.temp.max) : forecastData.maxTemp;
				forecastData.minTemp = forecast.temp.min < parseFloat(forecastData.minTemp) ? this.roundValue(forecast.temp.min) : forecastData.minTemp;

				// Since we don't want an icon from the start of the day (in the middle of the night)
				// we update the icon as long as it's somewhere during the day.
				if (hour > dayStarts && hour < dayEnds) {
					forecastData.icon = this.config.iconTable[forecast.weather[0].icon];
				}
			}
		}

		this.DomUpdate(this.config.initialLoadDelay);
	},

	processHourly: function (data) {
		if (!data || !data.hourly || typeof data.hourly[0] === "undefined") {
			return Log.error("NO HOURLY FORECAST DATA");
		}

		this.forecastHourly = [];
		var lastHour = null;
		var forecastData = {};
		var hourStarts = 7;
		var hourEnds = 18;

		// Handle different structs between onecall endpoints
		var forecastList = null;
		if (data.hourly) {
			forecastList = data.hourly;
		} else {
			Log.error("Unexpected forecast data");
			return undefined;
		}

		for (var i = 1, count = forecastList.length; i < count; i++) {
			var forecast = forecastList[i];

			var hour;
			if (forecast.dt_txt) {
				hour = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format(this.config.hourly);
			} else {
				hour = moment.unix(forecast.dt).format(this.config.hourly);
			}

			if (hour !== lastHour) {
				forecastData = {
					hour: hour,
					icon: this.config.iconTable[forecast.weather[0].icon],
					rain: this.processRain(forecast, forecastList, moment),
					snow: this.processSnow(forecast, forecastList, moment),
					humidity: forecast.humidity,
					pressure: forecast.pressure,
					hourTemp: this.roundValue(forecast.temp),
					precip: this.roundValue(forecast.pop),
					realFeels: this.roundValue(forecast.feels_like),
					dewPoint: this.roundValue(forecast.dew_point),
					uvIndex: forecast.uvi,
					visibility: forecast.visibility,
				};

				this.forecastHourly.push(forecastData);
				lastHour = hour;

				// Stop processing when maxNumberOfHours is reached
				if (this.forecastHourly.length === this.config.maxNumberOfHours) {
					break;
				}
			} else {
				// Since we don't want an icon from the start of the day (in the middle of the night)
				// we update the icon as long as it's somewhere during the day.
				if (hour > hourStarts && hour < hourEnds) {
					forecastData.icon = this.config.iconTable[forecast.weather[0].icon];
				}
			}
		}

		this.DomUpdate(this.config.initialLoadDelay);
	},
	
	DomUpdate: function () {
		if (!this.loaded) { 
			this.loaded = true;
			var self = this;
			setTimeout(function () {
				var empty = "";
				self.show(self.config.animationSpeed, empty, { lockString: self.identifier });
			}, this.config.initialLoadDelay);
		}
		this.updateDom(this.config.animationSpeed);
		this.sendSocketNotification('START_DHT_READING', { gpioPin: this.config.gpioPin });
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 */
	scheduleUpdate: function () {
		var now = moment().format("HH:mm:ss");
		var updateInterval = null;

		if (now >= "00:00:00" && now < "07:00:00") {
			updateInterval = this.config.nightUpdateInterval;
		} else {
			updateInterval = this.config.dayUpdateInterval;
		}

		var self = this;
		setInterval(function () {
			self.OneUpdate();
			if (self.config.pollutionOneLoader) {
				setTimeout(function () {
					self.AirUpdate();
				}, self.config.initialLoadDelay);
			}
		}, updateInterval);
	},

	/* ms2Beaufort(ms)
	 * Converts m2 to beaufort (windspeed).
	 *
	 * see:
	 *  https://www.spc.noaa.gov/faq/tornado/beaufort.html
	 *  https://en.wikipedia.org/wiki/Beaufort_scale#Modern_scale
	 *
	 * argument ms number - Windspeed in m/s.
	 *
	 * return number - Windspeed in beaufort.
	 */
	ms2Beaufort: function (ms) {
		var kmh = (ms * 60 * 60) / 1000;
		var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
		for (var beaufort in speeds) {
			var speed = speeds[beaufort];
			if (speed > kmh) {
				return beaufort;
			}
		}
		return 12;
	},

	deg2Cardinal: function (deg) {
		if (deg > 11.25 && deg <= 33.75) {
			return "NNE";
		} else if (deg > 33.75 && deg <= 56.25) {
			return "NE";
		} else if (deg > 56.25 && deg <= 78.75) {
			return "ENE";
		} else if (deg > 78.75 && deg <= 101.25) {
			return "E";
		} else if (deg > 101.25 && deg <= 123.75) {
			return "ESE";
		} else if (deg > 123.75 && deg <= 146.25) {
			return "SE";
		} else if (deg > 146.25 && deg <= 168.75) {
			return "SSE";
		} else if (deg > 168.75 && deg <= 191.25) {
			return "S";
		} else if (deg > 191.25 && deg <= 213.75) {
			return "SSW";
		} else if (deg > 213.75 && deg <= 236.25) {
			return "SW";
		} else if (deg > 236.25 && deg <= 258.75) {
			return "WSW";
		} else if (deg > 258.75 && deg <= 281.25) {
			return "W";
		} else if (deg > 281.25 && deg <= 303.75) {
			return "WNW";
		} else if (deg > 303.75 && deg <= 326.25) {
			return "NW";
		} else if (deg > 326.25 && deg <= 348.75) {
			return "NNW";
		} else {
			return "N";
		}
	},

	/* function(temperature)
	 * Rounds a temperature to 1 decimal or integer (depending on config.roundTemp).
	 *
	 * argument temperature number - Temperature.
	 *
	 * return string - Rounded Temperature.
	 */
	roundValue: function (temperature) {
		var decimals = this.config.roundTemp ? 0 : 1;
		var roundValue = parseFloat(temperature).toFixed(decimals);
		return roundValue === "-0" ? 0 : roundValue;
	},

	/* processRain(forecast, allForecasts)
	 * Calculates the amount of rain for a whole day even if long term forecasts isn't available for the appId.
	 *
	 * When using the the fallback endpoint forecasts are provided in 3h intervals and the rain-property is an object instead of number.
	 * That object has a property "3h" which contains the amount of rain since the previous forecast in the list.
	 * This code finds all forecasts that is for the same day and sums the amount of rain and returns that.
	 */
	processRain: function (forecast, allForecasts) {
		// If the amount of rain actually is a number, return it
		if (this.config.endpointType === "hourly" && this.config.endpointType === "onecall") {
			if (!isNaN(forecast.rain) && !isNaN(forecast.rain["1h"])) {
				return forecast.rain;
			}
		} else {
			if (!isNaN(forecast.rain)) {
				return forecast.rain;
			}
		}

		// Find all forecasts that is for the same day
		var checkDateTime = forecast.dt_txt ? moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment.unix(forecast.dt);
		var daysForecasts = allForecasts.filter(function (item) {
			var itemDateTime = item.dt_txt ? moment(item.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment.unix(item.dt);
			return itemDateTime.isSame(checkDateTime, "day") && item.rain instanceof Object;
		});

		// If no rain this day return undefined so it wont be displayed for this day
		if (daysForecasts.length === 0) {
			return undefined;
		}

		// Summarize all the rain from the matching days
		return daysForecasts
			.map(function (item) {
				return Object.values(item.rain)[0];
			})
			.reduce(function (a, b) {
				return a + b;
			}, 0);
	},

	processSnow: function (forecast, allForecasts) {
		// If the amount of snow actually is a number, return it
		if (this.config.endpointType === "hourly" && this.config.endpointType === "onecall") {
			if (!isNaN(forecast.snow) && !isNaN(forecast.snow["1h"])) {
				return forecast.snow;
			}
		} else {
			if (!isNaN(forecast.snow)) {
				return forecast.snow;
			}
		}

		// Find all forecasts that is for the same day
		var checkDateTime = forecast.dt_txt ? moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment.unix(forecast.dt);
		var daysForecasts = allForecasts.filter(function (item) {
			var itemDateTime = item.dt_txt ? moment(item.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment.unix(item.dt);
			return itemDateTime.isSame(checkDateTime, "day") && item.snow instanceof Object;
		});

		// If no snow this day return undefined so it wont be displayed for this day
		if (daysForecasts.length === 0) {
			return undefined;
		}

		// Summarize all the snow from the matching days
		return daysForecasts
			.map(function (item) {
				return Object.values(item.snow)[0];
			})
			.reduce(function (a, b) {
				return a + b;
			}, 0);
	}
});
const errorLabel = document.querySelector("label[for='error-msg']");
const airQuality = document.querySelector(".air-quality");
const airQualityStat = document.querySelector(".air-quality-status");
const srchBtn = document.querySelector(".search-btn");
const componentsEle = document.querySelectorAll(".component-val");

const appId = "fbed2b2691f322df242cdf3f5f30f3ff"; // Your OpenWeatherMap API key
const geoApiLink = "http://api.openweathermap.org/geo/1.0/direct"; // Geocoding API endpoint
const airQualityApiLink =
	"https://api.openweathermap.org/data/2.5/air_pollution"; // Air Pollution API endpoint

let latInp, lonInp;

// Function to get latitude and longitude from city and state names
const getCoordinatesFromCityState = async (city, state) => {
	const apiUrl = `${geoApiLink}?q=${city},${state}&limit=1&appid=${appId}`;
	const response = await fetch(apiUrl);
	const data = await response.json();
	if (data.length > 0) {
		return { lat: data[0].lat, lon: data[0].lon };
	} else {
		throw new Error("Location not found.");
	}
};

// Function to get air quality data
const getAirQuality = async (lat, lon) => {
	const rawData = await fetch(
		`${airQualityApiLink}?lat=${lat}&lon=${lon}&appid=${appId}`
	).catch((err) => {
		onPositionGatherError({
			message: "Something went wrong. Check your internet connection.",
		});
		console.log(err);
	});
	const airData = await rawData.json();
	setValuesOfAir(airData);
	setComponentsOfAir(airData);
};

// Function to set air quality index and status
const setValuesOfAir = (airData) => {
	const aqi = airData.list[0].main.aqi;
	let airStat = "",
		color = "";

	// Set Air Quality Index
	airQuality.innerText = aqi;

	// Set status of air quality
	switch (aqi) {
		case 1:
			airStat = "Good";
			color = "rgb(19, 201, 28)";
			break;
		case 2:
			airStat = "Fair";
			color = "rgb(15, 134, 25)";
			break;
		case 3:
			airStat = "Moderate";
			color = "rgb(201, 204, 13)";
			break;
		case 4:
			airStat = "Poor";
			color = "rgb(204, 83, 13)";
			break;
		case 5:
			airStat = "Very Poor";
			color = "rgb(204, 13, 13)";
			break;
		default:
			airStat = "Unknown";
	}

	airQualityStat.innerText = airStat;
	airQualityStat.style.color = color;
};

// Function to set pollutant components
const setComponentsOfAir = (airData) => {
	let components = { ...airData.list[0].components };
	componentsEle.forEach((ele) => {
		const attr = ele.getAttribute("data-comp");
		ele.innerText = components[attr] += " μg/m³";
	});
};

// Function to handle errors
const onPositionGatherError = (e) => {
	errorLabel.innerText = e.message;
};

// Event listener for the search button
srchBtn.addEventListener("click", async () => {
	try {
		const city = document.getElementById("city").value;
		const state = document.getElementById("state").value;
		const { lat, lon } = await getCoordinatesFromCityState(city, state);
		getAirQuality(lat, lon);
	} catch (error) {
		onPositionGatherError({ message: error.message });
	}
});

document.querySelector(".search-btn").addEventListener("click", function(event){
	var table = document.getElementById("airComponentTable");
	
		table.style.display = "contents";
	
});

  
  




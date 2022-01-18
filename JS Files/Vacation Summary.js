// Retrieving the data from the current vacation instance so it could be added.
currentVacationInstance = retrieveLSData("vacationinstance");

/* Filling up the data which are not there in the class instance explicitly. */
let numOfStops = currentVacationInstance._locations.length -1;

// Retrieving the journey distance from local storage.
let journeyDistance = `${currentVacationInstance._distance.toFixed(2)} km`;
let startLocation = "";

// Setting the vehicle range using if conditions to determine the type of vehicle used.
let range;
if (currentVacationInstance._vehicle == "Sedan")
{
  range = 1000;
}
else if (currentVacationInstance._vehicle == "SUV")
{
  range = 850;
}
else if (currentVacationInstance._vehicle == "Van")
{
  range = 600;
}
else if (currentVacationInstance._vehicle == "Minibus")
{
  range = 450;
}

/* Reverse Geocoding the 1st location in the array of locations to get its details */
sendWebServiceRequestForReverseGeocoding(currentVacationInstance._locations[0][1],currentVacationInstance._locations[0][0],"getfirstLocationData");

// References to the table data.
let vacationNameRef = document.getElementById("name");
let dateRef = document.getElementById("date");
let timeRef = document.getElementById("time");
let vehicleRef = document.getElementById("vehicle");
let rangeRef = document.getElementById("range");
let distanceRef = document.getElementById("distance");
let numOfStopsRef = document.getElementById("stops");

// Setting the data.
vacationNameRef.innerHTML = `${currentVacationInstance._name}`;
dateRef.innerHTML = `<b>Date:</b> ${currentVacationInstance._date}`;
timeRef.innerHTML = `<b>Time:</b> ${currentVacationInstance._time}`;
vehicleRef.innerHTML = `<b>Vehicle:</b> ${currentVacationInstance._vehicle}`;
rangeRef.innerHTML = `<b>Vehicle Range:</b> ${range}km`;
distanceRef.innerHTML = `<b>Journey Distance:</b> ${currentVacationInstance._distance.toFixed(2)} km`;
numOfStopsRef.innerHTML = `<b>Number of Stops:</b> ${numOfStops}`;

function list() {
  window.location.assign("Planned Vacation List.html")
}
function newVacation() {
  window.location.assign("Splash Page.html")
}

// Callback for first location.
function getfirstLocationData(data)
{
  startLocation = `${data.results[0].components.city}, ${data.results[0].components.country}`;
  let locationRef = document.getElementById("location");
  locationRef.innerHTML = `<b>Location:</b> ${startLocation}`;
}

// Modifying the map to represent the route
map2.setCenter([currentVacationInstance._locations[0][0],currentVacationInstance._locations[0][1]]);
let locationList = currentVacationInstance._locations;

for(let i=0; i<currentVacationInstance._locations.length; i++)
{
  // Adding back the markers
  const marker = new mapboxgl.Marker()
    .setLngLat(locationList[i])
    .addTo(map2);
}  

function getRoute()
{
  for (let j=0; j<currentVacationInstance._locations.length-1; j++)
  {
    // Get started on the route
    let startLat = locationList[j][1];
    let startLon = locationList[j][0];
    let endLat = locationList[j+1][1];
    let endLon = locationList[j+1][0];

    sendXMLRequestForRoute(startLat,startLon,endLat,endLon,recreateRoute)
    function recreateRoute(json)
    {
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
        
      let routename = j.toString();
      if (!(map2.getSource(routename)))
      {
        map2.addLayer({
          id: routename,
          type:'line',
          source: {
            type: 'geojson',
            data: geojson
          },

          layout: {
            'line-join' : 'round',
            'line-cap':'round'
          },

          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }
    }
  }
}

map2.on('load', () => {
  getRoute();
  });
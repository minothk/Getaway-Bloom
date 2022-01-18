const MAPBOX_KEY = "pk.eyJ1IjoiZGludXNoaXRoYXJ1c2hpa2EiLCJhIjoiY2t4MDYxejF1MTI0cDJ2bW52dGF5N2w1ZyJ9.sf5I55RE8VJzQbzIx2kdcw";
const OPENCAGE_KEY = "4864d4dab615475e8c174d47bfffa5a0";
const APP_DATA = "eng1003A2-21S2-Data";
// Any other local storage keys should be defined after this line

//-------------------------------------------------------------------------------

// Create  a plan page
const StartingMarker = new mapboxgl
				.Marker({ 
						color: "red",
						draggable: true})
				.setPopup(new mapboxgl.Popup().setHTML(`<p>Your Starting Location</p>`));
				
function onDragEnd()
{
	const lngLat = StartingMarker.getLngLat();
}
StartingMarker.on('dragend', onDragEnd);
	
	
function panToCurrentLocation(lat,lng)
{   
    map.flyTo({center: [lng, lat], zoom: 13.5});
	StartingMarker.setLngLat([lng,lat]);
	StartingMarker.addTo(map);
}


function search()
{   
	let searchedLocation = document.getElementById("geolocate").value 
	sendWebServiceRequestForForwardGeocoding(`${searchedLocation}`,"forwardGeocodingDataAcessing")
}


function forwardGeocodingDataAcessing(data)
{	
	console.log(data)
	let startLocationName = data.results[0].formatted
	let startLng = data.results[0].geometry.lng
	let startLat = data.results[0].geometry.lat
	StartingMarker.setLngLat([startLng,startLat]);
	StartingMarker.addTo(map)
	map.panTo([startLng,startLat])
	document.getElementById("geolocate").value =""
}

// Function to add the starting location in the locations array.
function confirmStartingLocation(){
    let startingLocation = StartingMarker.getLngLat();
    updateLSData("startlocation",startingLocation);
}

// Global array to have each locations' coordinates.
let locations = [];

//-----------------------------------------------------------------------------

// Class
class Vacation{
    constructor(name="",locations=[],vehicle="",date="",time="", distance="")
    {
        this._name = name;
        this._locations = locations;
        this._vehicle = vehicle;
        this._date = date;
        this._time = time;
        this._distance = distance;
    }

    // Accessors
    get name() {return this._name;} 
    get locations() {return this._locations;}
    get vehicle() {return this._vehicle;}
    get date() {return this._date;} 
    get time() {return this._time;}
    get distance() {return this._distance;}
    
    // Methods 

    /*
     * addLocation method
     * Used to push a POI/location into the locations array.
     * @param {location} is an object that provides the data about the location.
    */
    addLocation(location)
    {
        this._locations.push(location);
    }
}

//---------------------------------------------------------------------------------

// Plan a Vacation Page
function confirmRoute()
{
    // Retrieve from local storage and update the location property for the instance.
    let currentVacationInstance = retrieveLSData("vacationinstance");
    currentVacationInstance._locations = locations;
    updateLSData("vacationinstance",currentVacationInstance);

    // Update the local storage with the total distance
    currentVacationInstance._distance = totalDistance;
    updateLSData("vacationinstance",currentVacationInstance);

    window.location.assign("Schedule.html");
}
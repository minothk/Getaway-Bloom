// Functions to show nearest POIs based on the center of the map when the user clicks the button chips
function nearestGas()
{
    let center = map.getCenter();
    sendXMLRequestForPlaces("gas station",center.lng,center.lat,successCallback);
}

function nearestAttractions()
{
    let center = map.getCenter();
    sendXMLRequestForPlaces("attraction",center.lng,center.lat,successCallback);
}

function nearestLodgings()
{
    let center = map.getCenter();
    sendXMLRequestForPlaces("lodging",center.lng,center.lat,successCallback);
}

function nearestRestaurants()
{
    let center = map.getCenter();
    sendXMLRequestForPlaces("food",center.lng,center.lat,successCallback);
}
/*---------------------------------------------------------------------------------------------------*/

// Callback function to generate the POIs on the map
function successCallback(data)
{
    for (let i=0; i<data.features.length; i++)
    {
        // Adding the marker and popup for POIs
        let coordinates = [data.features[i].center[0],data.features[i].center[1]];

        // Customising the marker
        let customMarker = document.createElement('div');
        
        // Identifying the type of marker image to be selected.
        if (data.features[i].properties.category != "")
        {

            // Custom marker for gas station (no need to configure as all phrases in category has these keywords)
            if (data.features[i].properties.category == "gas station, fuel, gas")
            {
                customMarker.className = 'gas';
            }

            // Custom marker for attractions (had to be configured for the keyword 'attraction')
            if (data.features[i].properties.category != "")
            {
                let text = data.features[i].properties.category;
                
                // Search for keyword 'attraction' in the text.
                let exists = text.search(/attraction/i);
                    if (exists != -1)
                    {
                        customMarker.className = 'attraction';
                    }
            }

            // Custom marker for lodgings (had to be configured for the keyword 'lodging')
            if (data.features[i].properties.category != "")
            {
                let text = data.features[i].properties.category;
                
                // Search for keyword 'attraction' in the text.
                let exists = text.search(/lodging/i);
                    if (exists != -1)
                    {
                        customMarker.className = 'lodging';
                    }
            }

            // Custom marker for restaurants (had to be configured for the keyword 'food')
            if (data.features[i].properties.category != "")
            {
                let text = data.features[i].properties.category;
                
                // Search for keyword 'attraction' in the text.
                let exists = text.search(/food/i);
                    if (exists != -1)
                    {
                        customMarker.className = 'restaurants';
                    }
            }
        }
        
        // Generating the marker on mapbox and adding it to the map.
        new mapboxgl.Marker(customMarker)
        .setLngLat([coordinates[0], coordinates[1]])
        .setPopup(new mapboxgl.Popup()
            .setHTML(
            `<span>${data.features[i].place_name.substring(0,data.features[i].place_name.indexOf(","))}</span><br>`
             )
            .addTo(map))
        .addTo(map);
    }
}

// Getting the range for each vehicle using local storage.
let originalRange;
let range;

let vacationData = retrieveLSData("vacationinstance");
if (vacationData._vehicle == "Sedan")
{
    originalRange = 1000;
    range = originalRange;
}
else if (vacationData._vehicle == "SUV")
{
    originalRange = 850;
    range = originalRange;
}
else if (vacationData._vehicle == "Van")
{
    originalRange = 600;
    range = originalRange;
}
else if (vacationData._vehicle == "Minibus")
{
    originalRange = 450;
    range = originalRange;
}
else 
{
    alert ("Error in reading the vehicle data");
}

// Adding points to the map when they click it.
map.on('click', (e) => {
    let lat = e.lngLat.lat;
    let lng = e.lngLat.lng;
    let coords = [lng,lat];
	sendWebServiceRequestForReverseGeocoding(lat,lng,"changeRange");
	
	if (range < totalDistance) 
	{
		alert("Insufficient vehicle range! Please refuel or finalize your route")
	}
	else 
	{
		locations.push(coords);

		// Creates a new marker as a visual cue.
		const marker = new mapboxgl.Marker()
		 .setLngLat([lng, lat])
		 .addTo(map);
		map.flyTo({center: [lng, lat], zoom: 13.5});
		showpath();
		
		// Calling to show the POIs around the centred location
		sendXMLRequestForPlaces("gas station",lng,lat,successCallback);
		sendXMLRequestForPlaces("attraction",lng,lat,successCallback);
		sendXMLRequestForPlaces("lodging",lng,lat,successCallback);
		sendXMLRequestForPlaces("food",lng,lat,successCallback);
	}
});

function changeRange(data)
{
	console.log(data);
	let type = data.results[0].components._type;
	console.log(type);
    if (type.localeCompare("fuel") == 0)
	{
		range += originalRange;
	} 
}

let totalDistance = 0;

//Function that runs when the route is asked to be made 
function showpath(){
	let routeDetailsRef = document.getElementById('routeDetails')
	routeDetailsRef.innerHTML  = ""
	
	for (let i =0; i < locations.length -1; i++)
	{
		startLat = locations[i][1];
		startLon = locations[i][0];
		endLat = locations[i+1][1];
		endLon = locations[i+1][0];
		
		sendXMLRequestForRoute(startLat,startLon,endLat,endLon,directionsCallback)
		function directionsCallback(json){
			
			// Displaying route length
			let distance = (json.routes[0].distance)/1000;
			totalDistance += distance;
			document.getElementById('tripLength').innerHTML = `Travel Distance : ${totalDistance.toFixed(2)}km`
			routeDetailsRef.innerHTML  += `Leg ${i+1} : ${distance.toFixed(2)} km <br>`
            
            // Diplaying the directions for the route.
			const data = json.routes[0];
			const route = data.geometry.coordinates;
			const geojson = {
			    type: 'Feature',
			    properties: {},
			    geometry: {
			    type: 'LineString',
			    coordinates: route}
			    };

            let routename = i.toString();
            if (!(map.getSource(routename)))
            {
                map.addLayer({
                    id: routename,
                    type: 'line',
                    source: {
                    type: 'geojson',
                    data: geojson
                    },

                    layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                    },

                    paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                    }
                });
            }
		}
	}
}

// POI search
function poiSearch()
{
    let retrievedLocation = document.getElementById("POIsearch").value;
    sendWebServiceRequestForForwardGeocoding(`${retrievedLocation}`,"poiSearchCallback")
}

// POI search callback
function poiSearchCallback(data)
{
    // Get coordinates and fly to that location
    let lng = data.results[0].geometry.lng;
	let lat = data.results[0].geometry.lat;
    map.flyTo({center: [lng, lat], zoom: 13.5});
    
    // Invoke the functions to show POIs around this location
    sendXMLRequestForPlaces("gas station",lng,lat,successCallback);
    sendXMLRequestForPlaces("attraction",lng,lat,successCallback);
    sendXMLRequestForPlaces("lodging",lng,lat,successCallback);
    sendXMLRequestForPlaces("food",lng,lat,successCallback);

    // Reset the search box 
    document.getElementById("POIsearch").value = "";
}

// Function that runs when the 'delete last' button is clicked (ongoing)
function deleteLastAdded()
{
    // Approach: Remove all and then regenerate without the last one.
    
    /* Saving the other co-ordinates */
    let temporaryLocationArray = locations.splice(-1,1);

    // Delete all the layers and markers
    let numOfLocations = locations.length;
    for(i=0; i<numOfLocations; i++)
    {
        let layerID = i.toString();
        map.removeLayer(layerID);
    }

    // Regenerate the route without the last point.
    for(j=0; j<temporaryLocationArray; j++)
    {
        sendXMLRequestForRoute(temporaryLocationArray[j][j+1],temporaryLocationArray[j][j+0],temporaryLocationArray[j+1][j+1],temporaryLocationArray[j+1][j+0],directionsCallback);
    }   
}

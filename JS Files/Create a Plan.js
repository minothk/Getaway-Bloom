// Global array to add the co-ordinates to which the route should form for 
let currentVacationInstance = new Vacation();

function next() {
    let check = StartingMarker.getLngLat();
    if(check == undefined)
    {
        alert("Please add a starting location to continue");
        return;
    }
    let lng = StartingMarker.getLngLat().lng;
    let lat = StartingMarker.getLngLat().lat;
    let startingLocation = [lng,lat];
    
    locations.push(startingLocation);
    currentVacationInstance.addLocation(startingLocation);

    updateLSData("startinglocation", startingLocation);
    updateLSData("vacationinstance", currentVacationInstance);

    window.location.assign("Vehicle Selection.html")
}

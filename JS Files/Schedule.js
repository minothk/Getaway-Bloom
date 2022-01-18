currentVacationInstance = retrieveLSData("vacationinstance");
let all_vacations = [];

if (checkLSData("all_vacation_instances")) {
        all_vacations = retrieveLSData("all_vacation_instances")
}

function save() {

        currentVacationInstance._name = document.getElementById("vacation_name").value;
        currentVacationInstance._time = document.getElementById("timeInput").value;
        currentVacationInstance._date = document.getElementById("dateInput").value;
        

        all_vacations.push(currentVacationInstance);

        updateLSData("vacationinstance", currentVacationInstance);
        updateLSData("all_vacation_instances", all_vacations);      
        window.location.assign("Vacation Summary.html")
}

function cancel(){
        window.location.assign("Splash Page.html")
}


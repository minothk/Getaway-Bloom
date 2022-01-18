currentVacationInstance = retrieveLSData("vacationinstance")

function back() {
  window.location.assign("Create a Plan.html");
}
function next() {
  
  let options = document.getElementsByName("options");
  
  for (i = 0; i < options.length; i++) {
    if (options[i].checked) {
        currentVacationInstance._vehicle = options[i].value;        
    }
  }
  
  updateLSData("vacationinstance", currentVacationInstance);
  console.log(currentVacationInstance)
  window.location.assign("Plan a Vacation.html");
}

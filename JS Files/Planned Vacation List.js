let allVacations = retrieveLSData("all_vacation_instances");
let vacationList = document.getElementById("vacationList");
let listItems = "";

for (let i = 0; i < allVacations.length; i++) {
      
    listItems = `
    <li class="mdl-list__item">
    <a href="Vacation Summary.html" id="${i}" class="mdl-list__item-primary-content">${allVacations[i]._name}</a>
    </li>`
    + listItems;
}

vacationList.innerHTML = listItems;

for (let j = 0; j < allVacations.length; j++) {
    document.getElementById(`${j}`).addEventListener("click", setCurrentVacation);
}

function setCurrentVacation(e) { 
    let selectedVacationIndex = e.target.id;
    console.log(selectedVacationIndex);
    updateLSData("vacationinstance", allVacations[selectedVacationIndex])
}

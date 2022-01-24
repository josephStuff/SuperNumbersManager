const events = [
  {
    id: 1,
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    id: 2,
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    id: 3,
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    id: 4,
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    id: 5,
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    id: 6,
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    id: 7,
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    id: 8,
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    id: 9,
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

// -----  BUILDS A LIST OF DISTINCT CITIES FOR YOUR DROP DOWN ----------

function buildDropDown() {
  //  --------- GRAB THE EVENT DROP DOWN WE WANT TO ADD CITIES TO --------
  let eventDD = document.getElementById("eventDropDown");
  eventDD.innerHTML = "";

  // --------- LOAD OUR LINKS FROM A TEMPLATE ----------
  let ddTemplate = document.getElementById("cityDD-template");

  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;

  //  ---------- MAP THE CITY PROPERTY TO A NEW ARRAY ------------- -----
  let cities = curEvents.map((e) => e.city);

  // --------------- RETURN A LIST OF DISTINCT CITIES -------------
  let distinctCities = [...new Set(cities)];

  //  --------------  USE THE DROP DOWN TEMPLATE -----------------------
  let ddItemTemplate = document.importNode(ddTemplate.content, true);
  let li = ddItemTemplate.querySelector("li");
  let ddItem = ddItemTemplate.querySelector("a");
  ddItem.setAttribute("data-city", "All");
  ddItem.innerHTML = "All";
  eventDD.appendChild(li);

  for (let index = 0; index < distinctCities.length; index++) {
    
    ddItemTemplate = document.importNode(ddTemplate.content, true);
    li = ddItemTemplate.querySelector("li");
    ddItem = li.querySelector("a");
    ddItem.setAttribute("data-city", distinctCities[index]);
    ddItem.innerHTML = distinctCities[index];
    eventDD.appendChild(li);
  
  }

    displayStats(curEvents);
    displayData();

}


// ------ DISPLAY THE STATS ---------------------------

function displayStats(filteredEvents) {

    let total = 0;
    let average = 0;
    let most = 0;
    let least = -1;
    let currentAttendance = 0;

    for (let index = 0; index < filteredEvents.length; index++) {
        currentAttendance = filteredEvents[index].attendance;
        total += currentAttendance;

        if (most < currentAttendance) {
            most = currentAttendance;
        }

        if (least == -1 || least > currentAttendance ) {
          least = currentAttendance;
        }

        
    }

    average = total / filteredEvents.length;
  
  document.getElementById("total").innerHTML = total.toLocaleString();
  document.getElementById("least").innerHTML = least.toLocaleString();
  document.getElementById("most").innerHTML = most.toLocaleString();
  document.getElementById("average").innerHTML = average.toLocaleString(
    "en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }

  );

}

// ----------------SHOW THE EVENTS FOR SPECIFIC LOCATION.-----------------
// -----------------THE USER SELECTED A CITY AND THIS FIRES -----------------
function getEvents (element) {

  let city = element.getAttribute("data-city");
  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;

  let filteredEvents = curEvents;
  
  // ---------FILTER THE EVENTS BASED SELECTED CITY ---------------
  if (city != "All") {
    filteredEvents = curEvents.filter(function(event) {
      if(event.city == city) {
        return event;
      }
    })
  }

  document.getElementById("statsHeader").innerHTML = `Stats For ${city} Events`;

  // ----------------DISPLAY STATS FOR THE SELECTED CITY ------------------

  displayStats(filteredEvents);

}


//  ----------------------DISPLAY ALL THE EVENTS ON THE PAGE ------------
function displayData () {

  let template = document.getElementById("eventData-template");

  let eventBody = document.getElementById("eventBody");

  // ---------------- CLEAR THE TABLE FIRST ------------------
  eventBody.innerHTML = "";

  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || [];


  // ------------------IF NOTHING IS THERE, SET LOCAL STORAGE WITH THE DEFAULT DATA -----------
  if (curEvents.length == 0) {
      curEvents = events;
      localStorage.setItem("eventsArray", JSON.stringify(curEvents));
  }

  for (let index = 0; index < curEvents.length; index++) {
    let eventRow = document.importNode(template.content, true);
    let eventCols = eventRow.querySelectorAll("td");

    eventCols[0].textContent = curEvents[index].event;
    eventCols[1].textContent = curEvents[index].city;
    eventCols[2].textContent = curEvents[index].state;
    eventCols[3].textContent = curEvents[index].attendance;
    eventCols[4].textContent = curEvents[index] = new Date(
      curEvents[index].date).toLocaleDateString();
    

    eventBody.appendChild(eventRow);

  }

}

function saveData () {

  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;
  
  let obj = {};

  obj["event"] = document.getElementById("newEventName").value;
  obj["city"] = document.getElementById("newEventCity").value;
  let stateSelect = document.getElementById("newEventState");
  obj["state"] = stateSelect.options[stateSelect.selectedIndex].text;
  obj["attendance"] = parseInt(document.getElementById("newEventAttendance").value, 10);
  let eventDate = document.getElementById("newEventDate").value;
  let eventDate2 = `${eventDate} 00:00`;
  obj["date"] = new Date(eventDate2).toLocaleString();

  curEvents.push(obj);

  localStorage.setItem("eventsArray", JSON.stringify(curEvents));

  buildDropDown();
  displayData();

}
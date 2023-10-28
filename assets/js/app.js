/**
 * const racedata: {
 *    carNumber: any;
 *    name: string;
 *    laps: number[];}
 */
const racedata = fetchFormula1Data();

// set variables to collect data from DOM
const addButton = document.getElementById('submit');

/**
 * Initializes the app. This function is called when the page is fully loaded
 * (the window load event).
 */
function init() {
  racedata.forEach(createDrivers);
  racedata.forEach(createSelect);
  displayFastest();
  addButton.addEventListener('click', updateLaptime);
}
window.addEventListener('load', init);

/**
 * click handler:
 *    add input value to the database 
 *    update the lap time display
 */
function updateLaptime() {
  // retrieve user input
  const inputObject = getUserInput();
  // find the index of the object that has the same carnumber as input
  const newIndex = racedata.findIndex((arr) => arr.carNumber == inputObject.carNumber);
  // push the new laptime into the object
  racedata[newIndex].laps.push(inputObject.lapTime);
  // clear table and create new one
  lapsTbody.innerHTML = '';
  fastestTr.innerHTML = '';
  selectMenu.innerHTML = '';
  init();
}

const lapsTbody = document.getElementById('laps');
/**
 * 1. create table to display drivers and their total lap time
 * <tbody id="laps">
 *  <tr>
 *    <th>Driver</th>
 *    <th>Total</th>
 *  </tr>
 */
function createDrivers(arr) {
  // table row for each driver 
  const lapsTr = document.createElement('tr');
  lapsTbody.appendChild(lapsTr);
  // column 1 for driver's name
  const lapsTh1 = document.createElement('th');
  lapsTr.appendChild(lapsTh1);
  lapsTh1.innerHTML = arr.name;
  // column 2 for driver's total lap time
  const lapsTh2 = document.createElement('th');
  lapsTr.appendChild(lapsTh2);
  lapsTh2.className = 'time';
  const sum = arr.laps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  lapsTh2.innerHTML = timeFormat(sum);
}

/**
 * 3. transfer the laptime into human readable format
 * mm:ss.sss 
 */
function timeFormat(time) {
  const second = time % 60;
  const minute = (time - second) / 60;
  if (minute < 1) {
    return second.toFixed(3);
  } else {
    return `${minute}:${addZero(second.toFixed(3))}`;
  }
}

/**
 * 4. add leading zero for second
 */
function addZero(time) {
  return time = time.toString().padStart(6, '0');
}

/**
 * 5.1 sort an array
 */
function sortArr(arr) {
  return arr.sort((itemA, itemB) => itemA - itemB);
}
/**
 * 5.2 sort an array by time
 */
function sortArrByTime(arr) {
  return arr.sort((itemA, itemB) => itemA.laps - itemB.laps);
}

const fastestArr = [];
/**
 * 5.3 set a new object to collect each driver's property
 * change the laps to the fastest time
 * push them into the array
 */
function createFastestArr() {
  // sort the lap time for each driver
  for (let i = 0; i < racedata.length; i++) {
    sortArr(racedata[i].laps);
  }
  // set an array to collect drivers objects with their fastest laptime 
  for (let i = 0; i < racedata.length; i++) {
    const fastestObject = {};
    fastestObject.name = racedata[i].name;
    fastestObject.carNumber = racedata[i].carNumber;
    fastestObject.laps = racedata[i].laps[0];
    fastestArr.push(fastestObject);
  }
}

const fastestTr = document.getElementById('fastest');
/**
 * 6. display the fastest driver and time
 */
function displayFastest() {
  // sort the new array by time
  createFastestArr();
  sortArrByTime(fastestArr);
  const fastestTh1 = document.createElement("th");
  fastestTh1.innerHTML = fastestArr[0].name;
  const fastestTh2 = document.createElement('th');
  fastestTh2.className = 'time';
  fastestTh2.innerHTML = timeFormat(fastestArr[0].laps);
  fastestTr.appendChild(fastestTh1);
  fastestTr.appendChild(fastestTh2);
}

const selectMenu = document.getElementById('driver');
/**
 * 7. display the select options
 */
function createSelect(arr) {
  const option = document.createElement("option");
  option.innerHTML = arr.name;
  option.value = arr.carNumber;
  selectMenu.appendChild(option);
}

/**
 * Returns an object containing the values of the user input. The object is
 * structured as follows:
 *  - `carNumber` - holds the car number of the driver selected by the user.
 *    this is the `value` attribute of the selected `<option>`.
 *  - `lapTime` - holds the content of the lapTime input converted to a number
 * 
 * @returns an object containing the values of the user input
 */
function getUserInput() {
  return {
    // use `parseInt()` to convert a string into a number
    carNumber: parseInt(document.getElementById('driver').value),
    // use `parseFloat()` to convert a string into a number
    lapTime: parseFloat(document.getElementById('lapTime').value)
  };
}

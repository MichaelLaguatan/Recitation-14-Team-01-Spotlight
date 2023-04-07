const CALENDAR_DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];


// @TO DO: Fill out the values for each field correctly.
// Location and url are intentionally mutually exclusive fields in this scenario.
// If you are adding value for one, you needn't for the other.
const CALENDAR_EVENTS = [
    {
      name: 'Swimming',
      day: 'Monday',
      time: '6:55',
      modality: 'In Person',
      location: 'Boulder CO',
      url: '',
      attendees: 'Owen, John, Sally',
    },
    {
      name: 'Chillin in CCEL office hours',
      day: 'Tuesday',
      time: '2:00',
      modality: 'Remote',
      location: '',
      url: 'https://cuboulder-csci3308.pages.dev/docs/labs/lab5/#b-javascript---scriptjs',
      attendees: 'Owen, Bill, Anistacia',
    },
  ];

let EVENT_MODAL;





// We're sequentially going to fill out the initializeContent() method
function initializeContent() {
    EVENT_MODAL = new bootstrap.Modal(document.getElementById('event-modal'));

    const calendarElement = document.getElementById('calendar');


    // forEach() allows us to perform an action, using a callback function, on each element of an array.
    CALENDAR_DAYS.forEach(day => {
        // Create a bootstrap card for each weekday
        var card = document.createElement('div');
        // We'll add some bootstrap classes to the div to upgrade its appearance
        // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
        (card.className = 'col-sm m-1 bg-white rounded px-1 px-md-2');
    
        // Taking Monday as a sample for a weekday,
        // the below line of code is the equivalent of <div id="monday"> in HTML
        card.id = day.toLowerCase();
    
        // Add the card to the calendar element you fetched in a previous step.
        calendarElement.appendChild(card);
    
        // Create weekday as the title. Here is an example:
        const title = document.createElement('div');
        title.className = 'h6 text-center position-relative py-2';
        title.innerHTML = day;
    
        // Add the title element to the card.
        card.appendChild(title);
    
        // Add a button to the card to create an event
        const addEventIcon = document.createElement('i'); // allows to add icons to the UI
        addEventIcon.className = 
            'bi bi-calendar-plus btn position-absolute translate-middle start-100  rounded p-0 btn-link';
    
        // adding an event listener to the click event of the icon to open the modal
        // the below line of code would be the equivalent of:
        // <i onclick="openEventModal({day: 'monday'})"> in HTML.
        addEventIcon.setAttribute('onclick', `openEventModal({day: '${card.id}'})`);
    
        // add the icon to the title div
        title.appendChild(addEventIcon);
    
        // Add one more div, to the weekday card, which will be populated with events later.
        const body = document.createElement('div');
    
        // We are adding a class for this container to able to call it when we're populating the days
        // with the events
        body.classList.add('event-container');
    
        // Add this div to the weekday card
        card.appendChild(body);
    });

    updateDOM();

} // end of initializeContent()












//updateDOM(); // We will declare and define this in the next step
function updateDOM() {

  const events = CALENDAR_EVENTS;
 
  events.forEach((event, id) => {
    // First, let's try to update the event if it already exists.
 
    // @TODO: Use the `id` parameter to fetch the object if it already exists.
    // Replace <> with the appropriate variable name
    // In templated strings, you can include variables as ${var_name}.
    // For eg: let name = 'John';
    // let msg = `Welcome ${name}`;       (`#event-${id}`)
    let eventElement = document.querySelector(`#event-${id}`);
    
        // if event is undefined, i.e. it doesn't exist in the CALENDAR_EVENTS array, make a new one.
    if (eventElement === null) {
      eventElement = document.createElement('div'); // @TODO: create a new div element. Use document.createElement().
      // Adding classes to the <div> element.
      eventElement.classList = 'event row border rounded m-1 py-1';
      // @TODO: Set the id attribute of the eventElement to be the same as the input id.
      // Replace <> with the correct HTML attribute
      eventElement.id = `event-${id}`;
 
      // Create the element for the Event Name
      const title = document.createElement('div');
      title.classList.add('col', 'event-title');
 
      // @TODO: Append the title element to the event element. Use .append() or .appendChild()
      // with the appropriate parent element.
      eventElement.append(title); 
 
    } else {
      // @TODO: Remove the old element, just in case we are changing the day while updating the event.
      // Use .remove() with the appropriate parent element.
      eventElement.remove();
    }
 
    // Add the Event Name
    const title = eventElement.querySelector('div.event-title');
    title.innerHTML = event.name; // event here is an input parameter to the function
 
    // Add a tooltip with more information on hover
    // @TODO: you will add code here when you are working on for Part B.

    // event.setAttribute('data-bs-toggle', 'tooltip');
    // event.setAttribute('data-bs-title', 'test');
 
    // @TODO: On clicking the event div, it should open the modal with the fields pre-populated.
    // Replace <> with the triggering action.
    eventElement.setAttribute('onclick', `openEventModal({id: ${id}})`);
 
    // Add the event div to the parent
    console.log(event.day);
    document
      .querySelector(`#${event.day.toLowerCase()} .event-container`)
      .appendChild(eventElement);
  });
 
  //updateTooltips(); // Declare the function in the script.js. You will define this function in Part B.
}


function updateTooltips() {
  // @TODO: Display tooltip with the Name, Time and Location of the event.
  // The formatting of the contents of the tooltip is up to your discretion.

//   const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


} 















function updateLocationOptions(value) {
  // @TODO: get the "Location" and "Remote URL" HTML elements from the modal.
  // Use document.querySelector() or document.getElementById().
  const location = document.getElementById('location'); //get the "Location" field
  const remoteUrl = document.getElementById('remote_url') // get the "Remote URL" field

  // Depending on the "value" change the visibility of these fields on the modal.
  // Use conditional statements.
  if(value == 'in-person'){ //specify the condition. replace the <> with a strings
    // document.appendChild(remoteUrl).hidden = true;
    remoteUrl.classList.add("hidden");
    location.classList.remove("hidden");
  }
  else{
    remoteUrl.classList.remove("hidden");
    location.classList.add("hidden");
  }
}











function openEventModal({id, day}) {
  // Since we will be reusing the same modal for both creating and updating events,
  // we're creating variables to reference the title of the modal and the submit button
  // in javascript so we can update the text suitably
  const submitButton = document.querySelector('#submit_button');
  const modalTitle = document.querySelector('.modal-title');

  // Check if the event exists in the CALENDAR_EVENTS by using `id`
  // Note that on the first try, when you attempt to access an event that does not exist
  // an event will be added to the list. This is expected.
  let event = CALENDAR_EVENTS[id];

  // If event is undefined, i.e it does not exist in the CALENDAR_EVENTS, then we create a new event.
  // Else, we load the current event into the modal.
  if (event === undefined) {
    // @TODO: Update the innerHTML for modalTitle and submitButton
    // Replace <> with the correct attribute
    modalTitle.innterHTML = 'Create Event';
    submitButton.innerHTML = 'Create Event';

    // Initializing an empty event
    event = {
      name: '',
      day: day,
      time: '',
      modality: '',
      location: '',
      url: '',
      attendees: '',
    };

    // Allocate a new event id. Note that nothing is inserted into the CALENDAR_EVENTS yet.
    // @TODO: Set the id to be the length of the CALENDAR_EVENTS because we are adding a new element

    id = CALENDAR_EVENTS.length;

    }
    else {
    // We will default to "Update Event" as the text for the title and the submit button
    modalTitle.innerHTML = 'Update Event';
    submitButton.innerHTML = 'Update Event';
  }

  // Once the event is fetched/created, populate the modal.
  // @TODO: Update all form fields of the modal with suitable values from the event.
  // Use document.querySelector() to get the form elements.
  // Hint: If it is a new event, the fields in the modal will be empty.

  document.querySelector('#event_name').value = event.name;
  document.querySelector('#weekday').value = event.day;
  document.querySelector('#time').value = event.time;
  document.querySelector('#modality').value = event.modality;
  document.querySelector('#location').value = event.location;
  document.querySelector('#remote_url').value = event.url;
  document.querySelector('#attendees').value = event.attendees;


  // Location options depend on the event modality
  // @TODO: send modality as a variable, replace <> with appropriate argument
  //updateLocationOptions(document.getElementById('modalilty'));
  updateLocationOptions(event.modality);

  // Set the "action" event for the form to call the updateEventFromModal
  // when the form is submitted by clicking on the "Creat/Update Event" button
  const form = document.querySelector('#event-modal form');
  form.setAttribute('action', `javascript:updateEventFromModal(${id})`);

  EVENT_MODAL.show();
}








// Updates the event for a given id with values taken from the modal.

function updateEventFromModal(id) {
  CALENDAR_EVENTS[id] = {
    name: document.querySelector('#event_name').value,
    // @TODO: Update the json object with values from the remaining fields of the modal
    day: document.querySelector('#weekday').value,
    time: document.querySelector('#time').value,
    modality: document.querySelector('#modality').value,
    location: document.querySelector('#location').value,
    url: document.querySelector('#remote_url').value,
    attendees: document.querySelector('#attendees').value,

  };

  // Update the dom and hide the event modal
  updateDOM();
  EVENT_MODAL.hide();
}








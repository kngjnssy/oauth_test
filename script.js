// Client ID and API key from the Developer Console
// CODE compass edition
var CLIENT_ID = '183857612019-7hr46cble04h91pvglmgecfdpssckm41.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD2Cb8n5HRPmm6TCrxKcyyvMuGpJBZ7Omw';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
}, function(error) {
    appendPre(JSON.stringify(error, null, 2));
});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
} else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */

//////// rendering the events, the original way /////////
//   function appendPre(message) {
//     var pre = document.getElementById('content');
//     var textContent = document.createTextNode(message + '\n');
//     pre.appendChild(textContent);
//   }

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */



function listUpcomingEvents() {
gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 8,
    'orderBy': 'startTime'
}).then(function(response) {
    var events = response.result.items;
    if (events.length > 0) {
        var content = document.querySelector(".main-container")
        content.innerHTML += '<h2> here are the events on your main calendar</h2>'
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) { when = event.start.date; }
            content.innerHTML += '<br><li>' + when + ' ---- ' + event.summary + '</li>'
        }
    } 
    else { 
        content.innerHTML += '<br><p>No upcoming events found.</p>' 
    }

///// LIST OF CALENDARS YOU ARE SIGNED UP FOR OR WHAT //////

    gapi.client.calendar.calendarList.list({
        "maxResults": 10
    }).then(function(response) {
        var calendars = response.result.items;
        if (calendars.length > 0) {
            var calendarContainer = document.querySelector(".calendar-container")
            calendarContainer.innerHTML += '<h2> and here are some of the other calendars... </h2>'

            for (i = 0; i < calendars.length; i++) {
                var calendar = calendars[i];
                var calendarName = calendar.summary;
                calendarContainer.innerHTML += '<br><li>' + calendar.summary + '</li>'
            }
        }
    },
    
    function(err) { console.error("Execute error", err); });

    ///// CODE COMMUNITY EVENTS //////

    gapi.client.calendar.events.list({
        'calendarId': 'code.berlin_crt6693rdcpdrrsjlg7gci4qok@group.calendar.google.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 8,
        'orderBy': 'startTime'
    }).then(function(response) {
        var commEvents = response.result.items;
        if (commEvents.length > 0) {
            var communityContainer = document.querySelector(".community-container")
            communityContainer.innerHTML += '<h2> the CODE Community calendar events </h2>'

            for (i = 0; i < commEvents.length; i++) {
                var commEvent = commEvents[i];
                communityContainer.innerHTML += '<br><li>' + commEvent.start.dateTime + ' ---- ' + commEvent.summary + '</li>'
            }
        }
    },
    
    function(err) { console.error("Execute error", err); });
    

    // PUT ANYTHING NEW BELOW THIS LINE
});
}





// gapi.client.calendar.events.list({
//     'calendarId': 'code.berlin_crt6693rdcpdrrsjlg7gci4qok@group.calendar.google.com',
//     'timeMin': (new Date()).toISOString(),
//     'showDeleted': false,
//     'singleEvents': true,
//     'maxResults': 8,
//     'orderBy': 'startTime'
// }).then(function(response) {
//     var communityEvents = response.result.items;
// //   appendPre('Upcoming events:');

//     if (communityEvents.length > 0) {
//     var communityCalendar = document.querySelector(".community-container")
//     communityCalendar.innerHTML += '<h2> here are the events on your main calendar</h2>'

//     for (i = 0; i < communityEvents.length; i++) {
//         var communityEvent = events[i];
//         var when = communityEvent.start.dateTime;
//         if (!when) {
//             communityEventStart = communityEvent.start.date;
//         }
//     //   appendPre(event.summary + ' (' + when + ')')
//         communityCalendar.innerHTML += '<br><li>' + communityEventStart + ' ---- ' + communityEvents.summary + '</li>'
//     }
//     } else {
//     // appendPre('No upcoming events found.');
//     communityEvents.innerHTML += '<br><p>No upcoming events found.</p>'
//     }
// Global variables
let filters = {};
let map;
let groupMarkers = [];
let groupInfoWindows = [];
let crossroadsNFCoordinates = { lat: 40.440090, lng: -80.196000 };
let crossroadsLogomark = {
    url: 'crossroadslogomark.png',
};
let crossroadsLogomark2 = {
    url: 'crossroadslogomark2.png',
};

// Initial map load
function onLoad() {
    initFilters();
    addCheckboxEventListeners();
    createMap();
    loadGroupsOnMap();
}

// Reset the map & filters
function resetMapFilters() {
    initFilters();
    resetCheckboxes();
    createMap(); // Create the map again on reset because it resets the zoom and center
    loadGroupsOnMap();
}

function createMap() {
    map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: crossroadsNFCoordinates, streetViewControl: false, fullscreenControl: false, mapTypeControl: false });
    // Add church marker (center)
    let marker = new google.maps.Marker({ position: crossroadsNFCoordinates, map: map, icon: crossroadsLogomark2 });
}

function initFilters() {
    filters = {
        typeMens: true,
        typeWomens: true,
        typeMixed: true,
        age20s: true,
        age30s: true,
        age40s: true,
        age50s: true,
        age60splus: true,
        daySun: true,
        dayMon: true,
        dayTues: true,
        dayWed: true,
        dayThurs: true,
        dayFri: true,
        daySat: true,
        timeMorning: true,
        timeAfternoon: true,
        timeEvening: true,
        childcare: true,
        noChildcare: true
    };
}

// Load the groups on the map
function loadGroupsOnMap() {
    // For each group
    for (let i = 0; i < groups.length; i++) {

        // Create info windows
        let dayOfWeek = "";
        let timeOfDay = "";
        if (groups[i].filters.dayMon) dayOfWeek = "Monday";
        if (groups[i].filters.dayTues) dayOfWeek = "Tuesday";
        if (groups[i].filters.dayWed) dayOfWeek = "Wednesday";
        if (groups[i].filters.dayThurs) dayOfWeek = "Thursday";
        if (groups[i].filters.dayFri) dayOfWeek = "Friday";
        if (groups[i].filters.daySat) dayOfWeek = "Saturday";
        if (groups[i].filters.timeMorning) timeOfDay = "mornings";
        if (groups[i].filters.timeAfternoon) timeOfDay = "afternoons";
        if (groups[i].filters.timeEvening) timeOfDay = "evenings";
        var contentString = '<div class="groupInfo"><h1>' +
            groups[i].name + '</h1>Leader: ' +
            groups[i].leader + '<br />Neighborhood: ' +
            groups[i].neighborhood + '<br />Meets ' +
            dayOfWeek + ' ' +
            timeOfDay + '<br />Interested? We\'ll text you the details and<br />the leader of the group will reach out to you:<form id="interestform-' +
            i + '">Name: <input type="text" name="name" class="input" /><br />Mobile Phone: <input type="text" name="phone" class="input" /><br />Email: <input type="text" name="email" class="input" /><input type="hidden" name="group" value="' +
            groups[i].name + '" /><br /><input type="submit" name="Submit" value="Submit" /></form></div>';
        groupInfoWindows[i] = new google.maps.InfoWindow({
            content: contentString
        });

        // Add event listener to the interest form to prevent the page from reloading & to submit the interest form
        google.maps.event.addListener(groupInfoWindows[i], 'domready', function() {
            console.log('event listener');
            document.getElementById("interestform-" + i).addEventListener("submit", function(e) {
                var name = document.getElementById("interestform-" + i).elements["name"].value;
                var phone = document.getElementById("interestform-" + i).elements["phone"].value;
                var email = document.getElementById("interestform-" + i).elements["email"].value;
                var group = document.getElementById("interestform-" + i).elements["group"].value;
                submitInterestForm(e, name, phone, email, group);
            });
        });

        // Create markers
        groupMarkers[i] = new google.maps.Marker({ position: { lat: groups[i].lat, lng: groups[i].long }, map: map, icon: crossroadsLogomark });

        // Add click listener to markers to open info windows
        groupMarkers[i].addListener('click', function() {
            groupInfoWindows[i].open(map, groupMarkers[i]);
        });

    }
}

// Update the groups on the map based on filters
function updateGroupsOnMap() {
    // Filter through each group
    groups.filter(function(group, i) {
        // Loop through the group's filters
        for (let currFilter in group.filters) {
            if (group.filters[currFilter]) { // of all the group's "true" filters
                if (!filters[currFilter]) { // if that filter is not on
                    groupMarkers[i].setMap(null); // marker not on map
                    return false;
                }
            }
        }
        // This group passed the filter, put marker on map
        groupMarkers[i].setMap(map);
    });
}

// Attach event listeners to all the checkboxes
function addCheckboxEventListeners() {
    for (let filter in filters) {
        document.getElementById(filter).addEventListener('change', function() {
            if (this.checked) {
                filters[filter] = true;
            } else {
                filters[filter] = false;
            }
            updateGroupsOnMap();
        });
    }
}

// Reset the checkboxes to all checked
function resetCheckboxes() {
    for (var filter in filters) {
        document.getElementById(filter).checked = true;
    }
}

function submitInterestForm(event, name, phone, email, group) {
    event.preventDefault();
    console.log("interest form submitted");
    console.log(name);
    console.log(phone);
    console.log(email);
    console.log(group);
    var request = new XMLHttpRequest();
    var url = "submissions.php";
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var jsonData = JSON.parse(request.response);
            console.log(jsonData);
        }
    };
    var data = JSON.stringify({ "name": name, "email": email, "phone": phone, "group": group });
    request.send(data);
}
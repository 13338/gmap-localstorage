// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array and localStorage.
/* 
  The user can then click an option 
  to create (left click),
  edit (right click),
  delete the markers (double click).
  Show info (hover).
*/
var map;
var markerBounds;
var markers = [];
var localmarkers;
var infowindow;
var icon = {
  'red': 'http://maps.google.com/mapfiles/marker.png',
  'black': 'http://maps.google.com/mapfiles/marker_black.png',
  'grey': 'http://maps.google.com/mapfiles/marker_grey.png',
  'orange': 'http://maps.google.com/mapfiles/marker_orange.png',
  'white': 'http://maps.google.com/mapfiles/marker_white.png',
  'yellow': 'http://maps.google.com/mapfiles/marker_yellow.png',
  'purple': 'http://maps.google.com/mapfiles/marker_purple.png',
  'green': 'http://maps.google.com/mapfiles/marker_green.png',
};

function initMap() {

  infowindow = new google.maps.InfoWindow();

  // Get markers from localstorage
  localmarkers = JSON.parse(localStorage.getItem('map'));
  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
  });
  markerBounds = new google.maps.LatLngBounds();
  // Show all markers
  if (localmarkers != null) {
    for (var i = 0; i <= localmarkers.length - 1; i++) {
      showMarker(localmarkers[i], i);
    }
  } else {
    localmarkers = [];
  }
  // Calc map center
  map.fitBounds(markerBounds);

  // Add some markers if first visit
  firstVisit();

  // This event listener will call createMarker() when the map is clicked.
  map.addListener('click', function(event) {
    createMarker(event.latLng);
  });

}

// Adds a marker to the map and push to the array.
function showMarker(m, id) {
  var marker = new google.maps.Marker({
    position: m['position'],
    icon: m['icon'],
    draggable: true,
    map: map
  });
  markers.push(marker);

  // Add description info
  google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
    return function() {
      // + '<br><a href="#" class="editMarker">Edit</a>'
      infowindow.setContent('<b>Description:</b><br>' + m['description']);
      infowindow.setOptions({maxWidth: 300});
      infowindow.open(map, marker);
    }
  }) (marker, id));

  google.maps.event.addListener(marker, 'dragend', function() {
    geocodePosition(marker.getPosition(), id);
  });

  // This event listener will call editMarker() when the link is right clicked.
  google.maps.event.addListener(marker, 'rightclick', function() {               
    editMarker(marker, id);
  });

  // Add delete listener
  google.maps.event.addListener(marker, 'dblclick', function() {               
    deleteMarker(marker, id);
  });

  // Extend markerBounds with each point.
  markerBounds.extend(m['position']);
}

// Store new marker
function createMarker(location, color = 'red') {

  var localmarker = {
    position: location,
    description: '',
    icon: icon[color]
  }; // default marker
  var testRowIndex = localmarkers.push(localmarker) - 1; // marker id
  showMarker(localmarker, testRowIndex); // show on map

  try {
    localStorage.setItem('map', JSON.stringify(localmarkers)); // save in localStorage
  } catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
     alert('QUOTA_EXCEEDED_ERR Limit error! The marker was not saved in localstorage!');
    }
  }
}

// Call edit form
function editMarker(marker, id) {
  modal.style.display = "block";
  marker_id_input.value = id;
  console.log(id);
  // alert(marker.position);
}

// Update marker position
function geocodePosition(pos, id) {
  markers[id].position = pos;
  localmarkers[id].position = pos;
  localStorage.setItem('map', JSON.stringify(localmarkers));
}

function saveMarker(id) {
  
  markers[id].setIcon(icon[color.value]);
  localmarkers[id].icon = icon[color.value];
  
  var description = document.getElementById('description').value;
  markers[id].description = description;
  localmarkers[id].description = description;

  localStorage.setItem('map', JSON.stringify(localmarkers));
}
// Delete a marker from the map and splice from the array.
function deleteMarker(marker, id) {
  if (confirm('Delete?') == true) {
    // marker.setMap(null);
    markers.splice(id, 1);
    localmarkers.splice(id, 1);
    localStorage.setItem('map', JSON.stringify(localmarkers));
    location.reload();
  } else {
    return false;
  }
}

function firstVisit() {
  if (localStorage.getItem('first') === null) {
    alert('Left click create marker\nRight click edit marker\nDouble click delete marker');
    createMarker({lat: 50.485, lng: 30.463}, 'black');
    createMarker({lat: 49.434, lng: 26.974});
    localStorage.setItem('first', false);
  }
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementsByClassName("editMarker");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the input marker id
var marker_id_input = document.getElementById("markerId");

// Get input marker color
var color = document.getElementById('markerColor');

// Get save description and marker color button
var save_button = document.getElementById("saveButton");

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
save_button.onclick = function() {
  saveMarker(marker_id_input.value);
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
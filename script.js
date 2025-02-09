// මැප් එක හදනවා (Leaflet)
var map = L.map('map').setView([7.8731, 80.7718], 8); // ශ්‍රී ලංකාව මැදට වෙන්න පෙන්නනවා

// OpenStreetMap ටයිල් ලේයර් එක ඇඩ් කරනවා
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// මාකර් එකක් හදනවා
var marker = L.marker([7.8731, 80.7718], {draggable: true}).addTo(map); // Default location, draggable

// Function to update both hidden inputs and text boxes
function updateLocation(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
    document.getElementById('latitudeBox').value = lat.toFixed(6); // Display with 6 decimal places
    document.getElementById('longitudeBox').value = lng.toFixed(6);
}

// මාකර් එක drag කරාම අලුත් ඛණ්ඩාංක ගන්නවා
marker.on('dragend', function(event) {
  var markerLatLng = marker.getLatLng();
  updateLocation(markerLatLng.lat, markerLatLng.lng);
  console.log("New Location:", markerLatLng.lat, markerLatLng.lng);
});

// Map එක click කරාම marker එක move කරනවා.
map.on('click', function(event) {
    marker.setLatLng(event.latlng);
    updateLocation(event.latlng.lat, event.latlng.lng);
    console.log("New Location:",  event.latlng.lat, event.latlng.lng);
});



// GPS location ගන්න function එක
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Location එක හම්බුනාම කරන දේ
function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  // මාකර් එක අලුත් location එකට ගෙනියනවා
  marker.setLatLng([lat, lng]);
  // මැප් එක අලුත් location එකට center කරනවා
  map.setView([lat, lng], 15); // Zoom level එක ටිකක් වැඩි කරා

    updateLocation(lat, lng);

  console.log("GPS Location:", lat, lng);
}

// Error එකක් ආවොත් කරන දේ
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

// GPS button එකට event listener එකක් දානවා
document.getElementById("getLocationBtn").addEventListener("click", getLocation);

// ෆෝම් එක සබ්මිට් කරනකොට වෙන දේ
document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var name = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var description = document.getElementById("description").value;
  var phone = document.getElementById("phone").value;
  // Hidden input fields වලින් values ගන්නවා (form eka submit වෙනකොට මේ values තමයි යන්නේ)
  var latitude = document.getElementById('latitude').value;
  var longitude = document.getElementById('longitude').value;

  console.log("නම:", name);
  console.log("ලිපිනය:", address);
  console.log("විස්තරය:", description);
  console.log("දුරකථන අංකය:", phone);
  console.log("ස්ථානය (Lat):", latitude);
  console.log("ස්ථානය (Lng):", longitude);

  alert("දත්ත යවන ලදී!");
});
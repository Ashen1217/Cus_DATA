// script.js

// Base layers for the map
const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const esriSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Initialize the map (Leaflet) - Esri Satellite is the default layer
const map = L.map('map', {
center: [7.8731, 80.7718], // Default center
zoom: 13,                   // Default zoom
layers: [esriSatelliteLayer]    // Default Layer
});

// Base layers object (for the layer control)
const baseMaps = {
  "OpenStreetMap": openStreetMapLayer,
  "Satellite": esriSatelliteLayer
};

// Check if baseMaps has any layers before adding the control.  Important!
if (Object.keys(baseMaps).length > 0) {
L.control.layers(baseMaps).addTo(map);
} else {
console.error("No base layers defined for the layer control.");
}

// Create a draggable marker
const marker = L.marker([7.8731, 80.7718], {draggable: true}).addTo(map);

// Function to update BOTH hidden inputs AND the combined locationInfo text box
function updateLocation(lat, lng) {
  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lng;
  document.getElementById('locationInfo').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`; // Combined format
}

// Update location when the marker is dragged
marker.on('dragend', function(event) {
const markerLatLng = marker.getLatLng();
updateLocation(markerLatLng.lat, markerLatLng.lng);
console.log("New Location:", markerLatLng.lat, markerLatLng.lng);
});

// Update location on map click
map.on('click', function(event) {
  marker.setLatLng(event.latlng);
  updateLocation(event.latlng.lat, event.latlng.lng);
  console.log("New Location:", event.latlng.lat, event.latlng.lng);
});

// Get GPS location (with high accuracy)
function getLocation() {
  const locationStatus = document.getElementById('locationStatus');
  locationStatus.textContent = 'Getting location...';
  locationStatus.classList.remove('text-red-500');
  locationStatus.classList.add('text-green-500');


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError, {
      enableHighAccuracy: true, // Request high accuracy
      timeout: 10000,          // Increased timeout (10 seconds)
      maximumAge: 0             // Don't use cached location
  });
} else {
  locationStatus.textContent = "Geolocation is not supported by this browser.";
  locationStatus.classList.remove('text-green-500');
  locationStatus.classList.add('text-red-500');
}
}

// Handle successful location retrieval
function showPosition(position) {
const lat = position.coords.latitude;
const lng = position.coords.longitude;

marker.setLatLng([lat, lng]); // Update marker position
map.setView([lat, lng], 15);   // Center map on new location and zoom in

updateLocation(lat, lng);      // Update BOTH hidden inputs and the combined text box

document.getElementById('locationStatus').textContent = ''; // Clear status message
console.log("GPS Location:", lat, lng);
}

// Handle location errors (show user-friendly messages)
function showError(error) {
const locationStatus = document.getElementById('locationStatus');
locationStatus.classList.remove('text-green-500');
locationStatus.classList.add('text-red-500');

switch(error.code) {
  case error.PERMISSION_DENIED:
    locationStatus.textContent = "User denied the request for Geolocation.";
    break;
  case error.POSITION_UNAVAILABLE:
    locationStatus.textContent = "Location information is unavailable.";
    break;
  case error.TIMEOUT:
    locationStatus.textContent = "The request to get user location timed out.";
    break;
  case error.UNKNOWN_ERROR:
    locationStatus.textContent = "An unknown error occurred.";
    break;
}
}

// Add event listener to the "Get Location" button
document.getElementById("getLocationBtn").addEventListener("click", getLocation);

// --- Search Functionality (Nominatim) ---

document.getElementById("searchBtn").addEventListener("click", function() {
  const searchText = document.getElementById("searchInput").value;
  if (searchText) {
      searchLocation(searchText);
  } else {
      alert("Please enter a place to search for.");
  }
});

function searchLocation(query) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

   fetch(nominatimUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              marker.setLatLng([lat, lng]);
              map.setView([lat, lng], 15);  //Zoom level
              updateLocation(lat, lng);
          } else {
              alert("No results found for your search query.");
          }
      })
      .catch(error => {
          console.error("Error searching for location:", error);
          alert("Error searching for location. See console for details.");
      });
}

// Form submission handling
document.getElementById("myForm").addEventListener("submit", function(event) {
event.preventDefault(); // Prevent default form submission

// Get form values
const name = document.getElementById("name").value;
const address = document.getElementById("address").value;
const description = document.getElementById("description").value;
const phone = document.getElementById("phone").value;
const latitude = document.getElementById('latitude').value;
const longitude = document.getElementById('longitude').value;

// Log form data to console (for now)
console.log("Name:", name);
console.log("Address:", address);
console.log("Description:", description);
console.log("Phone Number:", phone);
console.log("Latitude:", latitude);
console.log("Longitude:", longitude);

// Display a success message
alert("Data submitted successfully!");
});

// "View on Map" button functionality (opens Google Maps)
document.getElementById("viewOnMapBtn").addEventListener("click", function() {
  // Use the combined locationInfo text box value
  const locationInfo = document.getElementById('locationInfo').value;
  const [latitude, longitude] = locationInfo.split(',').map(s => s.trim());


if (latitude && longitude) {
  const url = "https://www.google.com/maps/search/?api=1&query=" + latitude + "," + longitude;
  window.open(url, '_blank'); // Open in a new tab/window
} else {
  alert("Location not selected!");
}
});

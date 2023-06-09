// Initialize the map.
let geocoder;
let infowindow;
let gMap;
let recentName;
let markers = [];
// let map_icon_green,
//   map_icon_blue,
//   map_icon_red,
//   map_icon_shadow,
//   map_icon_yellow,
//   map_crosshair;

// async function initMarkers() {
//   map_icon_green = await new google.maps.MarkerImage(
//     "http://mysite.com/green_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_blue = await new google.maps.MarkerImage(
//     "http://mysite.com/blue_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_yellow = await new google.maps.MarkerImage(
//     "http://mysite.com/yellow_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_red = await new google.maps.MarkerImage(
//     "http://mysite.com/red_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_shadow = await new google.maps.MarkerImage(
//     "http://mysite.com/shadow.png",
//     new google.maps.Size(28, 20),
//     new google.maps.Point(-6, 0)
//   );

//   map_crosshair = await new google.maps.MarkerImage(
//     "http://mysite.com/cross-hair.gif",
//     new google.maps.Size(17, 17),
//     new google.maps.Point(0, 0)
//   );
// }

async function initMap() {
  // The map, centered at Uluru
  new google.maps.places.Autocomplete(document.getElementById(`location`));

  gMap = await new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: {
      lat: 40.72,
      lng: -73.96,
    },
  });

  gecoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        gMap.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Configure the click listener.

  //Gets the lat and Long from a click event
  gMap.addListener("click", getClickedLocation);
}

window.initMap = initMap;

function handleLocationError(browserHasGeolocation, infoWindow, pos) {}

//EVENT HANDLER

const searchForm = document.querySelector(`#search-section`);
searchForm.addEventListener(`submit`, function (e) {
  e.preventDefault();
  const inputSection = document.querySelector(`input`);
  const text = inputSection.value;
  if (!text) return;
  // findMultipleLocations();
  findLocationByAddress(text);
});

function map_create_marker(point, html, isPub = true, mapIcon) {
  let marker;
  if (!isPub) {
    marker = new google.maps.Marker({
      position: point,
      map: gMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
      },
    });
  } else {
    const icon = {
      url: mapIcon, // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };

    marker = new google.maps.Marker({
      position: point,
      map: gMap,
      icon: icon,
    });
  }

  if (html != "") {
    const infowindow = new google.maps.InfoWindow({
      content: html,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
  }
  markers.push(marker);
  return marker;
}

// initMarkers();

async function findPlace(request, pubName, description) {
  const service = new google.maps.places.PlacesService(gMap);
  service.findPlaceFromQuery(request, function (results, status) {
    if (status !== "OK") return;
    if (!results) return;
    const name = results[0].name;
    const icon = results[0].icon;
    let photos;
    let imgURL;
    if (results) {
      photos = results[0]?.photos;
      if (photos) {
        imgURL = photos[0].getUrl();
      }
    }

    const lat = results[0].geometry.location.lat();
    const lng = results[0].geometry.location.lng();
    const position = new google.maps.LatLng(lat, lng);
    map_create_marker(position, name, true, icon);
    createCards(imgURL, name, description);
  });
}

function createCards(imgURL, pubName, description) {
  if (!pubName || !description) return;
  if (recentName === pubName) return;
  recentName = pubName;
  const imgURLUsed = imgURL || `./assets/images/placeHolderImage.jpg`;

  const html = `<div class="card">
        <div class="text-container">
          <h2>${pubName}</h2>
          <p>${description}</p>
        </div>
        <div class="place-image-container">
        <img class="place-image"src="${imgURLUsed}" alt="" srcset="">
        </div>
      </div>`;
  const placesContainer = document.querySelector(`.places`);

  placesContainer.insertAdjacentHTML(`afterbegin`, html);
}

function setMarkersOntoMap(gMap) {
  for (const marker of markers) {
    marker.setMap(gMap);
  }
}

function removeMarkersOnMap() {
  setMarkersOntoMap(null);
  markers = [];
}

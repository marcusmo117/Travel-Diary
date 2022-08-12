mapboxgl.accessToken =
  "pk.eyJ1IjoibW93aXBlIiwiYSI6ImNsNmM5OTZ5cjF2dm0zaXA0ejQ2bXFpaHYifQ.-nQwU8ydtMSSBHoO5h0U2w";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([-2.24, 53.48]);
}

async function setupMap(center) {
  const map = await new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    projection: "globe",
    center: center,
    zoom: 3,
  });

  map.on("style.load", () => {
    map.setFog({
      color: "rgb(186, 210, 235)", // Lower atmosphere
      "high-color": "rgb(36, 92, 223)", // Upper atmosphere
      "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
      "space-color": "rgb(11, 11, 25)", // Background color
      "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
    });

    addMarker(map);
  });

  // map controls -> zoom in/out and orientation
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);

  // search function on form -> and brings user to location on map
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

  // getting location from search bar into form input
  geocoder.on("result", function (result) {
    console.log(result);
    const placeName = result.result.place_name;
    const locLong = result.result.center[0];
    const locLat = result.result.center[1];
    const formInputPlace = document.getElementById("post-place-name");
    const formInputLong = document.getElementById("post-location-long");
    const formInputLat = document.getElementById("post-location-lat");
    formInputPlace.value = placeName;
    formInputLong.value = locLong;
    formInputLat.value = locLat;
    console.log(
      "long: " +
        formInputLong.value +
        " lat: " +
        formInputLat.value +
        " place-name: " +
        formInputPlace.value
    );
  });

  //geolocation function --> console.log long lat of current location and current location toggle on map
  const geolocate = new mapboxgl.GeolocateControl();

  map.addControl(geolocate);

  geolocate.on("geolocate", function (e) {
    const lon = e.coords.longitude;
    const lat = e.coords.latitude;
    const position = [lon, lat];
    console.log(position);
  });
}

// calling posts data from DB -> can check format in postman
async function fetchPosts() {
  const response = await fetch("/users/post");
  const data = await response.json();
  return data;
}

// adding markers from data in DB
async function addMarker(map) {
  const data = await fetchPosts();
  data.forEach((post) => {
    const long = post.longitude;
    const lat = post.latitude;
    const title = post.title;
    const description = post.description;
    const place = post.placeName;
    const image = post.imageUrl;
    this.popup = new mapboxgl.Popup().setHTML(
      "<h1>" +
        title +
        "</h1>" +
        "<p>" +
        description +
        "</p>" +
        "<p>" +
        place +
        "</p>" +
        "<p><img src='" +
        image +
        "'" +
        "class='img-thumbnail'></img></p>"
    );
    this.post = new mapboxgl.Marker()
      .setLngLat([long, lat])
      .setPopup(this.popup)
      .addTo(map);
  });
}

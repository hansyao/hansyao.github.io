
var map;

function initMap() {
  const myLatLng = {
    lat: 31.132193301555073,
    lng: 121.57718055197236,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: myLatLng,
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
    icon: 'https://cdn.jsdelivr.net/gh/hansyao/image-hosting@master/20210520/image.40nrz6phtdg0.png',
    title: "Hans Yao",
  })
}
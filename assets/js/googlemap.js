function initMap() {
  var locations = [
    ['Hans Yao', 31.132193301555073, 121.57718055197236, 'https://cdn.jsdelivr.net/gh/hansyao/image-hosting@master/20210520/image.40nrz6phtdg0.png']
  ];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(31.132193301555073, 121.57718055197236),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      icon: locations[i][3],
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

}
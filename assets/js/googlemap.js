function initMap() {
  var locations = [
    ['<div><b>Hans Yao</b></div><div><b>email:&nbsp;&nbsp;</b><a href="mailto:hansyow@gmail.com">hansyow@gmail.com</a></div><div><b>电话:&nbsp;&nbsp;&nbsp;</b>+1(857)288-8870</div>', 31.132193301555073, 121.57718055197236, 'https://cdn.jsdelivr.net/gh/hansyao/image-hosting@master/20210520/image.40nrz6phtdg0.png']
  ];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(31.132193301555073, 121.57718055197236),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


  var marker, i;

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      icon: locations[i][3],
      map: map
    });

    var infowindow = new google.maps.InfoWindow({
      content: locations[i][0]
    });
    infowindow.open(map, marker);

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
    
  }

}
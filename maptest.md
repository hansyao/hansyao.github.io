---
layout: page
title: 联系方式
permalink: /contact/
---

<script src="https://v1.oneplus-solution.com/maps/api/js?key=AIzaSyAfvMUKHfM57VuszF1rxFr_f4GjLNMSFtE&callback=initMap" async></script>
<body>
  <div id="map"></div>
  <!-- Async script executes immediately and must be after any DOM elements used in callback. -->
</body>

<form class="gform" method="POST" data-email="hansyow@gmail.com"
  data-cfasync="false"
  action="https://v1.oneplus-solution.com/macros/s/AKfycbzEWUMIp7dxXScbNeP3nuqmrwja_7tVDctVkCmB/exec">
  <!-- change the form action to your script url -->

<br>
  <div class="form-elements">
    <h3>你的大名:</h3>
    <input type="text" name="name" class="form-control" id="name" placeholder="你的大名..." />
    <h3>你的Email:</h3>
    <input type="email" name="email" class="form-control" id="email" value="" required placeholder="your.name@email.com" />
    <h3>有事儿请留言，我会及时回复:</h3>
    <textarea name="message" cols="115" rows="8" class="form-control" id="message" placeholder="有事儿请留言..."></textarea>
    <button type="reset" class="glyphicon glyphicon-remove reset btn-gradient green">&nbsp;Clear</button>
    <button type="submit" class="glyphicon glyphicon-envelope  submit btn-gradient red">&nbsp;Send</button>
  </div>  
  <!-- Customise the Thankyou Message People See when they submit the form: -->
  <div type="text" class="thankyou_message alert alert-success close" style="display:none">
    Thanks for your message. I will contact you soon!
  </div>
</form>

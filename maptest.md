---
layout: page
title: Google Map
permalink: /map2/
---

**Find me here**

<body>
  <div id="map"></div>

  <!-- Async script executes immediately and must be after any DOM elements used in callback. -->

</body>

<form class="gform pure-form pure-form-stacked" method="POST" data-email="hansyow@gmail.com"
  data-cfasync="false"
  action="https://v1.oneplus-solution.com/macros/s/AKfycbzEWUMIp7dxXScbNeP3nuqmrwja_7tVDctVkCmB/exec">
  <!-- change the form action to your script url -->

  <h1>Let's Keep on touch!</h1>
  <div class="form-elements">
    <h3>your Name:</h3>
    <input type="text" name="name" class="form-control name-contact" id="name" placeholder="Name..." />
    <h3>Your Email:</h3>
    <input type="email" name="email" class="form-control email-contact" id="email" value="" required placeholder="your.name@email.com" />
    <h3>Please leave Your Message:</h3>
    <textarea name="message" cols="115" rows="8" class="form-control message-contact" id="message" placeholder="Message..."></textarea>
      <button type="reset" class="glyphicon glyphicon-remove reset">&nbsp;Clear</button>
      <button class="glyphicon glyphicon-envelope  submit">&nbsp;Send</button>
  </div>
  <!-- Customise the Thankyou Message People See when they submit the form: -->
  <div type="button" class="thankyou_message alert alert-success close" style="display:none">
    Thanks for your message. I will contact you soon!
  </div>
</form>
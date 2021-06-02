---
layout: page
title: 
permalink: /tagwall/
---

<body>
    <div id="canvas">
        {% for tag in site.tags %}
        <!-- <div class="bg"> -->
        <a class="btn-gradient dynamiccolor" id="li{{ forloop.index }}" href="../tags/#{{ tag[0] }}"> {{ tag[0] }}
            ({{ tag[1] | size }})</a>
        <!-- </div> -->
        {% endfor %}
    </div>
      {% include tagwallscript.html %}

</body>
---
layout: page
title: 标签墙
permalink: /tagwall/
---

<body>

    <div id="canvas">
        {% for tag in site.tags %}
        <!-- <div class="bg"> -->
        <a class="btn-gradient dynamiccolor" id="li{{ forloop.index }}" href="../#{{ tag[0] }}"> {{ tag[0] }}
            ({{ tag[1] | size }})</a>
        <!-- </div> -->
        {% endfor %}

    </div>

    <script src="/assets/js/three.js"></script>
    <script src="/assets/js/OrbitControls.js"></script>
    <script src="/assets/js/CSS3DRenderer.js"></script>

    <script type="text/javascript">
        var elements = new Array();

        for (var i = 1; i < 15; i++) {
            var el_id = "li" + i;
            var obj = document.getElementById(el_id);
            elements.push(obj);

        }
        var camera, renderer, scene;
        var controls;
        var objects = new Array();
        var thetas = new Array();
        var phis = new Array();
        var r = 450;
        int();
        animate();

        function int() {
            camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 2000000);
            camera.position.set(0, 0, 720);
            scene = new THREE.Scene();
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var phi = Math.acos(-1 + (2 * i) / elements.length);
                phis.push(phi);
                var theta = Math.sqrt(elements.length * Math.PI) * phi;
                thetas.push(theta);
                var object = new THREE.CSS3DObject(element);
                object.position.x = r * Math.cos(theta) * Math.sin(phi);
                object.position.z = r * Math.sin(theta) * Math.sin(phi);
                object.position.y = r * Math.cos(phi);
                scene.add(object);
                objects.push(object);
            }
            renderer = new THREE.CSS3DRenderer;
            renderer.setSize(800, 800);
            render();
            document.getElementById('canvas').appendChild(renderer.domElement);

            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.update();

            window.addEventListener('resize', onWindowResize, false);
            controls.addEventListener('change', render);
        }

        function render() {

            renderer.render(scene, camera);

        }

        function animate() {

            requestAnimationFrame(animate);


            var phi = Math.acos(-1 + (2 * i) / elements.length);
            var theta = Math.sqrt(elements.length * Math.PI) * phi;
            for (var i = 0; i < objects.length; i++) {
                thetas[i] += 0.001; //phis[i] -= 0.001;
                objects[i].position.x = r * Math.cos(thetas[i]) * Math.sin(phis[i]);
                objects[i].position.z = r * Math.sin(thetas[i]) * Math.sin(phis[i]);
                objects[i].position.y = r * Math.cos(phis[i]);

            }

            render();
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(450, 450);
            render();
        }

    </script>

</body>
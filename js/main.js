var camera,
    mainScene,
    curveScene,
    renderer;

mainSceneSetup();
animate();

function mainSceneSetup() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var container = document.getElementById('main');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.x = camera.position.y = camera.position.y = 2;
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    mainScene = new THREE.Scene();
    curveScene = new THREE.Scene();
    window.addEventListener("keydown", keyDown, false);


    regenDisplay('hsl');
}

function keyDown(e) {
    console.log(String.fromCharCode(e.which));
    switch(String.fromCharCode(e.which)) {
    case 'r':
    case 'R':
        regenDisplay('rgb');
        break;
    case 'h':
    case 'H':
        regenDisplay('hsl');
        break;
    }
}

function regenDisplay(mode) {
    mainScene = new THREE.Scene();
    curveScene = new THREE.Scene();

    var axisHelper = new THREE.AxisHelper(500);
    mainScene.add(axisHelper);
    window.addEventListener('resize', onWindowResize, false);

    switch (mode) {
        case 'rgb':
            mainScene.add(rgb(7));
            break;
        case 'hsl':
            mainScene.add(hsl(16, 5, 5));
            break;
    }

    curve(mode);
}

function rgb(units) {
    var group = new THREE.Group();
    var u = 1.0 / units;
    var geometry = new THREE.BoxGeometry(u, u, u);

    for (var i = 0; i < units; i++) {
        for (var j = 0; j < units; j++) {
            for (var k = 0; k < units; k++) {
                var color = new THREE.Color();
                color.setRGB(i / units, j / units, k / units);
                var cube = new THREE.Mesh(geometry, transparentMat(color));
                cube.position.x = i * u - 0.5 + u / 2;
                cube.position.y = j * u - 0.5 + u / 2;
                cube.position.z = k * u - 0.5 + u / 2;
                group.add(cube);
            }
        }
    }

    return group;
}

function transparentMat(color) {
    var material = new THREE.MeshBasicMaterial({
        color: color,
        opacity: 0.25,
        transparent: true,
        depthTest: false,
    });
    return material;
}

function pointAt(distance, angle) {
    var p = new THREE.Vector3(distance, 0, 0);
    p.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    return p;
}

function hsl(slices, rings, discs) {
    group = new THREE.Group();
    var angle = 2 * Math.PI / slices;
    var ringUnit = 1.0 / rings;
    var discUnit = 1.0 / discs;
    for (var i = 0; i < slices; i++) {
        for (var j = 0; j < rings; j++) {
            for (var k = 0; k < discs; k++) {
                var a = pointAt(ringUnit * j, angle * i);
                var b = pointAt(ringUnit * j, angle * (i + 1));
                var c = pointAt(ringUnit * (j + 1), angle * i);
                var d = pointAt(ringUnit * (j + 1), angle * (i + 1));

                var base = new THREE.Shape();
                base.moveTo(a.x, a.z);
                base.lineTo(b.x, b.z);
                base.lineTo(c.x, c.z);
                base.lineTo(d.x, d.z);
                base.lineTo(a.x, a.z);

                geom = new THREE.ExtrudeGeometry(base, {
                    amount: discUnit,
                    bevelEnabled: false
                });
                var color = new THREE.Color();
                color.setHSL(i / slices, j / rings, k / discs);
                var mesh = new THREE.Mesh(geom, transparentMat(color));
                mesh.position.z = discUnit * k - 0.5;

                group.add(mesh);
            }
        }
    }
    group.rotation.x = -Math.PI / 2;
    return group;
}


function curve(mode) {
    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 3;
    for (var i = 0; i <= nurbsDegree; i++) {
        nurbsKnots.push(0);
    }

    for (var i = 0, j = 4; i < j; i++) {
        switch (mode) {
            case 'rgb':
                nurbsControlPoints.push(new THREE.Vector4(
                    Math.random(),
                    Math.random(),
                    Math.random(), 1));
                break;
            case 'hsl':
                var p = pointAt(Math.random(), Math.random() * Math.PI * 2);
                p.add(new THREE.Vector3(0.5, 0.5, 0.5));
                nurbsControlPoints.push(new THREE.Vector4(p.x, Math.random(), p.z, 1));
                break;
        }

        nurbsKnots.push(THREE.Math.clamp((i + 1) / (j - nurbsDegree), 0, 1));
    }

    var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);
    var nurbsGeometry = new THREE.Geometry();
    nurbsGeometry.vertices = nurbsCurve.getPoints(200);
    var nurbsMaterial = new THREE.LineBasicMaterial({
        linewidth: 25,
        color: 0x0f0f0f,
        transparent: true
    });
    var nurbsLine = new THREE.Line(nurbsGeometry, nurbsMaterial);
    nurbsLine.position.set(-0.5, -0.5, -0.5);
    curveScene.add(nurbsLine);
    ribbon(nurbsCurve, mode);
}

function ribbon(curve, mode) {
    var canvas = document.getElementById('ribbon');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var id = ctx.createImageData(w, h)
    var vec = curve.getPoints(w);
    for (var i = 0; i < w; i++) {
        var color;
        switch (mode) {
            case 'rgb':
                color = new THREE.Color(vec[i].x, vec[i].y, vec[i].z);
                break;
            case 'hsl':
                color = new THREE.Color();
                angle = new THREE.Vector3(1, 0, 0)
                .angleTo(new THREE.Vector3(vec[i].x, vec[i].y, vec[i].z)) / (Math.PI * 2);
                distance = (new THREE.Vector2(vec[i].x, vec[i].z))
                .distanceTo(new THREE.Vector2(0, 0));
                color.setHSL(angle, distance, vec[i].y)
                break;
        }

        for (var j = 0; j < h; j++) {
            var o = (j * w + i) * 4;
            id.data[o] = Math.floor(color.r * 255);
            id.data[o + 1] = Math.floor(color.g * 255);
            id.data[o + 2] = Math.floor(color.b * 255);
            id.data[o + 3] = 255;
        }
    }

    ctx.putImageData(id, 0, 0);
}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.clear();
    renderer.render(mainScene, camera);
    renderer.render(curveScene, camera);
    renderer.clearDepth();
}

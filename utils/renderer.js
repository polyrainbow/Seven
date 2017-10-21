/*****************************
    PRIVATE
*****************************/

    var universe_y_positions = [0, -5, -10];
    var camera;
    var scene;
    var renderer;
    var mesh;
    var font;
    var universeTexture;


    var createPath = (path, data) => {
        /*
        var curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3( -1, 0, 1 ),
            new THREE.Vector3( -5, 1, 1 ),
            new THREE.Vector3( 2, 1, 1 ),
            new THREE.Vector3( 1, 1, 1 )
        );

        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints( 50 );

        var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

        // Create the final object to add to the scene
        var curveObject = new THREE.Line( geometry, material );

        scene.add(curveObject);
        */

    if (path.isInactive === true){
        return;
    }

    var color = (path.dilationFactor === 1) ? 0x00ffff : 0xff2222;

    var y = universe_y_positions[path.universe_index] + 0.04;

    var x0 = 10 * path.relativeStartRS1 - 5;
    var x1 = 10 * path.relativeEndRS1 - 5;

    var z0 = 10 * -path.relativeStartRS2 + 5;
    var z1 = 10 * -path.relativeEndRS2 + 5;

    var length = Math.sqrt(
        Math.pow(Math.abs(x1 - x0), 2) + Math.pow(Math.abs(z1 - z0), 2)
    );

    if (length < 0.5){
        createPoint((x0 + x1) / 2, y + 0.02, (z0 + z1) / 2, color);
    } else {
        createPoint(x0, y + 0.02, z0, color);
        createLine(x0, y, z0, x1, y, z1, color);
        createPoint(x1, y + 0.02, z1, color);
    }
}


var createPoint = (x, y, z, color) => {
    var pointGeometry = new THREE.CircleGeometry( 0.15, 16 );
    var pointMaterial = new THREE.MeshBasicMaterial( { color: color } );
    var pointMesh = new THREE.Mesh( pointGeometry, pointMaterial );
    pointMesh.position.x = x;
    pointMesh.position.y = y;
    pointMesh.position.z = z;
    pointMesh.rotation.x = 1.5 * Math.PI;
    scene.add( pointMesh );
}


var createText = (text, font, x, y, z) => {

    var textGeometry = new THREE.TextGeometry( text, {
        font: font,
        size: 0.5,
        height: 0,
        curveSegments: 12,
        bevelEnabled: false
    });

    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var textMesh = new THREE.Mesh( textGeometry, material );
    textMesh.position.x = x;
    textMesh.position.y = y;
    textMesh.position.z = z;

    textMesh.rotation.x = 1.5 * Math.PI;
    scene.add(textMesh);
}


var drawUniverses = (data) => {
    data.universes.forEach((u, i) => {
        drawUniversePlane(universe_y_positions[i], data);
    });
    data.paths.forEach(p => createPath(p, data));
}


var drawUniversePlane = function(y, data){

    var material = new THREE.MeshBasicMaterial({map: universeTexture});
    var geometry = new THREE.PlaneGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 1.5 * Math.PI;
    mesh.position.y = y;
    scene.add(mesh);


    var size = 5, step = 1;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0x333333});

    for ( var i = - size; i <= size; i += step){
        geometry.vertices.push(new THREE.Vector3( - size, y, i ));
        geometry.vertices.push(new THREE.Vector3( size, y, i ));

        geometry.vertices.push(new THREE.Vector3( i, y, - size ));
        geometry.vertices.push(new THREE.Vector3( i, y, size ));
    }

    var line = new THREE.LineSegments( geometry, material);
    scene.add(line);


    var loader = new THREE.FontLoader();
    loader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {
        data.earliestDateOfRef2 && createText(data.earliestDateOfRef2.years, font, 5, y, 5);
        data.latestDateOfRef2 && createText(data.latestDateOfRef2.years, font, 5, y, -5);

        if (data.RS1duration > 31536000000){
            var x_end_value = Math.round(data.RS1duration / 1000 / 60 / 60 / 24 / 365) + " years";
        } else if (data.RS1duration > 86400000){
            x_end_value = Math.round(data.RS1duration / 1000 / 60 / 60 / 24) + " days";
        } else if (data.RS1duration > 3600000){
            x_end_value = Math.round(data.RS1duration / 1000 / 60 / 60) + " hours";
        } else {
            x_end_value = Math.round(data.RS1duration / 1000) + " seconds";
        }


        createText("0", font, -5, y, 6);
        createText(x_end_value, font, 3, y, 6);
    });

}


var createLine = (x0, y0, z0, x1, y1, z1, color) => {
    var material = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x0, y0, z0));
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}


var animate = () => {
    requestAnimationFrame( animate );
    //camera.rotation.z += 0.2;
    renderer.render( scene, camera );
}


/*****************************
PUBLIC
*****************************/


var init = (parentElement) => {

    var width = parentElement.getBoundingClientRect().width;
    var height = parentElement.getBoundingClientRect().height;

    camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );
    camera = camera;
    camera.position.x = 1;
    camera.position.y = 5;
    camera.position.z = 12;

    camera.rotation.x = -30 * 2 * Math.PI / 360;
    camera.rotation.y = 3 * 2 * Math.PI / 360;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(width, height);
    parentElement.appendChild( renderer.domElement );

    var fontLoader = new THREE.FontLoader();
    fontLoader.load( 'assets/helvetiker_regular.typeface.json', (loadedFont) => {
        font = loadedFont;
    });

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/HubbleUltraDeepField_1024.jpg', (texture) => {
        universeTexture = texture;
    });

    animate();

    /*
    var plc = new THREE.PointerLockControls(camera)
    plc.enabled = true;
    scene.add( plc.getObject() );
    */
}


var refresh = (data) => {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );
    console.log(data); /////////////////////////////////////////////////
    drawUniverses(data);
}


module.exports = {
    init,
    refresh
}

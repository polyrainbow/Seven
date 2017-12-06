var dateFormatter = require("./date-formatter.js");
var moment = require("moment");

/*****************************
    PRIVATE
*****************************/

    var distance_between_universes = 5;
    var camera;
    var scene;
    var renderer;
    var mesh;
    var font;
    var universeTexture;
    var active_universe_index = 0;
    var camera_y_offset = 6;
    const DEBUG_MODE = true;
    var universe_plane_material;
    var universe_plane_geometry;
    var pointGeometry = new THREE.CircleGeometry( 0.2, 16 );
    var textGeometries = [];

    var getUniverseYPosition = (universe_index) => {
        return -distance_between_universes * universe_index;
    }


    var createInterUniverseConnection = (span1, span2, data) =>{

        var color = 0x00ff00;

        var x0 = 10 * span1.relativeEndRS1 - 5;
        var x1 = 10 * span2.relativeStartRS1 - 5;

        var origin_universe_index = data.universes.findIndex(u => u.id === span1.universe_id);
        var y0 = getUniverseYPosition(origin_universe_index) + 0.04;
        var target_universe_index = data.universes.findIndex(u => u.id === span2.universe_id);
        var y1 = getUniverseYPosition(target_universe_index) + 0.04;

        var z0 = 10 * -span1.relativeEndRS2 + 5;
        var z1 = 10 * -span2.relativeStartRS2 + 5;

        createLine(x0, y0, z0, x1, y1, z1, color);

    }


    var createSpan = (span, data) => {
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

    if (span.isInactive === true){
        return;
    }

    var color = (span.dilationFactor === 1) ? 0x00ffff : 0xff2222;

    var universe_index = data.universes.findIndex(u => u.id === span.universe_id);

    var y = getUniverseYPosition(universe_index) + 0.04;

    var x0 = 10 * span.relativeStartRS1 - 5;
    var x1 = 10 * span.relativeEndRS1 - 5;

    var z0 = 10 * -span.relativeStartRS2 + 5;
    var z1 = 10 * -span.relativeEndRS2 + 5;

    var length = Math.sqrt(
        Math.pow(Math.abs(x1 - x0), 2) + Math.pow(Math.abs(z1 - z0), 2)
    );

    if (length < 0.25){
        createPoint((x0 + x1) / 2, y + 0.02, (z0 + z1) / 2, color);
    } else {
        createPoint(x0, y + 0.02, z0, color);
        createLine(x0, y, z0, x1, y, z1, color);
        createPoint(x1, y + 0.02, z1, color);
    }
}


var createPoint = (x, y, z, color) => {
    var pointMaterial = new THREE.MeshBasicMaterial( { color: color } );
    var pointMesh = new THREE.Mesh( pointGeometry, pointMaterial );
    pointMesh.position.x = x;
    pointMesh.position.y = y;
    pointMesh.position.z = z;
    pointMesh.rotation.x = 1.5 * Math.PI;
    scene.add( pointMesh );
    return pointMesh;
}

var createTextGeometry = (text) => {
    return new THREE.TextGeometry( text, {
        font: font,
        size: 0.5,
        height: 0,
        curveSegments: 12,
        bevelEnabled: false
    });
}


var createText = (text, x, y, z, rotation_z, color) => {

    if(textGeometries[text]) {
        textGeometry = textGeometries[text];
    } else {
        var textGeometry = createTextGeometry(text);
        textGeometries[text] = textGeometry;
    }

    var material = new THREE.MeshBasicMaterial({color: color || 0xffffff});
    var textMesh = new THREE.Mesh( textGeometry, material );
    textMesh.position.x = x;
    textMesh.position.y = y;
    textMesh.position.z = z;

    textMesh.rotation.x = 1.5 * Math.PI;
    textMesh.rotation.z = rotation_z || 0;

    scene.add(textMesh);

    return textMesh;
}


var drawUniverses = (data) => {
    data.universes.forEach((u, i) => {
        drawUniversePlane(u, i, data);
    });

    var active_path = data.paths.find(p => p.id === data.active_path_id);

    if (!active_path) return;

    active_path.spans.forEach((span, i, spans) => {
        var universe = data.universes.find(u => u.id === span.universe_id);
        if (universe){
            createSpan(span, data);
            if (spans[i+1] && spans[i+1].universe_id !== span.universe_id){
                //draw universe link only if both universes exist
                var target_universe = data.universes.find(u => u.id === spans[i+1].universe_id);
                if (target_universe){
                    createInterUniverseConnection(span, spans[i+1], data)
                }
            }
        }
    });

}


var drawUniversePlane = function(u, i, data){

    var y = getUniverseYPosition(i);

    var mesh = new THREE.Mesh(universe_plane_geometry, universe_plane_material);
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

    createText(u.name, -5.5, y, 5, 90 * 2 * Math.PI / 360, 0xffff00);

    var active_path = data.paths.find(p => p.id === data.active_path_id);

    if (!active_path){
        return;
    }

    if (u.RS2duration > 31536000000){
        u.earliestDateOfRef2 && createText(u.earliestDateOfRef2.years, 5, y, 5);
        u.latestDateOfRef2 && createText(u.latestDateOfRef2.years, 5, y, -5);
    } else if (u.RS2duration > 2628000000){
        u.earliestDateOfRef2 && createText(
            moment(u.earliestDateOfRef2).format("MMM Y"),
            5, y, 5
        );
        u.latestDateOfRef2 && createText(
            moment(u.latestDateOfRef2).format("MMM Y"),
            5, y, -5
        );
    } else {
        u.earliestDateOfRef2 && createText(
            moment(u.earliestDateOfRef2).format("D MMM Y"),
            5, y, 5
        );
        u.latestDateOfRef2 && createText(
            moment(u.latestDateOfRef2).format("D MMM Y"),
            5, y, -5
        );
    }

    var x_span = dateFormatter.msPairToUseful(0, active_path.RS1duration);

    createText(x_span.start, -5, y, 6);
    createText(x_span.end, 3, y, 6);

}


var createLine = (x0, y0, z0, x1, y1, z1, color) => {
    var material = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x0, y0, z0));
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
}


var moveCamera = (
    camera_position_x_target,
    camera_position_y_target,
    camera_position_z_target,
    camera_rotation_x_target,
    camera_rotation_y_target,
    camera_rotation_z_target
) => {
    if (camera.position.x < camera_position_x_target){
        camera.position.x += 0.1;
    }
    if (camera.position.x > camera_position_x_target){
        camera.position.x -= 0.1;
    }

    if (camera.position.y < camera_position_y_target){
        camera.position.y += 0.1;
    }
    if (camera.position.y > camera_position_y_target){
        camera.position.y -= 0.1;
    }

    if (camera.position.z < camera_position_z_target){
        camera.position.z += 0.1;
    }
    if (camera.position.z > camera_position_z_target){
        camera.position.z -= 0.1;
    }

    //Rotation

    if (camera.rotation.x < camera_rotation_x_target){
        camera.rotation.x += 0.1;
    }
    if (camera.rotation.x > camera_rotation_x_target){
        camera.rotation.x -= 0.1;
    }

    if (camera.rotation.y < camera_rotation_y_target){
        camera.rotation.y += 0.1;
    }
    if (camera.rotation.y > camera_rotation_y_target){
        camera.rotation.y -= 0.1;
    }

    if (camera.rotation.z < camera_rotation_z_target){
        camera.rotation.z += 0.1;
    }
    if (camera.rotation.z > camera_rotation_z_target){
        camera.rotation.z -= 0.1;
    }

};


var animate = () => {
    requestAnimationFrame( animate );

    if (!DEBUG_MODE){

        var camera_position_x_target = 1;
        var camera_position_y_target = getUniverseYPosition(active_universe_index) + camera_y_offset;
        var camera_position_z_target = 11;

        var camera_rotation_x_target = -30 * 2 * Math.PI / 360;
        var camera_rotation_y_target = 3 * 2 * Math.PI / 360;
        var camera_rotation_z_target = 0;

        moveCamera(
            camera_position_x_target,
            camera_position_y_target,
            camera_position_z_target,
            camera_rotation_x_target,
            camera_rotation_y_target,
            camera_rotation_z_target
        );

    }

    renderer.render( scene, camera );

}


/*****************************
PUBLIC
*****************************/


var init = (parentElement) => {

    var width = parentElement.getBoundingClientRect().width;
    var height = parentElement.getBoundingClientRect().height;

    camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );
    window.camera = camera;
    camera.position.x = 1;
    camera.position.z = 11;

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
        universe_plane_material = new THREE.MeshBasicMaterial({map: universeTexture});
        universe_plane_geometry = new THREE.PlaneGeometry( 10, 10, 10 );
    });

    animate();

}


var refresh = (data) => {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    //var axisHelper = new THREE.AxisHelper( 5 );
    //scene.add( axisHelper );
    console.log(data); /////////////////////////////////////////////////
    drawUniverses(data);
    active_universe_index = data.universes.findIndex(u => u.id === data.active_universe_id);
}


window.focusFirstUniverseFromAbove = () => {
  camera.position.x = 0;
  camera.position.y = 8;
  camera.position.z = 0;

  camera.rotation.x = 1.5 * Math.PI;
  camera.rotation.y = 0;
  camera.rotation.z = 0;
}


module.exports = {
    init,
    refresh
}

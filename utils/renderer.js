var RENDERER = (function(){

    /*****************************
        PRIVATE
    *****************************/

  var camera;
  var scene, renderer;
  var mesh;


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

    var y = 0.04;

    var x0 = 10 * path.relativeStartRS1 - 5;
    var x1 = 10 * path.relativeEndRS1 - 5;

    var z0 = 10 * -path.relativeStartRS2 + 5;
    var z1 = 10 * -path.relativeEndRS2 + 5;

      my.createLine(x0, y, z0, x1, y, z1);
  }


  var createText = (text, font, x, y, z) => {

        var textGeometry = new THREE.TextGeometry( text, {
            font: font,
              size: 1,
              height: 0,
              curveSegments: 12,
              bevelEnabled: false,
              bevelThickness: 1,
              bevelSize: 8,
              bevelSegments: 5
        });

        var material = new THREE.MeshBasicMaterial({color: 0xffffff});
        var textMesh = new THREE.Mesh( textGeometry, material );
        textMesh.position.x = x;
        textMesh.position.y = y;
        textMesh.position.z = z;

        textMesh.rotation.x = 1.5 * Math.PI;
        scene.add(textMesh);
    }


    /*****************************
        PUBLIC
    *****************************/


  var my = {};



  my.drawUniversePlane = function(y, data){

    // instantiate a loader
    var loader = new THREE.TextureLoader();

    // load a resource
    loader.load(
    	// resource URL
    	'assets/HubbleUltraDeepField_1024.jpg',
    	// Function when resource is loaded
    	function ( texture ) {
              var material = new THREE.MeshBasicMaterial({map: texture});
              var geometry = new THREE.PlaneGeometry( 10, 10, 10 );
             var mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = 1.5 * Math.PI;
            scene.add(mesh);
    	},
    );



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
        data.earliestDateOfRef2 && createText(data.earliestDateOfRef2.years, font, 5, 0, 5);
        data.latestDateOfRef2 && createText(data.latestDateOfRef2.years, font, 5, 0, -5);

        createText("0", font, -5, 0, 7);
        createText(data.RS1duration, font, 4, 0, 7);
    });

  }


  my.init = (parentElement) => {

    var width = parentElement.getBoundingClientRect().width;
    var height = parentElement.getBoundingClientRect().height;

  	camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );
    my.camera = camera;
    camera.position.x = 0;
    camera.position.y = 3;
    camera.position.z = 14;

    camera.rotation.x = -30 * 2 * Math.PI / 360;

  	scene = new THREE.Scene();

  	renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(width, height);
  	parentElement.appendChild( renderer.domElement );

    my.animate();
    //my.createTestObject();

/*
    var plc = new THREE.PointerLockControls(camera)
    plc.enabled = true;
    scene.add( plc.getObject() );
*/
  }


  my.createTestObject = () => {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  	var material = new THREE.MeshNormalMaterial();

  	mesh = new THREE.Mesh( geometry, material );
  	scene.add( mesh );
    my.cube = mesh;
    mesh.position.z = 2;
  }


  my.createLine = (x0, y0, z0, x1, y1, z1) => {
    var material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x0, y0, z0));
    geometry.vertices.push(new THREE.Vector3(x1, y1, z1));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
  }


  my.animate = () => {
  	requestAnimationFrame( my.animate );
    //camera.rotation.z += 0.2;
  	renderer.render( scene, camera );
  }


  my.refresh = (data) => {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );
    console.log(data); /////////////////////////////////////////////////
    my.drawUniversePlane(0.04, data);
    data.paths.forEach(p => createPath(p, data));
  }

  return my;


})();

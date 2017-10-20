var RENDERER = (function(){

  var camera = {x:0};
  var scene, renderer;
  var mesh;

  var my = {};

  var createPath = (path) => {
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
      console.log(scene);
  }


  my.drawUniversePlane = function(y){
    var size = 10, step = 1;

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0x333333});

    for ( var i = - size; i <= size; i += step){
       geometry.vertices.push(new THREE.Vector3( - size, y, i ));
       geometry.vertices.push(new THREE.Vector3( size, y, i ));

       geometry.vertices.push(new THREE.Vector3( i, y, - size ));
       geometry.vertices.push(new THREE.Vector3( i, y, size ));

    }

    var line = new THREE.Line( geometry, material, THREE.LinePieces);
    scene.add(line);

    var loader = new THREE.FontLoader();

    loader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {

      var textGeometry = new THREE.TextGeometry( "Hello", {
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
      textMesh.position.y = 1;
      scene.add(textMesh);

    });

  }


  my.init = (parentElement) => {

    var width = parentElement.getBoundingClientRect().width;
    var height = window.innerHeight;

  	camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 );
    my.camera = camera;
    camera.position.x = 1;
    camera.position.y = 3;
    camera.position.z = 12;


    camera.rotation.x = -0.1;
    console.log(camera)

  	scene = new THREE.Scene();

  	renderer = new THREE.WebGLRenderer( { antialias: true } );
  	//renderer.setSize( window.innerWidth,  );
    renderer.setSize(width, height);
  	parentElement.appendChild( renderer.domElement );

    var axisHelper = new THREE.AxisHelper( 10 );
    scene.add( axisHelper );

    my.animate();
    my.createTestLine();
    my.createTestObject();
    my.drawUniversePlane(0.04);

  }


  my.createTestObject = () => {
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.2 );
  	var material = new THREE.MeshNormalMaterial();

  	mesh = new THREE.Mesh( geometry, material );
  	scene.add( mesh );
    my.cube = mesh;
    mesh.position.x = 1;
  }


  my.createTestLine = () => {
    var material = new THREE.LineBasicMaterial({ color: 0x00ffff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(1, 1, 1));
    geometry.vertices.push(new THREE.Vector3(1, 2, 2));
    geometry.vertices.push(new THREE.Vector3(1, 3, 3));

    var line = new THREE.Line(geometry, material);

    scene.add(line);
  }


  my.animate = () => {
  	requestAnimationFrame( my.animate );
  	renderer.render( scene, camera );
  }


  my.refresh = (data) => {
    console.log(data)
    data.paths.forEach(createPath);
  }

  return my;


})();

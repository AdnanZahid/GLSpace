var http = "http://";
var elements = [];
var server;

var loc = document.URL;
var cssX = loc.charAt(loc.indexOf("x:")+2);

function go() {

	if(document.activeElement.id=="left")
		elements[0].src	= http + document.getElementById("left").value;
	if(document.activeElement.id=="center")
		elements[1].src	= http + document.getElementById("center").value;
	if(document.activeElement.id=="right")
		elements[2].src	= http + document.getElementById("right").value;
	if(document.activeElement.id=="back")
		elements[3].src	= http + document.getElementById("back").value;
}

function handleIt(e) {

  	if (e.which == 13){
	    go();
	    e.preventDefault();
	}
}

$(document).ready(function(){

function $(id) {
  return document.getElementById(id);
}

var main = function(
    GameServer,
    GameClient,
    ThreeJS,
    Misc) {

  var globals = {
    port: 8080,
    master: false,

    x: 0,
    y: 0,

    shared: {
      fullWidth: 1000,
      fullHeight: 1000,

      fieldOfView: 30,

      zNear: 1,
      zFar: 10000,

      useWindowPosition: false,

      cameraPosition: {
        x: 0,
        y: 700,
        z: 800,
      },

      cameraRotation: {
        x: 0,
        y: 0,
        z: 0,
      },

      cssObjectPosition: {
        x: 0,
        y: 0,
        z: 0,
      },

      cssObjectRotation: {
        x: 0,
        y: 0,
        z: 0,
      },

      webpages: {
        left: document.getElementById("left").value,
        center: document.getElementById("center").value,
        right: document.getElementById("right").value,
      },

      leftOffSet: 450,
      rightOffSet: 450,
    }
  };
  Misc.applyUrlSettings(globals);

  var noop = function() { };

  var handleSetMsg = function(data) {
    Misc.copyProperties(data, globals.shared);
  };

  if (globals.server) {
    server = new GameServer({
      gameId: "syncThreeJS",
      disconnectPlayersIfGameDisconnects: false,
    });
    server.addEventListener('playerconnect', noop);
    server.addEventListener('connected', noop);
    server.addEventListener('disconnected', noop);

  }

  var client = new GameClient({
    gameId: "syncThreeJS",
  });
  client.addEventListener('connected', noop);
  client.addEventListener('disconnected', noop);
  client.addEventListener('set', handleSetMsg);

  var canvas = $("c");
  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setClearColor(0xffffff, 1);

  var SCREEN_WIDTH = globals.shared.fullWidth, SCREEN_HEIGHT = globals.shared.fullHeight;
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  var container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );

  rendererCSS  = new THREE.CSS3DRenderer();
  rendererCSS.setSize( window.innerWidth, window.innerHeight );
  rendererCSS.domElement.style.position = 'absolute';
  rendererCSS.domElement.style.top    = 0;
  rendererCSS.domElement.style.margin   = 0;
  rendererCSS.domElement.style.padding  = 0;
  document.body.appendChild( rendererCSS.domElement );
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top      = 0;

  renderer.domElement.style.zIndex   = 1;
  rendererCSS.domElement.appendChild( renderer.domElement );

  var camera = new THREE.PerspectiveCamera( 20, 1, 1, 10000 );
  camera.position.set(0,500,800);

  var scene = new THREE.Scene();
  scene.add(camera);

  var cssScene = new THREE.Scene();

  var cssObjects = [];

  var floorTexture = new THREE.ImageUtils.loadTexture( 'metalFloor.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(1024, 1024, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  var rendererCSS;

  var makeWebsite = function (positionX, positionZ, rotationY, website, notInverted, id) {
  
    var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, side: THREE.DoubleSide });
    var planeWidth = 1024;
    var planeHeight = 1024;
    var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
    var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );
    
    planeMesh.position.x = positionX;
    planeMesh.position.y += planeHeight/2;
    planeMesh.position.z = positionZ;
    planeMesh.rotation.y = rotationY;

    scene.add(planeMesh);

    var	element=document.getElementById(id);

    elements.push(element);

    var elementWidth = 1024;

    var aspectRatio = planeHeight / planeWidth;
    var elementHeight = elementWidth * aspectRatio;

    // element.style.width  = elementWidth + "px";
    // element.style.height = elementHeight + "px";
    // cssObject.position = planeMesh.position;
    // cssObject.rotation = planeMesh.rotation;
    // element.style.display = "block";
    // cssObject.scale.x /= elementWidth / planeWidth;
    // cssObject.scale.y /= elementWidth / planeWidth;
    
    var cssObject = new THREE.CSS3DObject( element );

    cssScene.add(cssObject);

    cssObjects.push(cssObject);
  }

  var keyboard = new THREEx.KeyboardState();
  var update = function () {

    if ( keyboard.pressed("w") ) 
    {
		globals.shared.leftOffSet -= 3.25;
		globals.shared.rightOffSet -= 3.25;
		camera.translateZ(-10);
    }
    else if ( keyboard.pressed("s") ) 
    {
		globals.shared.leftOffSet += 3.25;
		globals.shared.rightOffSet += 3.25;
		camera.translateZ(10);
    }

    else if ( keyboard.pressed("up") ) 
    { 
      camera.translateY(10);
    }
    else if ( keyboard.pressed("down") ) 
    { 
      camera.translateY(-10);
    }
    else if ( keyboard.pressed("left") ) 
    { 
      camera.translateX(-10);
    }
    else if ( keyboard.pressed("right") ) 
    { 
      camera.translateX(10);
    }

      server.broadcastCmd('set', { leftOffSet: globals.shared.leftOffSet });
      server.broadcastCmd('set', { rightOffSet: globals.shared.rightOffSet });
      server.broadcastCmd('set', { cameraPosition: {x: camera.position.x, y: camera.position.y, z: camera.position.z }});
  }

  var render = function() {

    if (Misc.resize(canvas)) {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }

    camera.setViewOffset(
        globals.shared.fullWidth, globals.shared.fullHeight,
        globals.x, globals.y,
        canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.fov    = globals.shared.fieldOfView;
    camera.zNear  = globals.shared.zNear;
    camera.zFar   = globals.shared.zFar;
    camera.position.x = globals.shared.cameraPosition.x;
    camera.position.y = globals.shared.cameraPosition.y;
    camera.position.z = globals.shared.cameraPosition.z;

    // camera.rotation.x = globals.shared.cameraRotation.x;
    // camera.rotation.y = globals.shared.cameraRotation.y;
    // camera.rotation.z = globals.shared.cameraRotation.z;

	if(cssX != 4){
		if(document.getElementById("left").value != globals.shared.webpages.left){
			document.getElementById("left").value = globals.shared.webpages.left;
			elements[0].src	= http + document.getElementById("left").value;
		}
		else if(document.getElementById("center").value != globals.shared.webpages.center){
			document.getElementById("center").value = globals.shared.webpages.center;
			elements[1].src	= http + document.getElementById("center").value;
		}
		else if(document.getElementById("right").value != globals.shared.webpages.right){
			document.getElementById("right").value = globals.shared.webpages.right;
			elements[2].src	= http + document.getElementById("right").value;
		}
	}
	else{
		if(document.getElementById("controls").style.display != "block")
			document.getElementById("controls").style.display = "block";
	}

	// camera.fov    = globals.shared.fieldOfView;

	if(cssX == 0){

	    cssObjects[0].position.x = globals.shared.cssObjectPosition.x - 700 + globals.shared.leftOffSet;
	    cssObjects[0].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[0].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[0].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[0].rotation.y = globals.shared.cssObjectRotation.y + Math.PI*0.38;
	    cssObjects[0].rotation.z = globals.shared.cssObjectRotation.z;

	    cssObjects[1].position.x = globals.shared.cssObjectPosition.x + globals.shared.leftOffSet;
	    cssObjects[1].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[1].position.z = globals.shared.cssObjectPosition.z - 510;

	    cssObjects[1].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[1].rotation.y = globals.shared.cssObjectRotation.y;
	    cssObjects[1].rotation.z = globals.shared.cssObjectRotation.z;

	    cssObjects[2].position.x = globals.shared.cssObjectPosition.x + 320 + globals.shared.leftOffSet;
	    cssObjects[2].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[2].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[2].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[2].rotation.y = globals.shared.cssObjectRotation.y - Math.PI*0.62;
	    cssObjects[2].rotation.z = globals.shared.cssObjectRotation.z;
	}
	else if(cssX == 4){
	    cssObjects[0].position.x = globals.shared.cssObjectPosition.x - 510;
	    cssObjects[0].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[0].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[0].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[0].rotation.y = globals.shared.cssObjectRotation.y + Math.PI*0.5;
	    cssObjects[0].rotation.z = globals.shared.cssObjectRotation.z;

		cssObjects[1].position.x = globals.shared.cssObjectPosition.x;
	    cssObjects[1].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[1].position.z = globals.shared.cssObjectPosition.z - 510;

	    cssObjects[1].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[1].rotation.y = globals.shared.cssObjectRotation.y;
	    cssObjects[1].rotation.z = globals.shared.cssObjectRotation.z;

		cssObjects[2].position.x = globals.shared.cssObjectPosition.x + 510;
	    cssObjects[2].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[2].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[2].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[2].rotation.y = globals.shared.cssObjectRotation.y - Math.PI*0.5;
	    cssObjects[2].rotation.z = globals.shared.cssObjectRotation.z;
	}
	else if(cssX == 9){
	    cssObjects[0].position.x = globals.shared.cssObjectPosition.x - 320 - globals.shared.rightOffSet;
	    cssObjects[0].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[0].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[0].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[0].rotation.y = globals.shared.cssObjectRotation.y + Math.PI*0.62;
	    cssObjects[0].rotation.z = globals.shared.cssObjectRotation.z;

		cssObjects[1].position.x = globals.shared.cssObjectPosition.x - globals.shared.rightOffSet;
	    cssObjects[1].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[1].position.z = globals.shared.cssObjectPosition.z - 510;

	    cssObjects[1].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[1].rotation.y = globals.shared.cssObjectRotation.y;
	    cssObjects[1].rotation.z = globals.shared.cssObjectRotation.z;

		cssObjects[2].position.x = globals.shared.cssObjectPosition.x + 700 - globals.shared.rightOffSet;
	    cssObjects[2].position.y = globals.shared.cssObjectPosition.y + 512;
	    cssObjects[2].position.z = globals.shared.cssObjectPosition.z;

	    cssObjects[2].rotation.x = globals.shared.cssObjectRotation.x;
	    cssObjects[2].rotation.y = globals.shared.cssObjectRotation.y - Math.PI*0.38;
	    cssObjects[2].rotation.z = globals.shared.cssObjectRotation.z;
	}

	elements[0].style.display = "block";
    elements[1].style.display = "block";
    elements[2].style.display = "block";

    camera.updateProjectionMatrix();

    if (globals.shared.useWindowPosition) {
      globals.x = window.screenX;
      globals.y = window.screenY;
    }

    rendererCSS.render( cssScene, camera );

    renderer.render(scene, camera);

    requestAnimationFrame(render);

	if(document.activeElement.id!="left" && document.activeElement.id!="center" && document.activeElement.id!="right" && document.activeElement.id!="back") {
    	update();
	}
	else {
	    if ( keyboard.pressed("enter") ) 
	    {
    		server.broadcastCmd('set', { webpages: {left: document.getElementById("left").value, center: document.getElementById("center").value, right: document.getElementById("right").value}});
	    }
	}
  };
  
  makeWebsite(-510, 0, Math.PI*0.5, http + document.getElementById("left").value, 1, "i1");
  makeWebsite(0, -510, 0, http + document.getElementById("center").value, 1, "i2");
  makeWebsite(510, 0, -Math.PI*0.5, http + document.getElementById("right").value, 1, "i3");
  render();
};

requirejs(
  [ 'gameserver',
    'gameclient',

    'three',
    'misc',
    
    'CSS3DRenderer',
    'THREEx.KeyboardState'
  ],
  main
);

});
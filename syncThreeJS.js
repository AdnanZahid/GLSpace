var http = "http://";
var elements = [];
var server;
var zeOffset = 204;
var scene, camera;
var source;
var video;
var videos = [];
var videoImages = [];
var videoImageContexts = [];
var videoTextures = [];
var movieMaterials = [];

var loc = document.URL;
var cssX = loc.charAt(loc.indexOf("x:")+2);

function go() {

	if(document.activeElement.id=="left")
		elements[0].src	= http + document.getElementById("left").value;
	else if(document.activeElement.id=="center")
		elements[1].src	= http + document.getElementById("center").value;
	else if(document.activeElement.id=="right")
		elements[2].src	= http + document.getElementById("right").value;
	else if(document.activeElement.id=="back")
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

function main(
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

      source: null,

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

      zOffSet: 0,
    }
  };
  Misc.applyUrlSettings(globals);

  function noop() { };

  function handleSetMsg(data) {
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
  var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, preserveDrawingBuffer: true});
  renderer.setClearColor(0xffffff, 1);

  // var renderer = new THREE.WebGLRenderer( { alpha: true } );
  // renderer.setClearColor( 0x00ff00, 0.5 );

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

  camera = new THREE.PerspectiveCamera( 20, 1, 1, 10000 );
  // camera.position.set(0,500,800);

  scene = new THREE.Scene();
  scene.add(camera);

  var cssScene = new THREE.Scene();

  var cssObjects = [];

  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,400,400);
  scene.add(light);

  var rendererCSS;

  function makeWebsite(positionX, positionZ, rotationY, website, notInverted, id) {
  
    var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0, side: THREE.DoubleSide });
    var planeWidth = 1270;
    var planeHeight = 790;
    var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
    var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );
    
    planeMesh.position.x = positionX;
    planeMesh.position.y = planeHeight/2 + 170;
    planeMesh.position.z = positionZ;
    planeMesh.rotation.y = rotationY;

    scene.add(planeMesh);

    var	element=document.getElementById(id);

    elements.push(element);
    
    var cssObject = new THREE.CSS3DObject( element );

    cssScene.add(cssObject);

    cssObjects.push(cssObject);
  }

  var keyboard = new THREEx.KeyboardState();
  function update() {

    if ( keyboard.pressed("w") ) 
    {
  		globals.shared.leftOffSet -= 3.25;
  		globals.shared.rightOffSet -= 3.25;
      zeOffset -= 3.25;
      globals.shared.zOffSet = zeOffset;
  		camera.translateZ(-10);
    }
    else if ( keyboard.pressed("s") ) 
    {
  		globals.shared.leftOffSet += 3.25;
  		globals.shared.rightOffSet += 3.25;
  		zeOffset += 3.25;
      globals.shared.zOffSet = zeOffset;
      camera.translateZ(10);
    }
    else if ( keyboard.pressed("a") ) 
    {
      if(camera.rotation.y > -0.45)
        globals.shared.zOffSet = 0;
      camera.rotation.y += 0.05;
    }
    else if ( keyboard.pressed("d") ) 
    {
      if(camera.rotation.y <= -0.45)
        globals.shared.zOffSet = zeOffset;
      camera.rotation.y -= 0.05;
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
      zeOffset += 3.25;
      globals.shared.zOffSet = zeOffset; 
      camera.translateX(-10);
    }
    else if ( keyboard.pressed("right") ) 
    {
      zeOffset -= 3.25;
      globals.shared.zOffSet = zeOffset;
      camera.translateX(10);
    }
    else if ( keyboard.pressed("r") ) 
    {
    	window.location = window.location;
    }

    else if ( keyboard.pressed("f") ) {
        globals.shared.cameraPosition.x -= 5;
    }
    else if ( keyboard.pressed("h") ) {
        globals.shared.cameraPosition.x += 5;
    }
    else if ( keyboard.pressed("t") ) {
        globals.shared.cameraPosition.y -= 5;
    }
    else if ( keyboard.pressed("g") ) {
        globals.shared.cameraPosition.y += 5;
    }

    else if ( keyboard.pressed("t") ) {
    		alert(globals.shared.cameraPosition.y);
    }

    if(cssX == 4) {
      server.broadcastCmd('set', { zOffSet: globals.shared.zOffSet });
      server.broadcastCmd('set', { leftOffSet: globals.shared.leftOffSet });
      server.broadcastCmd('set', { rightOffSet: globals.shared.rightOffSet });
      server.broadcastCmd('set', { cameraPosition: {x: camera.position.x, y: camera.position.y, z: camera.position.z }});
      server.broadcastCmd('set', { cameraRotation: {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }});
  	}
  }

  function render() {

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

    camera.rotation.x = globals.shared.cameraRotation.x;
    camera.rotation.y = globals.shared.cameraRotation.y;
    camera.rotation.z = globals.shared.cameraRotation.z;

    camera.updateProjectionMatrix();

    if (globals.shared.useWindowPosition) {
      globals.x = window.screenX;
      globals.y = window.screenY;
    }

    rendererCSS.render( cssScene, camera );

    if(videos[0] != null){
      if ( videos[0].readyState === videos[0].HAVE_ENOUGH_DATA ) 
      {
        videoImageContexts[0].drawImage( videos[0], 0, 0 );
        if ( videoTextures[0] ) 
          videoTextures[0].needsUpdate = true;
      }
    }

    if(videos[1] != null){
      if ( videos[1].readyState === videos[1].HAVE_ENOUGH_DATA ) 
      {
        videoImageContexts[1].drawImage( videos[1], 0, 0 );
        if ( videoTextures[1] ) 
          videoTextures[1].needsUpdate = true;
      }
    }

    if(videos[2] != null){
      if ( videos[2].readyState === videos[2].HAVE_ENOUGH_DATA ) 
      {
        videoImageContexts[2].drawImage( videos[2], 0, 0 );
        if ( videoTextures[2] ) 
          videoTextures[2].needsUpdate = true;
      }
    }

    renderer.render( scene, camera );

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

  if(cssX == 0){
    var connection = new RTCMultiConnection('1');
    var number = 0;

    connection.onstream = function(e) {
        
        video = e.mediaElement;
        videos.push(video);

        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1024;
        videoImage.height = 735;

        videoImageContext = videoImage.getContext( '2d' );
        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
        videoImageContexts.push(videoImageContext);

        videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTextures.push(videoTexture);

        var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTextures[number], overdraw: true, side:THREE.DoubleSide } );
        // the geometry on which the movie will be displayed;
        //    movie image will be scaled to fit these dimensions.
        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        
        if(number == 0) {
          movieScreen.position.set(-120,700,600);
          movieScreen.rotation.set(0,Math.PI*0.5,0);
        }
        else if(number == 1){
          movieScreen.position.set(0,700,480);
        }
        else if(number == 2){
          movieScreen.position.set(120,700,600);
          movieScreen.rotation.set(0,-Math.PI*0.5,0);
        }

        scene.add(movieScreen);
        number ++;
    };

    connection.connect();
  }

  else if(cssX == 9){
    var connection = new RTCMultiConnection('1');
    var number = 0;

    connection.onstream = function(e) {
        
        video = e.mediaElement;
        videos.push(video);

        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1024;
        videoImage.height = 735;

        videoImageContext = videoImage.getContext( '2d' );
        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
        videoImageContexts.push(videoImageContext);

        videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTextures.push(videoTexture);

        var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTextures[number], overdraw: true, side:THREE.DoubleSide } );
        // the geometry on which the movie will be displayed;
        //    movie image will be scaled to fit these dimensions.
        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        
        if(number == 0) {
          movieScreen.position.set(-120,700,600);
          movieScreen.rotation.set(0,Math.PI*0.5,0);
        }
        else if(number == 1){
          movieScreen.position.set(0,700,480);
        }
        else if(number == 2){
          movieScreen.position.set(120,700,600);
          movieScreen.rotation.set(0,-Math.PI*0.5,0);
        }

        scene.add(movieScreen);
        number ++;
    };

    connection.connect();
  }

  else if(cssX == 4){

    var btnCapture1stScreen = document.getElementById("btnCapture1stScreen");
    var btnCapture2ndScreen = document.getElementById("btnCapture2ndScreen");
    var btnCapture3rdScreen = document.getElementById("btnCapture3rdScreen");
    var btnStartRoom = document.getElementById("btnStartRoom");

    btnCapture1stScreen.style.display = 'block';
    btnCapture2ndScreen.style.display = 'block';
    btnCapture3rdScreen.style.display = 'block';
    btnStartRoom.style.display = 'block';

    var connection = new RTCMultiConnection('1');
    connection.session = {
        video: false,
        audio: false
    };

    connection.connect();

    function captureScreen(callback) {

        getScreenId(function (error, sourceId, screen_constraints) {
            navigator.webkitGetUserMedia(screen_constraints, function (stream) {

                callback(stream);

                video = document.createElement("video");
                video.src = webkitURL.createObjectURL(stream);
                
                video.play();
                document.body.appendChild( video );
                videos.push(video);


            }, function (error) {
                console.error(error);
            });
        });
    }

    btnCapture1stScreen.onclick = function () {
        captureScreen(function (stream) {
            connection.attachStreams.push(stream);
        });

        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1024;
        videoImage.height = 735;

        videoImageContext = videoImage.getContext( '2d' );
        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
        videoImageContexts.push(videoImageContext);

        videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTextures.push(videoTexture);
        
        var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTextures[0], overdraw: true, side:THREE.DoubleSide } );
        // the geometry on which the movie will be displayed;
        //    movie image will be scaled to fit these dimensions.
        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        movieScreen.position.set(-120,700,600);
        movieScreen.rotation.set(0,Math.PI*0.5,0);
        scene.add(movieScreen);
    };

    btnCapture2ndScreen.onclick = function () {
        captureScreen(function (stream) {
            connection.attachStreams.push(stream);
        });
        
        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1024;
        videoImage.height = 735;

        videoImageContext = videoImage.getContext( '2d' );
        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
        videoImageContexts.push(videoImageContext);

        videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTextures.push(videoTexture);

        var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTextures[1], overdraw: true, side:THREE.DoubleSide } );
        // the geometry on which the movie will be displayed;
        //    movie image will be scaled to fit these dimensions.
        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        movieScreen.position.set(0,700,480);
        scene.add(movieScreen);
    };

    btnCapture3rdScreen.onclick = function () {
        captureScreen(function (stream) {
            connection.attachStreams.push(stream);
        });
        
        videoImage = document.createElement( 'canvas' );
        videoImage.width = 1024;
        videoImage.height = 735;

        videoImageContext = videoImage.getContext( '2d' );
        // background color if no video present
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
        videoImageContexts.push(videoImageContext);

        videoTexture = new THREE.Texture( videoImage );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTextures.push(videoTexture);

        var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTextures[2], overdraw: true, side:THREE.DoubleSide } );
        // the geometry on which the movie will be displayed;
        //    movie image will be scaled to fit these dimensions.
        var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
        var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
        movieScreen.position.set(120,700,600);
        movieScreen.rotation.set(0,-Math.PI*0.5,0);
        scene.add(movieScreen);
    };

    btnStartRoom.onclick = function () {
        connection.dontCaptureUserMedia = true;
        connection.open();
    };
  }

  var floorTexture = new THREE.ImageUtils.loadTexture( 'metalFloor.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(240, 240, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0,650,600);
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  
  camera.position.set(0,500,800);
  // camera.lookAt(movieScreen.position);
  
  render();
};

requirejs.config({waitSeconds: 0});

requirejs(
  [ 'gameserver',
    'gameclient',

    'three',
    'misc',
    
    'CSS3DRenderer',
    'THREEx.KeyboardState',

    'MTLLoader',
    'OBJMTLLoader',
  ],
  main
);
});
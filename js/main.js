/* globals define*/
define(function( require ) {
  'use strict';

  var Game    = require( 'game' ),
      Level   = require( 'level' ),
      Circle  = require( 'geometry/circle' ),
      Rect    = require( 'geometry/rect' ),
      Polygon = require( 'geometry/polygon'),
      Player  = require( 'entities/player' );

  var PhysicsEntity = require( 'entities/physics-entity' );

  var Emitter = require( 'entities/emitter' );
  var TractorBeam = require( 'entities/tractor-beam' );

  var game = Game.instance = new Game();
  game.level = new Level();
  game.level.fill.set({
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1.0
  });

  // Circle.
  var circleEntity = new PhysicsEntity();

  var circle = new Circle( 100, 200, 50 );
  circle.fill.alpha = 0.5;

  circleEntity.add( circle );
  game.add( circleEntity );

  // Rect.
  var rectEntity = new PhysicsEntity( 300, 150 );

  var rect = new Rect( 0, 0, 50, 100 );
  rect.fill.alpha = 0.5;

  rectEntity.add( rect );
  game.add( rectEntity );

  var rectInterval = setInterval(function() {
    rectEntity.x -= 4;
    rectEntity.rotation += 10 * Math.PI / 180;
    polyEntity.rotation += 2 * Math.PI / 180;
  }, 16 );

  setTimeout(function() {
    clearInterval( rectInterval );
  }, 600 );

  // Polygon.
  var polyEntity = new PhysicsEntity( 500, 350 );

  var polygon = new Polygon( 50, 0 );
  polygon.vertices = [ -100, 50, 100, 50, 0, -100 ];
  polygon.fill.alpha = 0.5;

  polyEntity.add( polygon );
  game.add( polyEntity );

  // Tractor beam.
  var tractorBeam = new TractorBeam( 200, 300, 50 );
  tractorBeam.distance = 200;
  tractorBeam.force = 1200;
  game.add( tractorBeam );

  // Factory test.
  var GeometryFactory = require( 'geometry/geometry-factory' );
  var polygonClone =  GeometryFactory.create( JSON.stringify( polygon ) );
  if ( JSON.stringify( polygon ) !== JSON.stringify( polygonClone ) ) {
    console.log( 'GeometryFactory clone failed.' );
  }

  // Emitter.
  var emitter = new Emitter( 200, 100 );
  var emitterPolygon = new Polygon( 0, 0 );
  emitterPolygon.vertices = [ -2, -2, -2, 2, 2, 2, 2, -2 ];
  emitterPolygon.stroke.set({
    red: 255,
    alpha: 1
  });
  emitter.rate = 500;
  emitter.lifeTime = 1000;
  emitter.speed = 200;
  emitter.rotation = -0.5 * Math.PI;
  emitter.particle = emitterPolygon;
  emitter.world = game;
  emitter.start( 1000 );

  // Player.
  game.player = new Player( 200, 200 );
  game.player.world = game;
  game.player.add( new Circle( 0, 0, 20 ) );
  game.player.shapes[0].fill.alpha = 0.5;

  game.player.set({
    vx: 50,
    vy: 100
  });

  game.add( game.player );

  game.camera.target = game.player;

  game.element.classList.add( 'game' );
  document.body.insertBefore( game.element, document.body.firstChild );

  // Setup input.
  var input = game.input;

  document.addEventListener( 'keydown', input.onKeyDown.bind( input ) );
  document.addEventListener( 'keyup', input.onKeyUp.bind( input ) );

  if ( typeof window.ontouchstart !== 'undefined' ) {
    game.canvas.addEventListener( 'touchstart', input.onTouchStart.bind( input ) );
    game.canvas.addEventListener( 'touchmove', input.onTouchMove.bind( input ) );
    game.canvas.addEventListener( 'touchend', input.onTouchEnd.bind( input ) );
  }

  // Start game.
  game.tick();

  // Add a checkbox to toggle continuous rendering,
  var runCheckbox = document.getElementById( 'run-checkbox' );
  function play() {
    game.running = true;
    game.tick();
    runCheckbox.checked = true;
  }

  function pause() {
    game.running = false;
    runCheckbox.checked = false;
  }

  function toggleContinuousRendering() {
    if ( !runCheckbox.checked ) {
      play();
    } else {
      pause();
    }
  }

  runCheckbox.addEventListener( 'click', function() {
    // Hacky. Since play() and pause() change the checked state, we need to
    // toggle the checkbox state to back before it was clicked.
    runCheckbox.checked = !runCheckbox.checked;
    toggleContinuousRendering();
  });

  document.addEventListener( 'keydown', function( event ) {
    // R.
    if ( event.which === 82 ) {
      toggleContinuousRendering( event );
    }
  });

  window.addEventListener( 'blur', pause );

  setTimeout(function() {
    game.running = false;
  }, 500 );
});

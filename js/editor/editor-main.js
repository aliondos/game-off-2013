/*globals requirejs, define*/
requirejs.config({
  baseUrl: '../js'
});

define(function( require ) {
  'use strict';

  var Polygon = require( 'geometry/polygon' );
  var Editor = require( 'editor/editor' );


  var editor = new Editor({
    el: '#editor',
    scaleEl: '#scale',
    historyEl: '#history'
  });

  document.addEventListener( 'keydown', editor.onKeyDown.bind( editor ) );
  document.addEventListener( 'keyup', editor.onKeyUp.bind( editor ) );

  var polygon = new Polygon();
  polygon.vertices = [ 100, 50, -100, 50, 0, -100 ];
  polygon.angle = 0.5 * Math.PI;
  editor.add( polygon );
  editor.draw();

  var loadBtn = document.getElementById( 'load-btn' );
  loadBtn.addEventListener( 'click', editor.loadSelected.bind( editor ) );

  var removeBtn = document.getElementById( 'remove-btn' );
  removeBtn.addEventListener( 'click', editor.removeSelected.bind( editor ) );

  var clearBtn = document.getElementById( 'clear-history-btn' );
  clearBtn.addEventListener( 'click', editor.clearHistory.bind( editor ) );
});

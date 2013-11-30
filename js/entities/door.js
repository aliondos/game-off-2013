/*globals define*/
define([
  'entities/physics-entity',
  'utils'
], function( PhysicsEntity, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var defaults = {
    // Animation duration.
    duration: 0.3
  };

  function Door( x, y, radius ) {
    this.radius = radius || 0;

    PhysicsEntity.call( this, {
      shape: 'circle',
      radius: this.radius,
      fixture: {
        isSensor: true
      },
      body: {
        position: {
          x: x,
          y: y
        }
      }
    });

    Utils.defaults( this, defaults );

    this.open = false;
    this.trigger = null;
    this.player = null;

    // Animation time.
    this.time = 0;
  }

  Door.prototype = new PhysicsEntity();
  Door.prototype.constructor = Door;

  Door.prototype.update = function( dt ) {
    PhysicsEntity.prototype.update.call( this, dt );

    if ( !this.open && this.trigger.active ) {
      this.open = true;
    }

    // Handle open animation.
    if ( this.open && this.time < this.duration ) {
      this.time += dt;
    }

    if ( this.open && this.player ) {
      this.player.x = this.x;
      this.player.y = this.y;
    }
  };

  Door.prototype.drawPath = function( ctx ) {
    var radius = this.radius;

    // Draw background.
    ctx.beginPath();
    ctx.arc( 0, 0, radius, 0, PI2 );
    ctx.fillStyle = '#000';
    ctx.fill();

    // Calculate opening.
    var t = this.time / this.duration;

    // Only draw doors if not fully open.
    if ( 1 - t ) {
      var opening = t * radius;

      ctx.save();
      ctx.clip();

      ctx.beginPath();
      // Left door.
      ctx.rect( -radius - opening, -radius, radius, 2 * radius );
      // Right door.
      ctx.rect( opening, -radius, radius, 2 * radius );

      ctx.fillStyle = '#fff';
      ctx.fill();

      // Borders.
      ctx.lineWidth = radius * 0.1;
      ctx.strokeStyle = '#222';
      ctx.stroke();

      ctx.restore();
    }

    // Draw door outline.
    ctx.beginPath();
    ctx.arc( 0, 0, radius, 0, PI2 );

    ctx.lineWidth = radius * 0.2;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc( 0, 0, radius * 1.2, 0, PI2 );
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.beginPath();

    PhysicsEntity.prototype.drawPath.call( this, ctx );
  };

  return Door;
});

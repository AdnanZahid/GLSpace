"use strict";

define(function() {

  var emptyMsg = {};

  var NetPlayer = function(server, id) {
    this.server = server;
    this.id = id;
    this.eventHandlers = { };
  };

  NetPlayer.prototype.sendCmd = function(cmd, msg) {
    if (msg === undefined) {
      msg = emptyMsg;
    }
    this.server.sendCmd("client", this.id, {cmd: cmd, data: msg});
  };

  NetPlayer.prototype.addEventListener = function(eventType, handler) {
    this.eventHandlers[eventType] = handler;
  };

  NetPlayer.prototype.removeEventListener = function(eventType) {
    this.eventHandlers[eventType] = undefined;
  };

  NetPlayer.prototype.removeAllListeners = function() {
    this.eventHanders = { };
  };

  NetPlayer.prototype.sendEvent_ = function(eventType, args) {
    var fn = this.eventHandlers[eventType];
    if (fn) {
      fn.apply(this, args);
    } else {
      console.error("Unknown Event: " + eventType);
    }
  };

  return NetPlayer;
});
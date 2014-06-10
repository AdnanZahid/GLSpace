"use strict";

define(function() {
  var SocketIOClient = function() {
    console.log("Using direct Socket.io");
    var _socket;

    if (!window.io) {
      console.log("no socket io");
      _socket = {
        send: function() { }
      };
      return;
    }

    var url = "http://" + window.location.host;
    console.log("connecting to: " + url);
    _socket = io.connect(url);

    this.__defineGetter__("readyState", function() {
      return _socket.readyState;
    });

    this.on = function(eventName, fn) {
      _socket.on(eventName, fn);
    };

    this.send = function(msg) {
      _socket.emit('message', msg);
    };
  };

  var WebSocketClient = function() {
    console.log("Using direct WebSocket");
    var _socket;

    var url = "ws://" + window.location.host;
    console.log("connecting to: " + url);
    _socket = new WebSocket(url);

    this.__defineGetter__("readyState", function() {
      return _socket.readyState;
    });

    this.on = function(eventName, fn) {
      switch (eventName) {
      case 'connect':
        _socket.onopen = fn;
        break;
      case 'disconnect':
        _socket.onclose = fn;
        break;
      case 'error':
        _socket.onerror = fn;
        break;
      case 'message':
        _socket.onmessage = function(event) {
          fn(JSON.parse(event.data));
        };
        break;
      }
    };

    this.send = function(msg) {
      if (_socket.readyState == WebSocket.OPEN) {
        _socket.send(JSON.stringify(msg));
      }
    };
  };

  return WebSocketClient;
});
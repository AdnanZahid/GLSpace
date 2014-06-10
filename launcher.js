"use strict";

window.launch = function(opt) {
  opt = opt || {};

  var numWindows = 3;

  var width  = window.screen.availWidth / (numWindows + 0.035);
  var height = window.screen.availHeight / 3*2.9;

  var settings = {
    shared: {
      fullWidth:  width * numWindows,
      fullHeight: height,
      useWindowPosition: opt.useWindowPosition,
    },
  };

  var options = {
    resizeable: 1,
    scrollbars: 1,
    menubar: 1,
    toolbar: 1,
    location: 1,
    width: width,
    height: height,
  };

  if (opt.useWindowPosition) {
    settings.shared.fullWidth = window.screen.availWidth;
    settings.shared.fullHeight = window.screen.availHeight;
  }

  var middle = numWindows / 2 | 0;
  var windows = [];
  for (var ii = 0; ii < numWindows; ++ii) {
    options.left = window.screen.availLeft + ii * width;
    options.top  = window.screen.availTop;

    if (!opt.useWindowPosition) {
      settings.x = ii * width;
      settings.y = 0;
    }

    settings.server = ii == middle ? true : undefined;

    windows.push({
      url: "syncThreeJS.html?settings=" + JSON.stringify(settings).replace(/"/g, ""),
      title: "view " + ii,
      windowOptions: JSON.stringify(options).replace(/[{}"]/g, "").replace(/\:/g,"="),
    })
  }

  var last = windows.splice(middle, 1);
  windows = windows.concat(last);

  windows.forEach(function(w) {
    window.open(w.url, w.title, w.windowOptions);
  });

};
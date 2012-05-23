// Imports
var pageMod = require("page-mod");
var data = require("self").data;
var ss = require("simple-storage");

// Create our page modification on demand
var createMods = function () {
  var pageMods = pageMod.PageMod({
    include: "*",
    contentScriptFile: [
      data.url("src/util.js"),
      data.url("lib/sjcl.js"),
      data.url("lib/jquery-1.7.2.min.js"),
      data.url("lib/jcade.js"),
      data.url("lib/jquery.sparkline.min.js"),
      data.url("src/hashmask.js"),
      data.url("src/inject.js")
    ],
    onAttach: function (worker) {
      // Whenever a page mod requests settings, parrot back all of them
      worker.port.on("getSettings", function () {
        worker.port.emit("getSettings", {
          salt: ss.storage.salt,
          hash: ss.storage.hash,
          delay: ss.storage.delay
        });
      });
    }
  });

  console.log("Page mods done, main.js work complete.");
};

var doLog = function (str) {
  console.log(str);
}

// Conditionally inject page mods; if we have already have settings, do it
//  right away.
// Otherwise, let a page worker generate them and wait until it's done
if (typeof ss.storage.salt === "undefined") {
  console.log("Making page worker for settings.");

  // Call empty page with generator.js, wait for response before injecting
  var pageWorker = require("page-worker").Page({
    contentScriptFile: [
      data.url("lib/sjcl.js"),
      data.url("src/generator.js")
    ]
  });
  pageWorker.port.on("setSettings", function (settings) {
    ss.storage.salt = settings.salt;
    ss.storage.hash = settings.hash;
    ss.storage.delay = settings.delay;

    // Cleanup our page worker, it only had one purpose
    pageWorker.destroy();
    
    console.log("Settings initialized, making page mods.");
    
    createMods();
  });

  console.log("Done making page worker for settings.");

} else {
  console.log("Settings are already ready, making page mods.");
  createMods();
}
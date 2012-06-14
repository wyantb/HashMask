
// Enter the defaults for salt and hash, if none exist
if (localStorage.salt == undefined) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  localStorage.salt = salt;
}
if (localStorage.hash == undefined) localStorage.hash = "sha256";
if (localStorage.delay == undefined) localStorage.delay = 200;
if (localStorage.enabled == undefined) localStorage.enabled = true;

var connections = [];

// Setup long-lived connection listener
// Handles logic for HashMask setup on pages and browser_actions
chrome.extension.onConnect.addListener(function (port) {
  console.log("HashMask received connection");
  console.log(port);

  connections.push(port);

  console.log("Current connections:");
  console.log(connections);

  // Post initial settings batch to the new content script
  port.postMessage({
    eventName: "settings",
    settings: {
      salt: localStorage.salt,
      hash: localStorage.hash,
      delay: localStorage.delay,
      enabled: localStorage.enabled
    }
  });

  if (localStorage.enabled === "true") {
    port.postMessage({eventName: "enable"});
  } else {
    port.postMessage({eventName: "disable"});
  }

  port.onMessage.addListener(function (msg) {
    // Handle enabling and disabling events
    if (msg.eventName === "enable") {
      localStorage.enabled = "true";
    } else if (msg.eventName === "disable") {
      localStorage.enabled = "false";
    }

    if (msg.eventName === "enable" ||
        msg.eventName === "disable") {

      // Parrot the original message to all active connections
      for (var i = 0; i < connections.length; i++) {
        connections[i].postMessage(msg);
      }

    }
  });

  port.onDisconnect.addListener(function () {
    console.log("Connection disconnected; removing");
    console.log(port);

    var index = connections.indexOf(port);
    if (index !== -1) {
      connections.splice(index, index + 1);
    }
  });
});

chrome.extension.onRequest.addListener(function (data, sender, callback) {
  console.log("Background page received simple event.");
  console.log(data);

  // TODO use for updating settings from options page?
}

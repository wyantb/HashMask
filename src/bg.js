
/*global chrome, sjcl */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * sjcl.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

'use strict';

// Enter the defaults for salt and hash, if none exist
if (localStorage.salt == null) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  localStorage.salt = salt;
}
if (localStorage.hash == null) {
  localStorage.hash = 'sha256';
}
if (localStorage.delay == null) {
  localStorage.delay = 200;
}
if (localStorage.enabled == null) {
  localStorage.enabled = true;
}

// A pool of all active, long-lived connections
var connections = [];

// A helper to send the current settings to a connection
var postSettings = function (port) {
  port.postMessage({
    eventName: 'settings',
    settings: {
      salt: localStorage.salt,
      hash: localStorage.hash,
      delay: localStorage.delay,
      enabled: localStorage.enabled
    }
  });
};

// Setup long-lived connection listener
// Handles logic for HashMask setup on pages and browser_actions
chrome.extension.onConnect.addListener(function (port) {
  connections.push(port);

  // Post initial settings batch to the new content script
  postSettings(port);

  port.onMessage.addListener(function (msg) {
    // Handle enabling and disabling events
    if (msg.eventName === 'enable') {
      localStorage.enabled = 'true';
    } else if (msg.eventName === 'disable') {
      localStorage.enabled = 'false';
    }

    if (msg.eventName === 'enable' ||
        msg.eventName === 'disable') {

      // Parrot the original message to all active connections
      for (var i = 0; i < connections.length; i++) {
        connections[i].postMessage(msg);
      }

    }
  });

  port.onDisconnect.addListener(function () {
    var index = connections.indexOf(port);
    if (index !== -1) {
      connections.splice(index, index + 1);
    }
  });
});

// Hook to receive notifications from settings page of changes
chrome.extension.onRequest.addListener(function (data, sender, callback) {
  // Send updated settings to all attached ports
  if (data.eventName === 'settings') {
    for (var i = 0; i < connections.length; i++) {
      postSettings(connections[i]);
    }
  }
});

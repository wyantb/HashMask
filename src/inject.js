/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery-1.7.2.js
 * jquery.sparkline.js
 * jcade.js
 * hashmask.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

var hashSettings = {};

var port = chrome.extension.connect({name: "hashmask"});

var makeHashMask = function () {
  // Alternative method to inject hashmask: use jcade, do it for current and future password fields
  $(document).create("input[type=password]", function (ev) {
    $(ev.target).hashmask(hashSettings);
  });
};

port.onMessage.addListener(function (msg) {
  console.log("HashMask received message");
  console.log(msg);

  if (msg.eventName === "settings") {
    // Update with new settings
    hashSettings.hashUsed = msg.settings.hash;
    hashSettings.hashFunction = $.hashmask.hashAlgorithms[msg.settings.hash];
    hashSettings.salt = msg.settings.salt;
    hashSettings.sparkInterval = msg.settings.delay;

  } else if (msg.eventName === "enable") {
    // Enable hashmask for this tab
    makeHashMask();

  } else if (msg.eventName === "disable") {
    // Disable hashmask for this page
    $(".hashmask-sparkline").remove();

  }
});

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery-1.7.2.js
 * bootstrap.js
 * src/inject.js (and its requirements)
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

var port = chrome.extension.connect({name: "hashmask-popup"});

var doDisable = function () {
  console.log("HashMask - Disabling");
  $("#btn-on").hide();
  $("#btn-off").show();
};

var doEnable = function () {
  console.log("HashMask - Enabling");
  $("#btn-on").show();
  $("#btn-off").hide();
};

port.onMessage.addListener(function (msg) {
  console.log("HashMask received message");
  console.log(msg);

  if (msg.eventName === "settings") {
    if (msg.settings.enabled === "true") {
      doEnable();
    } else {
      doDisable();
    }
  } else if (msg.eventName === "enable") {
    doEnable();
  } else if (msg.eventName === "disable") {
    doDisable();
  }

});

$("#btn-on").click(function (ev) {
  doDisable();
  port.postMessage({eventName: "disable"});
});

$("#btn-off").click(function (ev) {
  doEnable();
  port.postMessage({eventName: "enable"});
});

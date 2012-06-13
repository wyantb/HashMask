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

$("#btn-on").click(function (ev) {
  console.log("HashMask - Disabling");
  $("#btn-on").hide();
  $("#btn-off").show();
  chrome.extension.sendRequest({eventName: "disable"});
});

$("#btn-off").click(function (ev) {
  console.log("HashMask - Enabling");
  $("#btn-on").show();
  $("#btn-off").hide();
  chrome.extension.sendRequest({eventName: "enable"});
});

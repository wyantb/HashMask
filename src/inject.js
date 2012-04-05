/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery-1.7.1.js
 * jquery.sparkline.js
 * hashmask.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

if (typeof chrome !== "undefined" && 
    typeof chrome.extension !== "undefined" && 
    typeof chrome.extension.sendRequest !== "undefined") {

  // Send a request to our BG page for all settings before injecting hashmask
  chrome.extension.sendRequest({eventName: "settings"}, function (result) {
  
    // Update hash algorithm about to be used by hashmask
    $.hashmask.settings.hashUsed = result.hash;
    $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[result.hash];
    $.hashmask.settings.salt = result.salt;
  
    // Alternative method to inject hashmask: use jcade, do it for current and future password fields
    $(document).create("input[type=password]", function (ev) {
      $(ev.target).hashmask();
    });
  
  });
} 

// Should only occur when inject isn't in Chrome extension
else {
  if (localStorage.salt == undefined) localStorage.salt = "#e" + Math.random();
  if (localStorage.hash == undefined) localStorage.hash = "sha256";
  $.hashmask.settings.salt = localStorage.salt;
  $.hashmask.settings.hashUsed = localStorage.hash;
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms["sha256"];
  
  $("input[type=password]").hashmask();
}


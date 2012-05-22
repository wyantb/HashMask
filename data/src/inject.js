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

if (typeof chrome !== "undefined" && 
    typeof chrome.extension !== "undefined" && 
    typeof chrome.extension.sendRequest !== "undefined") {

    // Update hash algorithm about to be used by hashmask
    $.hashmask.settings.hashUsed = ss.storage.hash;
    $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[ss.storage.hash];
    $.hashmask.settings.salt = ss.storage.salt;
    $.hashmask.settings.sparkInterval = ss.storage.delay;
  
    // Alternative method to inject hashmask: use jcade, do it for current and future password fields
    $(document).create("input[type=password]", function (ev) {
      $(ev.target).hashmask();
    });
  
} 

// Should only occur when inject isn't in Chrome extension
else {
  if (ss.storage.salt == undefined) {
    var randomWords = sjcl.random.randomWords(6, 0);
    var salt = sjcl.codec.base64.fromBits(randomWords);
    ss.storage.salt = salt;
  }
  if (ss.storage.hash == undefined) ss.storage.hash = "sha256";
  if (ss.storage.delay == undefined) ss.storage.delay = 200;
  $.hashmask.settings.salt = ss.storage.salt;
  $.hashmask.settings.hashUsed = ss.storage.hash;
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms["sha256"];
  $.hashmask.settings.sparkInterval = ss.storage.delay;
  
  $("input[type=password]").hashmask();
}


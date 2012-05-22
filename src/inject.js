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

self.port.on("getSettings", function (settings) {
  // Update hash algorithm about to be used by hashmask
  $.hashmask.settings.hashUsed = settings.hash;
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[ss.storage.hash];
  $.hashmask.settings.salt = settings.salt;
  $.hashmask.settings.sparkInterval = settings.delay;

  // Alternative method to inject hashmask: use jcade, do it for current and future password fields
  $(document).create("input[type=password]", function (ev) {
    $(ev.target).hashmask();
  });
});

self.port.emit("getSettings", {});
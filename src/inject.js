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

// Send a request to our BG page for all settings before injecting hashmask
var makeHashMask = function () {
  chrome.extension.sendRequest({eventName: "settings"}, function (result) {
  
    // Update hash algorithm about to be used by hashmask
    var hashSettings = { 
      hashUsed: result.hash,
      hashFunction: $.hashmask.hashAlgorithms[result.hash],
      salt: result.salt,
      sparkInterval: result.delay
    };
  
    // Alternative method to inject hashmask: use jcade, do it for current and future password fields
    if (result.enabled === "true") {
      $(document).create("input[type=password]", function (ev) {
        $(ev.target).hashmask(hashSettings);
      });
    }
  
  });
};

makeHashMask();

chrome.extension.onRequest.addListener(function (data, sender, callback) {
  console.log("HashMask received event");
  console.log(data);
  if (data.eventName === "disable") {
    $(".hashmask-sparkline").remove();
  } else if (data.eventName === "enable") {
    makeHashMask();
  }
});

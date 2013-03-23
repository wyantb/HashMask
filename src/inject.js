
// TODO remove, kinda unsafe?
/*global $: true, chrome: true */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery.js
 * jquery.sparkline.js
 * hashmask.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

'use strict';

var hashSettings = {};

var port = chrome.extension.connect({name: 'hashmask-inject'});

var makeHashMask = function () {
  // Alternative method to inject hashmask: use jcade, do it for current and future password fields
  $(document).create('input[type=password]', function (ev) {
    $(ev.target).hashmask(hashSettings);
  });
};

port.onMessage.addListener(function (msg) {
  if (msg.eventName === 'settings') {
    // Update with new settings
    hashSettings.hashUsed = msg.settings.hash;
    hashSettings.hashFunction = $.hashmask.hashAlgorithms[msg.settings.hash];
    hashSettings.salt = msg.settings.salt;
    hashSettings.sparkInterval = msg.settings.delay;

    // And (re?)-make hashmask, if necessary
    $('.hashmask-sparkline').remove();
    if (msg.settings.enabled === 'true') {
      makeHashMask();
    }

  } else if (msg.eventName === 'enable') {
    // Enable hashmask for this tab
    makeHashMask();

  } else if (msg.eventName === 'disable') {
    // Disable hashmask for this page
    $('.hashmask-sparkline').remove();

  }
});

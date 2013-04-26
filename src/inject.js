
/*global $, chrome */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery.js
 * src/hashmask.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

'use strict';

(function () {
  var port = chrome.extension.connect({name: 'hashmask-inject'});

  port.onMessage.addListener(function (msg) {
    if (msg.eventName === 'settings') {
      $.hashmask.settings.hashUsed = msg.settings.hash;
      $.hashmask.settings.salt = msg.settings.salt;
      $.hashmask.settings.sparkInterval = msg.settings.delay;

      $.hashmask.disable();

      if (msg.settings.enabled) {
        $.hashmask.start();
      }
    }
    else if (msg.eventName === 'enable') {
      $.hashmask.start();
    }
    else if (msg.eventName === 'disable') {
      $.hashmask.disable();
    }
  });
}());


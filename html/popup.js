
/*global jQuery, chrome */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery.js
 * src/inject.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

(function ($) {
  'use strict';

  var port = chrome.extension.connect({name: 'hashmask-popup'});
  var $onButton = $('#btn-on');
  var $offButton = $('#btn-off');

  var doDisable = function () {
    $onButton.hide();
    $offButton.show();
  };

  var doEnable = function () {
    $onButton.show();
    $offButton.hide();
  };

  port.onMessage.addListener(function (msg) {
    if (msg.eventName === 'settings') {
      if (msg.settings.enabled === 'true') {
        doEnable();
      } else {
        doDisable();
      }
    } else if (msg.eventName === 'enable') {
      doEnable();
    } else if (msg.eventName === 'disable') {
      doDisable();
    }

  });

  $onButton.click(function (ev) {
    doDisable();
    port.postMessage({eventName: 'disable'});
  });

  $offButton.click(function (ev) {
    doEnable();
    port.postMessage({eventName: 'enable'});
  });

}( jQuery ));

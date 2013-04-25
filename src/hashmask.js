
/*jshint camelcase: false */
/*global jQuery, SHA1, hex_rmd160, SHA256, Whirlpool */

/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * jQuery.hashmask.js originally written by Chris Dary <umbrae@gmail.com>
 * All credit for anything hard goes to him!
 * His accredation can be seen below.
 *
 * REQUIRES:
 * jquery.js
 * jquery.sparkline.js
 * lib/hashes.js
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

/**
 * HashMask - a new approach to password masking security.
 *
 * @author    Chris Dary <umbrae@gmail.com>
 * @copyright Copyright (c) 2009 {@link http://arc90.com Arc90 Inc.}
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
 */

(function ($) {
  'use strict';

  var $body = $('body');

  $.hashmask = {

    hashAlgorithms: {
      'sha1': SHA1,
      'ripemd160': hex_rmd160,
      'sha256': SHA256,
      'whirlpool': Whirlpool
    },

    settings: {
      passwordSelector: 'input[type=password]',
      hashUsed:         'sha1',
      alwaysShow:       false,
      useColorAsHint:   true,
      sparkInterval:    0,

      sparklineOptions: {
        width:           '100px',
        height:          'auto',
        lineColor:       '#69C',
        spotColor:       false,
        minSpotColor:    false,
        maxSpotColor:    false,
        disableInteraction: true,
        disableTooltips:    true,
        disableHighlight:   true
      }
    }
  };

  $.hashmask.start = function (settings) {
    settings = $.extend({}, $.hashmask.settings, settings);

    var hashFunction = $.hashmask.hashAlgorithms[settings.hashUsed];

    var updateDivVis = function ($node, $sparkline) {
      if ($node.is(':focus')) {
        $sparkline.css('visibility', 'visible');
      } else {
        $sparkline.css('visibility', settings.alwaysShow ? 'visible' : 'none');
      }
    };

    var sparkTimeout = '';
    var makeHashDiv = function ($node, $sparkline) {
      $sparkline.css('visibility', 'hidden');

      window.clearTimeout(sparkTimeout);

      var inputVal = $node.val();
      if (inputVal === '') {
        $sparkline.html('');
        return;
      }

      var input        = $node.val();
      var salt         = settings.salt;
      var hash         = hashFunction(salt + input);
      var inputHexArr  = hash.split('');
      var inputDecArr  = [];

      /* Convert our hex string array into decimal numbers for sparkline consumption
         But select only the first 24 parts of the output */
      for (var i = 0; i < 24 && i < inputHexArr.length; i++) {
        inputDecArr.push(parseInt(inputHexArr[i], 16));
      }

      var fillColor = '#' + hash.substr(0, 6);

      sparkTimeout = window.setTimeout(function () {
          updateDivVis($node, $sparkline);

          var dimension = updateDivPos($node, $sparkline);
          $sparkline.sparkline(inputDecArr,
            $.extend(settings.sparklineOptions, {
              height: dimension[0],
              width: dimension[1],
              fillColor: fillColor
            })
          );
        }, settings.sparkInterval);
    };

    var updateDivPos = function ($node, $sparkline) {
      // Compute the height
      var height = $node.outerHeight() - 5 -
        parseInt($node.css('borderBottomWidth'), 10) -
        parseInt($node.css('borderTopWidth'), 10);

      // Compute the width
      var width = $node.outerWidth();

      // But keep it in the range of 50-100
      width = Math.min(100, width / 2);
      width = Math.max(50, width);

      // And configure the sparkline location accordingly
      $sparkline.css({
        position:    'absolute',
        top:         $node.offset().top + 2.5 +
                        parseInt($node.css('borderTopWidth'), 10),

        left:        $node.offset().left +
                        $node.outerWidth() -
                        parseInt($node.css('borderRightWidth'), 10) -
                        width,

        width:       width,
        height:      height,
        'z-index':   9001
      });

      return [height, width];
    };

    function isDefined (val) {
      return val != null && val !== '';
    }

    function removeMask (ev, $node) {
      ev.preventDefault();
      ev.stopPropagation();
      $activeSparkline.remove();
      $activeSparkline = false;
    }

    var passwordSel = settings.passwordSelector;
    var $activeSparkline = false;

    function makeSparkline($node) {
      $activeSparkline = $('<div class="hashmask-sparkline"></div>');
      $activeSparkline.data('parent', $node);
      $activeSparkline.data('val', $node.val());

      $activeSparkline.on('mousedown click focus', 'canvas', function (inEv) {
        removeMask(inEv, $node, $activeSparkline);
      });

      $body.append($activeSparkline);

      if (isDefined($node.val())) {
        makeHashDiv($node, $activeSparkline);
      }
    }

    $body.on('keyup.hashmask-keyup-listener', passwordSel, function (ev) {
      var $node = $(this);

      if ($activeSparkline) {
        var val = $node.val();

        if (val !== $activeSparkline.data('val')) {
          $activeSparkline.data('val', val);
          makeHashDiv($node, $activeSparkline);
        }
      }
      else {
        makeSparkline($node);
      }
    });

    $body.on('focus.hashmask-focus-listener', passwordSel, function (ev) {
      $body.find('.hashmask-sparkline').remove();
      makeSparkline($(this));
    });

    $body.on('blur.hashmask-blur-listener', passwordSel, function (ev) {
      if (!settings.alwaysShow && $activeSparkline) {
        $activeSparkline.remove();
        $activeSparkline = false;
      }
    });

    $(window).resize(function () {
      if ($activeSparkline) {
        updateDivPos($activeSparkline.data('parent'), $activeSparkline);
      }
    });
  };

  $.hashmask.disable = function () {
    $body
      .off('keyup.hashmask-keyup-listener')
      .off('keyup.hashmask-focus-listener')
      .off('keyup.hashmask-blur-listener')
      .find('.hashmask-sparkline').remove();
  };

})(jQuery);


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

  $.hashmask = {

    hashAlgorithms: {
      'sha1': SHA1,
      'ripemd160': hex_rmd160,
      'sha256': SHA256,
      'whirlpool': Whirlpool
    },

    settings: {

      // These are replaced when any page requests a hashmask
      hashUsed:         'sha1',
      hashFunction:     SHA1,
      // ----------------------------------------------------

      alwaysShow:       false,
      useColorAsHint:   true,
      sparkInterval:    0,
      sparklineOptions: {
        width:          '100px',
        height:         'auto',
        lineColor:      '#69C',
        spotColor:      false,
        minSpotColor:   false,
        maxSpotColor:   false
      }
    }
  };

  $.fn.hashmask = function (settings) {
    settings = $.extend({}, $.hashmask.settings, settings);

    var sparkTimeout = '';

    var updateDivVis = function ($node, $sparkline) {
      if ($node.is(':focus')) {
        $sparkline.css('visibility', 'visible');
      } else {
        $sparkline.css('visibility', settings.alwaysShow ? 'visible' : 'none');
      }
    };

    /** Function to make hashmask */
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
      var hash         = settings.hashFunction(salt + input);
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

    /**
     * Add hashmask hint to an input. The input must be of type password.
     *
     * @param selector string A jquery capable selector, as defined
     *  here: http://docs.jquery.com/Selectors
     *
     * @return void
    **/
    return this.each(function () {
      var $sparkline;
      var $node = $(this);

      // Add sparkline div to the page
      $sparkline = $('<div class="hashmask-sparkline"></div>');
      $('body').append($sparkline);

      // If there's a password on the page already, make a sparkline for it
      if (isDefined($node.val())) {
        makeHashDiv($node, $sparkline);
      }

      // Trigger sparkline refresh on user input
      $node.keyup(function () {
        makeHashDiv($node, $sparkline);
      });

      // Tie sparkline visibility to the focus of the input field
      $node.focusout(function () {
        $sparkline.css('visibility', settings.alwaysShow ? 'visible' : 'hidden');
      });
      $node.focusin(function () {
        $sparkline.css('visibility', 'visible');

        // And anytime we come back into play, refresh the position
        updateDivPos($node, $sparkline);
      });

      // Also force sparkline to dissappear if clicked on
      $sparkline.click(function () {
        $sparkline.css('visibility', 'hidden');
        $node.focus();
        $sparkline.css('visibility', 'hidden');
      });

      // Finally, if the screen size changes, or the pw, we move
      $(window).resize(function () {
        updateDivPos($node, $sparkline);
      });
      $node.resize(function () {
        updateDivPos($node, $sparkline);
      });
    });
  };

})(jQuery);

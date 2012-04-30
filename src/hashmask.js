/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * jQuery.hashmask.js originally written by Chris Dary <umbrae@gmail.com>
 * All credit for anything hard goes to him!
 * We just put it into a browser extension, really.
 *
 * His accredation can be seen below.
 *
 * REQUIRES:
 * jquery.sparkline.js
 * jquery-1.7.1.js
 * util.js (hashing functions)
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

(function($) {
  $.hashmask = {

    hashAlgorithms: {
      "sha1": SHA1,
      "ripemd160": hex_rmd160,
      "sha256": SHA256,
      "whirlpool": Whirlpool 
    },

    settings: {

      // These are replaced when any page requests a hashmask
      hashUsed:         "sha1",
      hashFunction:     SHA1,
      // ----------------------------------------------------

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

  $.fn.hashmask = function(settings) {
    /**
     * @var object Contains an associative array of all settings for hashmask.
    **/
    settings = $.extend({}, $.hashmask.settings, settings);

    sparkTimeout = "";

    /** Function to make hashmask */
    makeHashDiv = function ($this, $sparkline) {
      $sparkline.css("visibility", "hidden");

      window.clearTimeout(sparkTimeout);

      var inputVal = $this.val();
      if(inputVal === "")
      {
        $sparkline.html("");
        return;
      }

      var input        = $this.val();
      var salt         = settings.salt;
      var hash         = settings.hashFunction(salt + input);
      var inputHexArr  = hash.split('');
      var inputDecArr  = [];

      /* Convert our hex string array into decimal numbers for sparkline consumption
         But select only the first 24 parts of the output */
      for(i=0; i < 24 && i < inputHexArr.length; i++)
      {
        inputDecArr.push(parseInt(inputHexArr[i], 16));
      }

      var fillColor = '#' + hash.substr(0,6);
      
      sparkTimeout = window.setTimeout(function() {
          $sparkline.css("visibility", "visible");
          var dimension = updateDivPos($this, $sparkline);
          $sparkline.sparkline(inputDecArr, 
            $.extend( settings.sparklineOptions, {
              height: dimension[0],
              width: dimension[1],
              fillColor: fillColor
            })
          );
      }, settings.sparkInterval);
    };

    updateDivPos = function ($this, $sparkline) {
      var height = $this.outerHeight() - 5 - 
        parseInt($this.css('borderBottomWidth'), 10) - 
        parseInt($this.css('borderTopWidth'), 10);
      var width = $this.outerWidth();
        $this.css('borderLeftWidth'), 10;
        $this.css('borderRightWidth'), 10;

      $sparkline.css({
        position:    'absolute',
        top:         $this.offset().top + 2.5 + 
                        parseInt($this.css('borderTopWidth'), 10),

        left:        $this.offset().left + 
                        $this.outerWidth() - 
                        parseInt($this.css('borderRightWidth'), 10) - 
                        parseInt(settings.sparklineOptions.width, 10),

        width:       Math.min(100, width/2),
        height:      height,
        'z-index':   9001
      });

      return [height, Math.min(100, width/2)];
    };

    /**
     * Add hashmask hint to an input. The input must be of type password.
     *
     * @param selector string A jquery capable selector, as defined 
     *  here: http://docs.jquery.com/Selectors
     *
     * @return void
    **/
    return this.each(function() {
      var $sparkline, i;
      var $this = $(this);

      // Add sparkline div to the page
      $sparkline = $('<div class="hashmask-sparkline"></div>');
      $('body').append($sparkline);

      // If there's a password on the page already, make a sparkline for it
      if ($this.val() != undefined && $this.val != "") {
        makeHashDiv($this, $sparkline);
      }

      // Trigger sparkline refresh on user input
      $this.keyup(function (e) {
        makeHashDiv($this, $sparkline);
      });

      // Tie sparkline visibility to the focus of the input field
      $this.focusout(function (ev) {
        // TODO: parameterize this with args
        $sparkline.css("visibility", "hidden");
      });
      $this.focusin(function (ev) {
        // TODO: parameterize this with args
        $sparkline.css("visibility", "visible");

        // And anytime we come back into play, refresh the position
        updateDivPos($this, $sparkline);
      });
      
      // Also force sparkline to dissappear if clicked on
      $sparkline.click(function (ev) {
        $sparkline.css("visibility", "hidden");
        $this.focus();
        $sparkline.css("visibility", "hidden");
      });

      // Finally, if the screen size changes, or the pw, we move
      $(window).resize(function (ev) {
        updateDivPos($this, $sparkline);
      });
      $this.resize(function (ev) {
        updateDivPos($this, $sparkline);
      });
    });
  };
  
})(jQuery);

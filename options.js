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

$(function () {
  // Place initial salt value into salt input field once DOM is ready
  reload_salt();
  reload_hash();

  $(".hash input").click(function (e) {
    var hash = localStorage.hash = e.target.value;

    // Update hash algorithm about to be used by hashmask
    $.hashmask.settings.hashUsed = hash;
    $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[hash];

    // Refresh the hashmask on the page
    $(".hashmask-sparkline").remove();
    $("input[type=password]").hashmask();
  });
});

var curEx = 1;
var numEx = $(".example").length;
// Stuff for displaying and cycling between examples
function showExample (example) {
  if (typeof(example) === "number") {
    curEx = example;
    $(".example").not("#example-"+example).slideUp(function() {
      $("#example-"+example).slideDown();
    });
    }
  else if (example=="prev") {
    prev_id = $(".example").filter(":visible").attr("id");
    prev_index = (curEx - 1 + numEx) % numEx;
    showExample(prev_index);
  }
  else if (example=="next") {
    next_id = $(".example").filter(":visible").attr("id");
    next_index = (curEx + 1) % numEx;
    showExample(next_index);
  }
  else {
    showExample(0);
  }
}

// Save the user's salt
function save () {
  localStorage.salt = $('#salt-value').val();
  $.hashmask.settings.salt = localStorage.salt;

  // Refresh the hashmask on the page
  $(".hashmask-sparkline").remove();
  $("input[type=password]").hashmask();
}

// Load the user's current salt into the salt input field
function reload_salt () {
  $('#salt-value').val(localStorage.salt);
}

//make a random salt and save it
function rand_salt () {
  $('#salt-value').val("#e" + Math.random());
  save();
}

// Load the user's current hash into a hash radio button
function reload_hash () {
  var hash = localStorage.hash;

  $("#" + hash).click();
};

// Anytime the user changes it, update salt (bad idea by default)
//$('#salt-value').keyup(function (e) {
//  localStorage.salt = $(this).val();
//});

// Show the user's current salt
function show () {
  alert("Stored value: " + localStorage.salt);
}

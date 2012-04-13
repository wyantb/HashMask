/**
 * HashMask - an old approach to password masking, in the browser.
 *
 * REQUIRES:
 * jquery-1.7.2.js
 * bootstrap.js
 * src/inject.js (and its requirements)
 *
 * @author    Society of Software Engineers (http://sse.se.rit.edu)
 * @author    Brian Wyant <wyantb@gmail.com>
 * @license   http://www.opensource.org/licenses/bsd-license.php
 *
**/

var exToShow = 0;

$(function () {
  // Place initial salt value into salt input field once DOM is ready
  reload_salt();
  reload_hash();
  reload_delay();

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

function waitToShow(num) {
  exToShow = num;
}

$("#example-modal").on("shown", function () {
  showExample(exToShow);
});

// Stuff for displaying and cycling between examples
var curEx = 0;
var numEx = $(".example").length;
function showExample (example) {
  // Switch to a specific example
  // (note that the other 3 cases are wrappers for this one)
  if (typeof(example) === "number") {
    console.log("Hiding: " + curEx);
    $("#example-" + curEx).hide(200, function() {
      console.log("Actually showing: " + example);
      $("#example-" + example).slideDown(300);
    });
    console.log("CurEx: " + curEx);
    curEx = example;
    console.log("CurEx: " + curEx);
  }
  // Switch to the previous example
  else if (example=="prev") {
    prev_id = $(".example").filter(":visible").attr("id");
    prev_index = (curEx - 1 + numEx) % numEx;
    showExample(prev_index);
  }
  // Switch to the next example
  else if (example=="next") {
    next_id = $(".example").filter(":visible").attr("id");
    next_index = (curEx + 1) % numEx;
    showExample(next_index);
  }
  // Switch to the first example (fallback)
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

function save_delay () {
  localStorage.delay = +($("#delay-value").val());
  $.hashmask.settings.sparkInterval = localStorage.delay;

  // Refresh the hashmask on the page
  $(".hashmask-sparkline").remove();
  $("input[type=password]").hashmask();
}

function reload_delay () {
  $("#delay-value").val(localStorage.delay + "");
}

function show_delay () {
  alert(localStorage.delay);
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

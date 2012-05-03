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

$(function () {
  // Place initial values into input fields
  $("#" + localStorage.hash).click();
  $("#delay-value").val(localStorage.delay);

  // Except for the salt; not shown until user presses enter
  //reload_salt();

  // Example display
  $(".example-thumb").each(function(index) {
    $(this).click(function() {
      waitToShow(index);
    })
  });
  $("#example-display").click(function() {
    waitToShow(0);
  })
  $(".carousel-control.left").click(function() {
    showExample("prev");
  });
  $(".carousel-control.right").click(function() {
    showExample("next");
  });

  // Change the user's hash
  $(".hash input").click(function (e) {
    var hash = localStorage.hash = e.target.value;

    // Update hash algorithm about to be used by hashmask
    $.hashmask.settings.hashUsed = hash;
    $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[hash];

    // Refresh the hashmask on the page
    $(".hashmask-sparkline").remove();
    $("input[type=password]").hashmask();
  });

  // Make the user's salt field editable
  $(".salt-edit").click( function (ev) {
    $('#salt-value').val(localStorage.salt);
    $('#salt-value').prop("disabled", false);
    $(".salt-edit-group").hide();
    $(".salt-save-group").show();
  });

  // Randomize the user's salt field
  $(".salt-rand").click( function (ev) {
    var randomWords = sjcl.random.randomWords(6, 0);
    var newSalt = sjcl.codec.base64.fromBits(randomWords);
    $('#salt-value').val(newSalt);
    $('#salt-value').prop("disabled", false);
    $(".salt-edit-group").hide();
    $(".salt-save-group").show();
  });

  // Save the user's salt
  $(".salt-save").click( function (ev) {
    localStorage.salt = $('#salt-value').val();
    $('#salt-value').prop("disabled", true);
    $('#salt-value').val("");
    $(".salt-edit-group").show();
    $(".salt-save-group").hide();
    
    $.hashmask.settings.salt = localStorage.salt;

    // Refresh the hashmask on the page
    $(".hashmask-sparkline").remove();
    $("input[type=password]").hashmask();
  });

  // Cancel editing the user's salt
  $(".salt-cancel").click( function (ev) {
    $('#salt-value').prop("disabled", true);
    $('#salt-value').val("");
    $(".salt-edit-group").show();
    $(".salt-save-group").hide();
  });

  // Save whatever delay the user has entered
  $(".delay-save").click( function (ev) {
    localStorage.delay = +($("#delay-value").val());
    $.hashmask.settings.sparkInterval = localStorage.delay;

    // Refresh the hashmask on the page
    $(".hashmask-sparkline").remove();
    $("input[type=password]").hashmask();
  });

  // Reload the stored delay
  $(".delay-reload").click( function (ev) {
    $("#delay-value").val(localStorage.delay + "");
  });

  // Show the stored delay
  $(".delay-show").click( function (ev) {
    alert(localStorage.delay);
  });
});

// Stuff for displaying and cycling between examples
var exToShow = 0;
var curEx = 0;
var numEx = $(".example").length;

function waitToShow(num) {
  exToShow = num;
  $("#example-" + curEx).css("display", "none");
  $("#example-modal").modal('show');
}

$("#example-modal").on("shown", function () {
  showExample(exToShow);
});

function showExample (example) {
  // Switch to a specific example
  // (note that the other 3 cases are wrappers for this one)
  if (typeof(example) === "number") {
    $("#example-" + example).slideDown(300);
    curEx = example;
  }
  // Switch to the previous example
  else if (example=="prev") {
    $("#example-" + curEx).slideUp(300);
    prev_id = $(".example").filter(":visible").attr("id");
    prev_index = (curEx - 1 + numEx) % numEx;
    showExample(prev_index);
  }
  // Switch to the next example
  else if (example=="next") {
    $("#example-" + curEx).slideUp(300);
    next_id = $(".example").filter(":visible").attr("id");
    next_index = (curEx + 1) % numEx;
    showExample(next_index);
  }
  // Switch to the first example (fallback)
  else {
    showExample(0);
  }
}
// End stuff to cycle between examples

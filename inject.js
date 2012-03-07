
// Send a request to our BG page for all settings before injecting hashmask
chrome.extension.sendRequest({eventName: "settings"}, function (result) {

  // Update hash algorithm about to be used by hashmask
  $.hashmask.settings.hashUsed = result.hash;
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[result.hash];

  // Alternative method to inject hashmask: use jcade, do it for current and future password fields
  $(document).create("input[type=password]", function (ev) {
    var hashmask = $(ev.target).hashmask();

    // Base visibility of the hashmask on whether or not the PW field is focused.
    $(ev.target).focusout(function (ev) {
      if (ev.target.hashdiv != undefined) {
        $(ev.target.hashdiv).css("visibility", "hidden");
      }
    });
    $(ev.target).focusin(function (ev) {
      if (ev.target.hashdiv != undefined) {
        $(ev.target.hashdiv).css("visibility", "visible");
        ev.target.hashdiv.updatePos();
      }
    });
  });

});

// Basic way to inject hashmask: do it for password fields on document.ready
//$(document).ready(function(){
//  var pars = $("input[type=password]").hashmask();
//});

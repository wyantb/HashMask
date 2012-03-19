// Send a request to our BG page for all settings before injecting hashmask
chrome.extension.sendRequest({eventName: "settings"}, function (result) {

  // Update hash algorithm about to be used by hashmask
  $.hashmask.settings.hashUsed = result.hash;
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[result.hash];
	$.hashmask.settings.salt = result.salt;

  // Alternative method to inject hashmask: use jcade, do it for current and future password fields
  $(document).create("input[type=password]", function (ev) {
    $(ev.target).hashmask();
  });

});

// Basic way to inject hashmask: do it for password fields on document.ready
//$(document).ready(function(){
//  var pars = $("input[type=password]").hashmask();
//});

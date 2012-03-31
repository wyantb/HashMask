
if (chrome && chrome.extension && chrome.extension.sendRequest) {

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
} 

// Only occurs when inject isn't in Chrome extension
else {
  // Enter the defaults for salt and hash, if none exist
  if (localStorage.salt == undefined) localStorage.salt = "#e" + Math.random();
  if (localStorage.hash == undefined) localStorage.hash = "sha256";
  $.hashmask.settings.hashFunction = $.hashmask.hashAlgorithms[localStorage.hash];
  
  $(document).create("input[type=password]", function (ev) {
    $(ev.target).hashmask();
  });
}


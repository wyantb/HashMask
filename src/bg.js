// Enter the defaults for salt and hash, if none exist
if (localStorage.salt == undefined) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  localStorage.salt = salt;
}
if (localStorage.hash == undefined) localStorage.hash = "sha256";
if (localStorage.delay == undefined) localStorage.delay = 200;
if (localStorage.enabled == undefined) localStorage.enabled = true;

chrome.extension.onRequest.addListener(onReceiveEvent);

function onReceiveEvent(data, sender, callback){
  console.log("Background page received event.");
  console.log(data);

  // Handle enabling and disabling events
  if (data.eventName === "enable") {
    localStorage.enabled = "true";
  } else if (data.eventName === "disable") {
    localStorage.enabled = "false";
  }

  if (data.eventName == "settings") {
    // Return the current settings to the caller
    callback({
      salt: localStorage.salt,
      hash: localStorage.hash,
      delay: localStorage.delay,
      enabled: localStorage.enabled
    });

  } else {
    // Query for all tabs, send the request to each
    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendRequest(tabs[i].id, data);
      };
    });

  }
}

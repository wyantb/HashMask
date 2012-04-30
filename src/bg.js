// Enter the defaults for salt and hash, if none exist
if (localStorage.salt == undefined) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  localStorage.salt = salt;
}
if (localStorage.hash == undefined) localStorage.hash = "sha256";
if (localStorage.delay == undefined) localStorage.delay = 0;

chrome.extension.onRequest.addListener(onReceiveEvent);

function onReceiveEvent(data, sender, callback){
  if (data.eventName == "settings") {

    callback({
      salt: localStorage.salt,
      hash: localStorage.hash,
      delay: localStorage.delay
    });

  }
}

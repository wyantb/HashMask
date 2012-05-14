var ss = require("simple-storage");

// Enter the defaults for salt and hash, if none exist
if (ss.storage.salt == undefined) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  ss.storage.salt = salt;
}
if (ss.storage.hash == undefined) ss.storage.hash = "sha256";
if (ss.storage.delay == undefined) ss.storage.delay = 200;

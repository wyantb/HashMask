
var randomWords = sjcl.random.randomWords(6, 0);
var salt = sjcl.codec.base64.fromBits(randomWords);
var hash = "sha256";
var delay = 200;

self.port.emit("setSettings", {
  salt: salt,
  hash: hash,
  delay: delay
});
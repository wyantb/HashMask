// Imports
var pageMod = require("page-mod");
var data = require("self").data;
var ss = require("simple-storage");
var self = require("self");
var sjcl = require(self.data.url("sjcl.js"));

// Enter the defaults for salt and hash, if none exist
if (ss.storage.salt == undefined) {
  var randomWords = sjcl.random.randomWords(6, 0);
  var salt = sjcl.codec.base64.fromBits(randomWords);
  ss.storage.salt = salt;
}
if (ss.storage.hash == undefined) ss.storage.hash = "sha256";
if (ss.storage.delay == undefined) ss.storage.delay = 200;

// Create page mods
pageMod.PageMod({
	include: "*",
	contentScriptFile: "inject.js"
});
pageMod.PageMod({
	include: "*",
	contentScriptFile: data.url("jquery.min.js")
});

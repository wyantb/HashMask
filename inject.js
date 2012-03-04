
// Alternative method to inject hashmask: use jcade, do it for current and future password fields
$(document).create("input[type=password]", function( ev ) {
  $(ev.target).hashmask();
});

// Basic way to inject hashmask: do it for password fields on document.ready
//$(document).ready(function(){
//  var pars = $("input[type=password]").hashmask();
//});

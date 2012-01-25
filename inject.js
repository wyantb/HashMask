$("body").css("position","relative");

//get vars
var pars = $("input[type=password]");

var height = pars.css("height");
var width = pars.css("width");
var position = pars.offset();

var intHeight = parseInt(height);
var intWidth = parseInt(width);

/*chrome.extension.sendRequest({eventName : "getText"}, function(response){
  alert(response.value);
});*/

var newleft = position.left + intWidth - intHeight;
console.log(position.left);
console.log(intWidth);
console.log(intHeight);
console.log(newleft);
//make test elements
var test_element = '<img src="awesome.png" class="test" height="'+ height + '" left=' + newleft + '">';

//set position
$(".test").css("z-index",$(".test").css("z-index") + 1);
$(".test").css("position","absolute");
$("body").append(test_element);
$(".test").css("left",newleft + "px");
$(".test").css("top",position.top + "px");

var pos = $(".test").offset();
console.log("-----------------")
console.log(pos.left);
console.log(pos.top);

//Note that 5px is the border + padding of the input that the test element was binded to (assuming that our test element has the same margin size). We must create a for loop in JavaScript in the future to programmatically grab the margin, border, and padding of each password input field as the test element is binded to it.
console.log("test element added to page");

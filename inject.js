var test_element = '<img src="awesome.png" class="test" height="18px">'
$("input[type=password]").parent().append(test_element)
$(".test").css("position","relative")
$(".test").css("top","3px")
//Note that 5px is the border + padding of the input that the test element was binded to (assuming that our test element has the same margin size). We must create a for loop in JavaScript in the future to programmatically grab the margin, border, and padding of each password input field as the test element is binded to it.
console.log("test element added to page")

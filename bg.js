
function getText(){
  return localStorage.getItem("text");
}

chrome.extension.onRequest.addListener(onReceiveEvent);

function onReceiveEvent(data, sender, callback){
  if (data.eventName == "getText"){
    callback({value: getText()});
  }
}

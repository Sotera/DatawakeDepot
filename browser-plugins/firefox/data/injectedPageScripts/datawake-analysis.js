//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
$(document).ready(function () {
  return;
  try {
    var urls = [data.url('injectedPageCSS/textHighlights.css')];
    for (var index in urls) {
      var cssId = 'myCss' + index;  // you could encode the css path itself to generate id..
      if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = urls[index];
        link.media = 'all';
        head.appendChild(link);
      }
    }
  }
  catch (e) {
    console.error("Do not have access to the document.");
  }
});
function muffinIt() {
  //$('.highlight').css({backgroundColor: '#88ff88'});
  var p = $('p');
  p.highlight('upload');
}
self.on('click', function (node, action) {
  /*  var selectedText = window.getSelection().toString();
   self.postMessage({action, selectedText});*/
  muffinIt();
});
self.port.on('load-css-urls-target-content-script', function (data) {
  data.cssUrls.forEach(function(cssUrl){
    var cssId = encodeURI(cssUrl);
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssUrl;
      link.media = 'all';
      head.appendChild(link);
    }
  });
  $('body').highlight('upload');
});
self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
$(document).ready(function () {
});
self.port.on('load-css-urls-target-content-script', function (data) {
  data.cssUrls.forEach(function (cssUrl) {
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
});
self.port.on('toggle-showing-domain-items', function (data) {
  if(!data.domainItems.length){
    $('body').unhighlight();
  }else{
    data.domainItems.forEach(function(domainItem){
      $('body').highlight(domainItem);
    });
  }
});
self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

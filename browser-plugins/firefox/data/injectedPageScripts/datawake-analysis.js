//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
var myVar = null;

//Show panel after each page load
$(document).ready(function () {
    showPanel();
    //Now populate it
    rewritePanelHtml('<body><h1>Hey it works</h1><div id="timer">initialized</div></body>');
    //Now start a poller to keep repopulating it as long as they're on this page
    myVar = setInterval(myTimer, 5000);
});

//Load all CSS urls
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

function showPanel(){
    if ($('#datawake-right-panel').length === 0){
        var datawakePanel = '<div id="datawake-right-panel"></div>';
        $('body').append(datawakePanel);
    }
}

function rewritePanelHtml(html){
  $('#datawake-right-panel').html(html);
}

function myTimer(){
    var d = new Date();
    rewritePanelHtml('<body><h1>updated</h1><div id="timer">' + d.toLocaleTimeString() + '</div></body>');
}

//Test panel populate
self.port.on('test-datawake-panel-content', function (data) {
  rewritePanelHtml('This is the test text.');
});

//Toggle side panel
self.port.on('send-toggle-datawake-panel', function () {
    if ($('#datawake-right-panel').length === 0) {
        var datawakePanel = '<div id="datawake-right-panel"></div>';
        $('body').append(datawakePanel);
        myVar = setInterval(myTimer, 5000);
    }else{
        $("#datawake-right-panel").remove();
        myVar = null;
    }
});

//Highlight DomainItems in page
self.port.on('toggle-showing-domain-items', function (data) {
  if (!data.domainItems.length) {
    $('body').unhighlight();
  } else {
    data.domainItems.forEach(function (domainItem) {
      $('body').highlight(domainItem);
    });
  }
});

self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

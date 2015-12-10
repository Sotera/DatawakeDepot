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
    rewritePanel('<body><h1>Panel Activated</h1><div id="timer">initializing</div></body>');
    //Now start a poller to keep repopulating it as long as they're on this page
    myVar = setInterval(panelTimer, 10000);
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
        var datawakePanel = '<div id="datawake-right-panel"><div id="initialDiv"></div></div>';
        $('body').append(datawakePanel);
    }
}

function rewritePanel(html){
  $('#datawake-right-panel').html(html);
}

function rewritePanelDiv(div,html){
    $('#datawake-right-panel').append(html);
}

function panelTimer(){
    self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
}

//Populate panel
self.port.on('send-panel', function (data) {
    rewritePanelDiv("#widgetOne",data.panelHtml);
});

//Test panel populate
self.port.on('test-datawake-panel-content', function (data) {
  rewritePanel('This is the test text.');
});

//Toggle side panel
self.port.on('send-toggle-datawake-panel', function () {
    if ($('#datawake-right-panel').length === 0) {
        var datawakePanel = '<div class="datawake-right-panel" id="datawake-right-panel"></div>';
        $('body').append(datawakePanel);
        myVar = setInterval(panelTimer, 5000);
    }else{
        $("#datawake-right-panel").remove();
        clearInterval(myVar);
    }
});

//Populate side panel
self.port.on('send-panel', function (data) {
    if ($('#datawake-right-panel').length === 0) {
        rewritePanel(data.panelHtml);
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

//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
$(document).ready(function () {
});
var cssUrls = [];
self.port.on('load-css-urls-target-content-script', function (data) {
  cssUrls = cssUrls.concat(data.cssUrls);
});
var userFieldName = '';
var userFieldValue = '';
var passwordFieldName = '';
var passwordFieldValue = '';
self.port.on('crack-login-select-username', function (data) {
  userFieldName = data.fieldName;
  userFieldValue = data.text;
  rewritePanelHtml();
});
self.port.on('crack-login-select-password', function (data) {
  passwordFieldName = data.fieldName;
  passwordFieldValue = data.text;
  rewritePanelHtml();
});
function rewritePanelHtml(){
  var html = '<p>Username Id: ' + userFieldName + '</p>';
  html += '<p>Username Value: ' + userFieldValue + '</p>';
  html += '<p>Password Id: ' + passwordFieldName + '</p>';
  html += '<p>Password Value: ' + passwordFieldValue + '</p>';
  $('#datawake-right-panel').html(html);
}
self.port.on('inject-datawake-panel-content-target-content-script', function (data) {
  //$('#datawake-right-panel').html('This is the test text.');
});
self.port.on('show-side-panel-target-content-script', function (data) {
  cssUrls.forEach(function (cssUrl) {
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
  $('body').wrapInner('<div id="datawake-site" />');
  var datawakePanel = '<div id="datawake-right-panel"></div>';
  $('body').append(datawakePanel);
});
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

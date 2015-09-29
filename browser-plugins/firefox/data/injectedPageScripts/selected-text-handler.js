//This is an injected content script. It deals with selected text context menu clicks
self.on('click', function (node, action) {
  var selectedText = window.getSelection().toString();
  self.postMessage({action, selectedText});
});

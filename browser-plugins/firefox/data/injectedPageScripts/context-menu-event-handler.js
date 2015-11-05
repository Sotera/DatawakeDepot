$(document).ready(function () {
});
self.on('click', function (node, data) {
  var selectedText = window.getSelection().toString();
  self.postMessage({data, selectedText});
});


exports.init = init;

function init(){
  var contextMenu = require("sdk/context-menu");
  var self = require('sdk/self');
  var menuItem = contextMenu.Item({
    label: "Log Selection",
    context: contextMenu.SelectionContext(),
    image: self.data.url('images/waveicon16.png'),
    contentScript: 'self.on("click", function () {' +
    '  var text = window.getSelection().toString();' +
    '  self.postMessage(text);' +
    '});',
    onMessage: function (selectionText) {
      console.log(selectionText);
    }
  });
};
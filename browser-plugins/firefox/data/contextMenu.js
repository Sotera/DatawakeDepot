exports.init = init;
exports.addContextMenu = addContextMenu;
var contextMenu = require("sdk/context-menu");
var self = require('sdk/self');
function init() {
}
function addContextMenu() {
  var menu = contextMenu.Menu({
    label: 'Datawake [Domain: ' + ']',
    image: self.data.url('images/waveicon16.png'),
    context: contextMenu.SelectionContext(),
    items: [
      contextMenu.Item(
        {
          label: 'Show Selections',
          context: contextMenu.SelectionContext()
        }),
      contextMenu.Item(
        {
          label: 'Hide Selections',
          context: contextMenu.SelectionContext()
        }
      )
    ]
    /*    contentScript: 'self.on("click", function () {' +
     '  var text = window.getSelection().toString();' +
     '  self.postMessage(text);' +
     '});',
     onMessage: function (selectionText) {
     console.log(selectionText);
     }*/
  });
};
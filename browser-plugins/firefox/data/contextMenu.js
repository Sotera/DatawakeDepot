var {pluginState} = require('./pluginState');
var contextMenu = require("sdk/context-menu");
var self = require('sdk/self');
var menu = null;
exports.init = function () {
  //JReeme: Comment out next two lines for production
  //addContextMenu();
  //return;
  pluginState.onAddInModuleEvent('logged-out-target-context-menu', function () {
    if (menu) {
      menu.destroy();
      menu = null;
    }
  });
  pluginState.onAddInModuleEvent('logged-in-target-context-menu', function () {
    addContextMenu();
  });
}
function handleContextMenuClick({action, selectedText}) {
  console.log(action);
  console.log(selectedText);
}
function anyTextSelected(context) {
  return true;//!context.selectionText;
}
function addContextMenu() {
  var contentScriptFile = [
    './vendor/jszip/jszip.min.js',
    './vendor/jquery/jquery-2.1.4.min.js',
    './vendor/jquery/jquery.highlight.js',
    //'./vendor/highlightRegex/highlightRegex.min.js',
    './injectedPageScripts/datawake-analysis.js'];
  menu = contextMenu.Menu({
    label: 'Datawake [Domain: ' + ']',
    image: self.data.url('images/waveicon16.png'),
    context: contextMenu.URLContext('*'),
    items: [
      contextMenu.Item(
        {
          label: 'Capture Selection',
          data: 'capture-selection',
          context: contextMenu.SelectionContext(),
          contentScriptFile: './injectedPageScripts/datawake-analysis.js',
          onMessage: handleContextMenuClick
        }),
      contextMenu.Item(
        {
          label: 'Tag Feature',
          data: 'tag-feature',
          context: contextMenu.SelectionContext(),
          contentScriptFile: './injectedPageScripts/datawake-analysis.js',
          onMessage: handleContextMenuClick
        }),
      contextMenu.Item(
        {
          label: 'Show Selections',
          data: 'show-selections',
          context: contextMenu.PredicateContext(anyTextSelected),
          contentScriptFile: './injectedPageScripts/datawake-analysis.js',
          onMessage: handleContextMenuClick
        }),
      contextMenu.Item(
        {
          label: 'Hide Selections',
          data: 'hide-selections',
          context: contextMenu.PredicateContext(anyTextSelected),
          contentScriptFile: contentScriptFile,
          //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
          onMessage: handleContextMenuClick
        }
      )
    ]
  });
};

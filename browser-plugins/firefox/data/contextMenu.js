var {pluginState} = require('./pluginState');
var contextMenu = require("sdk/context-menu");
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var menu = null;
var showDomainItems = 'Toggle Domain Item Highlighting';
var captureDataItem = 'Save Selection as Data Item';
//var hideDomainItems = 'Toggle Domain Item Highlighting';

exports.init = function () {
  //JReeme: Comment out next two lines for production
  //addContextMenu();
  //return;

    pluginState.onAddInModuleEvent('trailing-active', function () {
        addContextMenu();
    });

    pluginState.onAddInModuleEvent('trailing-inactive', function () {
        removeContextMenu();
    });
};

function removeContextMenu(){
    if (menu) {
        menu.destroy();
        menu = null;
    }
}

function handleContextMenuClick({data, selectedText}) {
    var activeTabId = tabs.activeTab.id;
    var messageToContentScript = {};

    switch (data) {
        case 'toggle-showing-domain-items':
            if (tabs.activeTab.domainItemsHighlighted) {
                this.label = showDomainItems;
                messageToContentScript.domainItems = [];
                delete tabs.activeTab.domainItemsHighlighted;
                pluginState.postEventToContentScript(activeTabId, data, messageToContentScript);
            } else {
                this.label = hideDomainItems;
                pluginState.getDomainItemsForCurrentDomain(function (domainItems) {
                    var domainItemValues = [];
                    domainItems.forEach(function (domainItemValue) {
                        domainItemValues.push(domainItemValue.itemValue);
                    });
                    tabs.activeTab.domainItemsHighlighted =
                        messageToContentScript.domainItems = domainItemValues;
                    pluginState.postEventToContentScript(activeTabId, data, messageToContentScript);
                });
            }
            break;
        case 'capture-data-item':
            messageToContentScript.value = selectedText;
            pluginState.postEventToContentScript(activeTabId,data,messageToContentScript);
            break;
        default:
            return false;
    }
}

//function anyTextSelected(context) {
//  return true;//!context.selectionText;
//}

function addContextMenu() {
  var contentScriptFile = [
    /*    './vendor/jszip/jszip.min.js',
     './vendor/jquery/jquery.highlight.js',*/
    './vendor/jquery/jquery-2.1.4.min.js',
    './injectedPageScripts/context-menu-event-handler.js'];
  menu = contextMenu.Menu({
    label: 'Datawake [Domain: ' + ']',
    image: self.data.url('images/waveicon16.png'),
    context: contextMenu.URLContext('*'),
    items: [
       contextMenu.Item(
       {
       label: captureDataItem,
       data: 'capture-data-item',
       context: contextMenu.SelectionContext(),
       contentScriptFile: contentScriptFile,
       onMessage: handleContextMenuClick
       })
        //,
       //contextMenu.Item(
       //{
       //label: 'Tag Feature',
       //data: 'tag-feature',
       //context: contextMenu.SelectionContext(),
       //contentScriptFile: contentScriptFile,
       ////contentScriptFile: './injectedPageScripts/datawake-analysis.js',
       //onMessage: handleContextMenuClick
       //}),
      // contextMenu.Item(
      // {
      // label: 'Show Selections',
      // data: 'show-selections',
      // context: contextMenu.PredicateContext(anyTextSelected),
      // contentScriptFile: contentScriptFile,
      // //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
      // onMessage: handleContextMenuClick
      // }),
      // contextMenu.Item(
      // {
      // label: 'Hide Selections',
      // data: 'hide-selections',
      // context: contextMenu.PredicateContext(anyTextSelected),
      // contentScriptFile: contentScriptFile,
      // //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
      // onMessage: handleContextMenuClick
      // }
      // ),
      //contextMenu.Item(
      //  {
      //    label: showDomainItems,
      //    data: 'toggle-showing-domain-items',
      //    context: contextMenu.PredicateContext(anyTextSelected),
      //    contentScriptFile: contentScriptFile,
      //    onMessage: handleContextMenuClick
      //  }
      //)
    ]
  });
}

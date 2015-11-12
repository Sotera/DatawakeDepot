var {pluginState} = require('./pluginState');
var contextMenu = require("sdk/context-menu");
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var menu = null;
var showDomainItems = 'Toggle Domain Item Highlighting';
var hideDomainItems = 'Toggle Domain Item Highlighting';
exports.init = function () {
  //JReeme: Comment out next two lines for production
  addContextMenu();
  return;
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
function handleContextMenuClick({data, text}) {
  var activeTabId = tabs.activeTab.id;
  var messageToContentScript = {};
  if (data === 'toggle-datawake-panel') {
    if (tabs.activeTab.datawakePanelShowing) {
      delete tabs.activeTab.datawakePanelShowing;
    }
    else {
      tabs.activeTab.datawakePanelShowing = {dummy: 'dummyValue'};
      pluginState.postEventToContentScript(activeTabId, data, messageToContentScript);
    }
  } else if (data === 'crack-login-select-username') {
    messageToContentScript = {fieldName: 'Username', text};
    pluginState.postEventToContentScript(activeTabId, data, messageToContentScript);
  } else if (data === 'crack-login-select-password') {
    messageToContentScript = {fieldName: 'Password', text};
    pluginState.postEventToContentScript(activeTabId, data, messageToContentScript);
  } else if (data === 'toggle-showing-domain-items') {
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
  }
}
function anyTextSelected(context) {
  return true;//!context.selectionText;
}
function addContextMenu() {
  var contentScriptFile = [
    /*    './vendor/jszip/jszip.min.js',
     './vendor/jquery/jquery.highlight.js',*/
    './vendor/jquery/jquery-2.1.4.min.js',
    './injectedPageScripts/context-menu-event-handler.js'];
  menu = contextMenu.Menu({
    label: 'Datawake Login Cracker',
    image: self.data.url('images/waveicon16.png'),
    //context: contextMenu.URLContext('*'),
    context: contextMenu.SelectorContext('input'),
    items: [
      /*      contextMenu.Item(
       {
       label: 'Capture Selection',
       data: 'capture-selection',
       context: contextMenu.SelectionContext(),
       contentScriptFile: contentScriptFile,
       //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
       onMessage: handleContextMenuClick
       }),
       contextMenu.Item(
       {
       label: 'Tag Feature',
       data: 'tag-feature',
       context: contextMenu.SelectionContext(),
       contentScriptFile: contentScriptFile,
       //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
       onMessage: handleContextMenuClick
       }),
       contextMenu.Item(
       {
       label: 'Show Selections',
       data: 'show-selections',
       context: contextMenu.PredicateContext(anyTextSelected),
       contentScriptFile: contentScriptFile,
       //contentScriptFile: './injectedPageScripts/datawake-analysis.js',
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
       ),*/
/*      contextMenu.Item(
        {
          label: showDomainItems,
          data: 'toggle-showing-domain-items',
          context: contextMenu.PredicateContext(anyTextSelected),
          contentScriptFile: contentScriptFile,
          onMessage: handleContextMenuClick
        }
      )*/
      contextMenu.Item(
        {
          label: 'LOGIN: Select As Username',
          data: 'crack-login-select-username',
          context: contextMenu.SelectorContext('input'),
          contentScriptFile: contentScriptFile,
          onMessage: handleContextMenuClick
        }
      )
      ,contextMenu.Item(
        {
          label: 'LOGIN: Select As Password',
          data: 'crack-login-select-password',
          context: contextMenu.SelectorContext('input'),
          contentScriptFile: contentScriptFile,
          onMessage: handleContextMenuClick
        }
      )
    ]
  });
};

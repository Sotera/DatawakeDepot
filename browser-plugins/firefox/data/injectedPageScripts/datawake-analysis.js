//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
var myVar = null;
var iInterval = 4000;
var currentDomainId = '';
var dataItemsActive = false;


$(document).ready(function () {
    //Find out if we're actively trailing
    getTrailingStatus();
});

function getTrailingStatus(){
    //Request the plugin.trailingActive status from the addin
    self.port.emit('requestTrailingActive-target-addin', {contentScriptKey: myContentScriptKey});
}

//Listen for the addin's getTrailingStatus response.
self.port.on('trailingStatus-target-content-script', function (data) {
    if(data.trailingActive){
        //If the sidebar is active then request data to populate it
        if(data.panelActive){
            setTimeout(getPanelData, iInterval);
        }
        //If dataitems are active then show them
        if(data.dataItemsActive){
            showDataItems(data.dataItems);
        }
    }
});

//Listen for requests to refresh dataitems
self.port.on('refresh-data-items-target-content-script', function (data) {
    //If dataitems are active then show them
    if(data.dataItemsActive){
        showDataItems(data.dataItems);
    }
});

function getPanelData(){
    self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
}

function showDataItems(dataItems){
    dataItemsActive = true;
    var newDomainItems = dataItems.map(function(dataitem){
        return dataitem.itemValue;
    });

    $('body').highlight(newDomainItems);
}

function showNewDataItem(dataitem){
    if (dataItemsActive) {
        $('body').highlight(dataitem);
    }
}

function hideDataItems(){
    dataItemsActive = false;
    $('body').unhighlight();
}

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

//Toggle panel
self.port.on('send-toggle-datawake-panel', function (data) {
    getPanelData();
});

//Toggle dataitems highlighting
self.port.on('send-toggle-datawake-dataitems', function (data) {
    if(data.dataItemsActive){
        showDataItems(data.dataItems);
    }else{
        hideDataItems();
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

//Forward context menu add manual extraction request
self.port.on('capture-data-item', function (data) {
    self.port.emit('request-add-data-item-target-addin', {contentScriptKey: myContentScriptKey, value: data.value});
});

self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});



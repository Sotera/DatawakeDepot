//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
var myVar = null;
var iInterval = 4000;


$(document).ready(function () {
    //Only automatically show the panel when the user is actively trailing.
    getTrailingStatus();
});

function getTrailingStatus(){
    //Request the plugin.trailingActive status from the addin
    self.port.emit('requestTrailingActive-target-addin', {contentScriptKey: myContentScriptKey});
}

//Listen for the addin's getTrailingStatus response. If active then show the panel and dataitems if active
self.port.on('trailingStatus-target-content-script', function (data) {
    if(data.trailingActive){
        if(data.panelActive){
            showPanel();
        }
        if(data.dataItemsActive){
            showDataItems(data.dataItems);
        }
    }
});

function showPanel(){
    if ($('#datawake-right-panel').length === 0){
        var datawakePanel = '<div class="DWD_widget" id="datawake-right-panel"><div id="widgetOne">&nbsp;&nbsp;extracting...</div></divDWD_widget>';
        $('body').append(datawakePanel);
    }

    //Now that we've shown it, let's give it a few seconds to get some data
    //TODO: Really we should refresh until we have a few rows of data
    setTimeout(getPanelData, iInterval);
}

function getPanelData(){
    self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
}

function showDataItems(dataItems){
    dataItems.forEach(function (domainItem) {
        $('body').highlight(domainItem.itemValue);
    });
}

function showNewDataItem(dataitem){
    $('body').highlight(dataitem);
}

function hideDataItems(){
    $('body').unhighlight();
}

//Receive panel data and populate it
self.port.on('send-panel', function (data) {
    buildPanelContents(data);
    //clearInterval(myVar);
});

function buildPanelContents(data){
    var panelHtml = data.panelHtml;
    rewritePanelDiv("#widgetOne", panelHtml);
}

function rewritePanelDiv(div,html){
    $(div).remove();
    $("#datawake-right-panel").append(html);
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

//function panelTimer(){
//    self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
//}

//Toggle panel
self.port.on('send-toggle-datawake-panel', function (data) {
    if(data.panelActive){
    //if ($('#datawake-right-panel').length === 0) {
        //Request Panel Data
        getPanelData();

        //Build the Panel
        var datawakePanel = '<div class="DWD_widget" id="datawake-right-panel"><div id="widgetOne">&nbsp;&nbsp;extracting...</div></divDWD_widget>';

        //Show it
        $('body').append(datawakePanel);
        //set the timer to refresh it
        //myVar = setInterval(panelTimer, iInterval);
    }else{
        $("#datawake-right-panel").remove();
        //clearInterval(myVar);
    }
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

self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

//This listens for messages from the Panel
window.addEventListener("message",receiveMessage,false);

function receiveMessage(e){
    if(!e.data.dwItem.type){
        return;
    }

    switch(e.data.dwItem.type){
        case 'domainItem':
            var newDomainItem = {
                id: e.data.dwItem.id,
                itemValue: e.data.dwItem.value,
                type: 'extracted',
                source: e.data.dwItem.extractorId,
                dwDomainId: e.data.dwItem.domainId
            };
            //Pass to Addin
            self.port.emit('addDomainItem-target-addin', newDomainItem);
            showNewDataItem(e.data.dwItem.value);
            break;
        case 'domainType':
            var newDomainType = {
                name: e.data.dwItem.value,
                description: e.data.dwItem.value,
                dwDomainId: e.data.dwItem.domainId,
                dwExtractorId: e.data.dwItem.extractorId,
                source: 'Converted'
            };
            //Pass to Addin
            self.port.emit('addEntityType-target-addin', newDomainType);
            break;
        case 'refreshRequest':
            getPanelData();
            break;
        default:
            return;
    }
}

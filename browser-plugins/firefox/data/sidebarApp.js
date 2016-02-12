var pageData = null;
var extractorFinished = false;
var rancorFinished = false;
var sidebarTimer = null;

var divExtracted = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>Loading . . .</td></tr></table></div>";

//Receive the current tab from the addin
addon.port.on("send-sidebar-current-tab", function(data) {
    pageData = data;
    //Clear the rating, reset the extractor, clear the rancor
    setRating();

    $('#btnExtractRefresh').hide();
    $('#widgetOne').replaceWith(divExtracted);

    destroyRancor();

    //start interval to populate sidebar
    sidebarTimer = setInterval(pollForSidebarContents(),5000);
});

function pollForSidebarContents(){
    if(!extractorFinished){
        refreshExtractions();
    }

    if(!rancorFinished){
        refreshRancor();
    }

    if(extractorFinished && rancorFinished){
        clearInterval(sidebarTimer);
    }
}

//Populate sidebar Page Rating from addin
addon.port.on("sidebarRating", function(rating) {
    setRating(rating);
});

function pageRating(rateEvent, val){
    var addinMsg = 'ratePage-target-addin';

    //Pass to Addin
    addon.port.emit(addinMsg, {url:pageData.pageUrl,event:rateEvent,pageRating:val});
}

function setRating(rating){
    if(!rating){
        $('#divPageRating').rateit('value', null);
        return;
    }
    $('#divPageRating').rateit('value', rating);
}

//Populate sidebar Extractions from addin
addon.port.on("sidebarContent", function(divHtml) {
    $('#btnExtractRefresh').show();
    $('#widgetOne').replaceWith(divHtml);
    extractorFinished = true;
});

function refreshExtractions(){
    addon.port.emit('refreshExtractions', pageData.pageUrl);
}

//Populate sidebar Rancor from addin
addon.port.on("sidebarRancor", function(urlResults) {
    if(urlResults.finished){
        $('#btnRancorRefresh').show();
        drawRancor(urlResults);
        rancorFinished = true;
    }

});

function refreshRancor(){
    destroyRancor();
    addon.port.emit('refreshRancor', pageData.contentScriptKey);
}

//Create rateit star system and bind to its event actions
$(function () {
    $('#divPageRating').rateit({ max: 5, step: 1, backingfld: '#inputRating' });
    $("#divPageRating").bind('rated', function (event,value) {pageRating(event.type,value)});
    $("#divPageRating").bind('reset', function (event,value) {pageRating(event.type,value)});
});

function addDomainObject(domObj){
    if(!domObj.dwItem.type){
        return false;
    }

    switch(domObj.dwItem.type){
        case 'domainItem':
            var newDomainItem = {
                itemValue: domObj.dwItem.value,
                type: 'extracted',
                source: domObj.dwItem.extractorId
            };
            //Pass to Addin
            addon.port.emit('addDomainItem-target-addin', newDomainItem,pageData.contentScriptKey);
            //showNewDataItem(domObj.dwItem.value);
            break;
        case 'domainType':
            var newDomainType = {
                name: domObj.dwItem.value,
                description: domObj.dwItem.value,
                dwExtractorId: domObj.dwItem.extractorId,
                source: 'Converted'
            };
            //Pass to Addin
            addon.port.emit('addEntityType-target-addin', newDomainType);
            break;
        default:
            return false;
    }
    return false;
}


var pageData = null;

var divExtracted = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>Loading . . .</td></tr></table></div>";

//Receive the current tab from the addin
addon.port.on("send-sidebar-current-tab", function(data) {
    pageData = data;
    setRating();
    $('#btnExtractRefresh').hide();
    $('#widgetOne').replaceWith(divExtracted);
});

//Replace sidebar Page Rating with retrieved value from addin
addon.port.on("sidebarRating", function(rating) {
    setRating(rating);
});

//Replace sidebar content with content from addin
addon.port.on("sidebarContent", function(divHtml) {
    $('#btnExtractRefresh').show();
    $('#widgetOne').replaceWith(divHtml);
});

//Replace sidebar Rancor with content from addin
addon.port.on("sidebarRancor", function(divHtml) {
    $('#widgetTwo').replaceWith(divHtml);
});

//Create rateit star system and bind to its event actions
$(function () {
    $('#divPageRating').rateit({ max: 5, step: 1, backingfld: '#inputRating' });
    $("#divPageRating").bind('rated', function (event,value) {pageRating(event.type,value)});
    $("#divPageRating").bind('reset', function (event,value) {pageRating(event.type,value)});
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

function refreshSidebar(){
    addon.port.emit('refreshSidebar', pageData);
}

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
            addon.port.emit('addDomainItem-target-addin', newDomainItem);
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

function showNewDataItem(value){

}
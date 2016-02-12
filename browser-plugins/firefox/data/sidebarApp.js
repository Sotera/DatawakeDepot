
var pageData = null;
var extractorFinished = false;
var rancorFinished = false;
var rancorStatus = null;
var sidebarTimer = null;

var divExtracted = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>Loading . . .</td></tr></table></div>";
var divRancor = "<div id='widgetTwo' style='background-color:white'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>Loading . . .</td></tr></table><div id='popup' class='DWD_url'>_</div></div>";

//Receive the current tab from the addin
addon.port.on("send-sidebar-current-tab", function(data) {
    //Kill the previous interval is there is one
    clearInterval(sidebarTimer);

    pageData = data;
    //Clear the rating, reset the extractor, clear the rancor, reset variables
    setRating();

    $('#btnExtractRefresh').hide();
    $('#widgetOne').replaceWith(divExtracted);
    extractorFinished = false;

    destroyRancor();
    //$('#btnRancorRescore').hide();
    $('#widgetTwo').replaceWith(divRancor);
    rancorFinished = false;

    //Start checking for sidebar content
    sidebarTimer = setInterval(pollForSidebarContents,1000);
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
addon.port.on("sidebarRating", function(rating) {sidebarTimer
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

function refreshExtractions(){
    addon.port.emit('refreshExtractions', pageData.pageUrl);
}

//Populate sidebar Extractions from addin
addon.port.on("sidebarContent", function(divHtml) {
    if(!extractorFinished){
        if(!divHtml){
            return;
        }else if(divHtml.length != 189){
            $('#btnExtractRefresh').show();
            $('#widgetOne').replaceWith(divHtml);
            extractorFinished=true;
        }
    }
});

function refreshRancor(){
    addon.port.emit('refreshRancor', pageData.contentScriptKey);
}

function rescoreRancor(){
    destroyRancor();
    //$('#btnRancorRescore').hide();
    $('#widgetTwo').replaceWith(divRancor);
    rancorFinished = false;

    addon.port.emit('rescoreRancor', pageData);

    //Start checking for sidebar content
    sidebarTimer = setInterval(pollForSidebarContents,1000);
}

//Populate sidebar Rancor from addin
addon.port.on("sidebarRancor", function(urlResults) {
    if(!rancorFinished){
        if(urlResults.finished){
            //$('#btnRancorRescore').show();
            drawRancor(urlResults);
            rancorFinished = true;
        }
    }
});

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

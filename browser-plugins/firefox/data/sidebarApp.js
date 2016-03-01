var pageData = null;
var extractionFinished = false;
var rancorFinished = false;
var rancorActive = null;
var extractionActive = null;
var extractionTimer = null;
var rancorTimer = null;

var divExtracted = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'><img src='./images/animated_loader.gif' height='15'/>&nbsp;Loading . . .</td></tr></table></div>";
var divExtractedStale = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>&nbsp;</td></tr></table></div>";
var divExtractedInactive = "<div id='widgetOne'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'>Inactive</td></tr></table></div>";
var divRancor = "<div id='widgetTwo' style='background-color:white'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'><img src='./images/animated_loader.gif' height='15'/>&nbsp;Loading . . .</td></tr></table></div>";
var divRancorStale = "<div id='widgetTwo' style='background-color:white'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'></td></tr></table></div>";
var divRancorInactive = "<div id='widgetTwo' style='background-color:white'><table class='DWD_table'><tr class='DWD_tr'><td class='DWD_td'><em>Attention</em>: This module will scrape every link on the page and follows no web scraping best practices.  Heavy use may result in your IP being blocked on certain pages. Use the toggle button to activate.</td></tr></table></div>";

//Receive the current tab from the addin
addon.port.on("send-sidebar-current-tab", function(data) {
    //Kill the previous interval is there is one
    clearInterval(extractionTimer);
    clearInterval(rancorTimer);

    pageData = data;
    rancorActive = data.rancorActive;
    extractionActive = data.extractionActive;

    //Clear the rating
    setRating();

    //Reset the extractor
    if(extractionActive){
        $('#btnExtractRefresh').hide();
        $('#widgetOne').replaceWith(divExtracted);
        extractionFinished = false;
    }else {
        if (extractionActive == undefined) {
            $('#btnExtractRefresh').show();
            $('#widgetOne').replaceWith(divExtractedStale);
        } else
        {
            $('#btnExtractRefresh').hide();
            $('#widgetOne').replaceWith(divExtractedInactive);
        }

        extractionFinished = true;
    }

    //Reset the rancor
    if(rancorActive){
        destroyRancor();
        $('#btnRancorRescore').hide();
        $('#widgetTwo').replaceWith(divRancor);
        $('#popup').text('');
        rancorFinished = false;
    }else{
        if (rancorActive == undefined) {
            $('#btnRancorRescore').show();
            $('#widgetTwo').replaceWith(divRancorStale);
        }else {
            destroyRancor();
            $('#btnRancorRescore').hide();
            $('#widgetTwo').replaceWith(divRancorInactive);
        }
        $('#popup').text('');
        rancorFinished = true;

    }

    //Start checking for sidebar content
    if(extractionActive){
        extractionTimer = setInterval(pollForExtractionContents,1000);
    }
    if(rancorActive){
        rancorTimer = setInterval(pollForRancorContents,1000);
    }
});

function pollForExtractionContents(){
    if(!extractionFinished){
        refreshExtractions();
    }else{
        clearInterval(extractionTimer);
    }
}

function pollForRancorContents(){
    if(!rancorFinished){
        refreshRancor();
    }else{
        clearInterval(rancorTimer);
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

function refreshExtractions(){
    if(pageData){
        addon.port.emit('refreshExtractions', pageData.pageUrl);
    }else{
        addon.port.emit('refreshExtractions', null);
    }
}

function regetExtractions(){
    $('#widgetOne').replaceWith(divExtracted);
    extractionFinished = false;

    //if(pageData){
    //    addon.port.emit('refreshExtractions', pageData.pageUrl);
    //}else{
    //    addon.port.emit('refreshExtractions', null);
    //}

    //Start checking for sidebar content
    extractionTimer = setInterval(pollForExtractionContents,1000);
}

function toggleExtraction(enabled){
    if(enabled){
        extractionActive = true;
        extractionFinished = false;

        $('#btnExtractionToggleOn').hide();
        $('#btnExtractionToggleOff').show();
        $('#btnExtractRefresh').hide();
        $('#widgetOne').replaceWith(divExtracted);
        extractionTimer = setInterval(pollForExtractionContents,1000);
    } else{
        extractionActive = false;
        extractionFinished = true;

        $('#btnExtractionToggleOn').show();
        $('#btnExtractionToggleOff').hide();
        $('#btnExtractRefresh').hide();
        $('#widgetOne').replaceWith(divExtractedInactive);
        clearInterval(extractionTimer);
    }

    addon.port.emit('toggleExtractionStatus', enabled);
}

//Populate sidebar Extractions from addin
addon.port.on("sidebarContent", function(content) {
    if(!extractionFinished){
        if(!content.divHtml){
            return;
        }else if(content.divHtml.length != 189 && (!pageData ||content.url == pageData.pageUrl)){
            $('#btnExtractRefresh').show();
            $('#widgetOne').replaceWith(content.divHtml);
            extractionFinished=true;
        }
    }
});

function refreshRancor(){
    if(pageData){
        addon.port.emit('refreshRancor', pageData.contentScriptKey);
    }else{
        addon.port.emit('refreshRancor', null);
    }
}

function rescoreRancor(){
    destroyRancor();
    $('#widgetTwo').replaceWith(divRancor);
    rancorFinished = false;

    addon.port.emit('rescoreRancor', pageData);

    //Start checking for sidebar content
    rancorTimer = setInterval(pollForRancorContents,1000);
}

function toggleRancor(enabled){
    addon.port.emit('toggleRancorStatus', enabled);

    if(enabled){
        rancorActive = true;
        rancorFinished = false;
        destroyRancor();
        $('#btnRancorToggleOn').hide();
        $('#btnRancorToggleOff').show();
        $('#btnRancorRescore').hide();
        $('#widgetTwo').replaceWith(divRancor);
        $('#popup').text('');

        addon.port.emit('rescoreRancor', {id:pageData.contentScriptKey,url:pageData.pageUrl});

        rancorTimer = setInterval(pollForRancorContents,1000);
    } else{
        rancorActive = false;
        rancorFinished = true;
        destroyRancor();
        $('#btnRancorToggleOn').show();
        $('#btnRancorToggleOff').hide();
        $('#btnRancorRescore').hide();
        $('#widgetTwo').replaceWith(divRancorInactive);
        $('#popup').text('');

        clearInterval(rancorTimer);
    }

}

//Populate sidebar Rancor from addin
addon.port.on("sidebarRancor", function(urlResults) {
    if(!rancorFinished){
        if(urlResults.finished){
            $('#btnRancorRescore').show();
            drawRancor(urlResults);
            rancorFinished = true;
        }
    }
});

//Create rateit star system and bind to its event actions
$(function () {
    $('#divPageRating').rateit({ max: 11, step: 1, backingfld: '#inputRating' });
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

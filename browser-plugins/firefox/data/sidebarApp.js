var pageData = null;

var divExtracted = "<div id='widgetOne'><table class='DWD_table'><tr><th class='DWD_th'>Extracted Entities</th></tr><tr><td class='DWD_td'></td></tr></table></div>";

//Receive the current tab from the addin
addon.port.on("send-sidebar-current-tab", function(data) {
    pageData = data;
    $('#widgetOne').remove();
    $("#widgetExtraction").append(divExtracted);
});

//Replace sidebar content with content from addin
addon.port.on("sidebarContent", function(divHtml) {
    $('#widgetOne').remove();
    $("#widgetExtraction").append(divHtml);
});


function pageRank(ev, val){
    if(ev == 'rated'){
        var x = val;
    }
    if(ev == 'reset'){
        var y = val;
    }
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
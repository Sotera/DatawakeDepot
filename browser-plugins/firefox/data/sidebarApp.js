var pageData = null;

addon.port.on("send-sidebar-current-tab", function(data) {
    pageData = data;
    $('#widgetOne').remove();
    $("#widgetContent").append('<div id="widgetOne" class="DWD_widget">&nbsp;&nbsp;extracting...</div>');
});

addon.port.on("sidebarContent", function(divHtml) {
    $('#widgetOne').remove();
    $("#widgetContent").append(divHtml);
});


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
                id: domObj.dwItem.id,
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
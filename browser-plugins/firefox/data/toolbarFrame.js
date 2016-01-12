window.trailingActive = false;
window.panelActive = true;
window.dataItemsActive = false;
window.refreshTrails = false;
window.createTrailMode = false;
window.newTrailName = '';

//
//Handle messages from the AddIn
//
function addInMessageHandler(event) {
  try {
    var msg = JSON.parse(event.data);

    switch(msg.type) {
      case 'login-success-target-toolbar-frame':
          setUIStateToLoggedIn(msg.pluginState);
          break;
      case 'logout-success-target-toolbar-frame':
          setUIStateToLoggedOut();
          break;
      default:
          break;
    }
  } catch (ex) {
    console.log('Error decoding message to toolbar frame: ' + ex);
  }
}
function onLoad() {
  window.addEventListener('message', addInMessageHandler);
  postMessageToAddin({action: 'page-loaded'});
}
function syncSelectElementsWithPluginState() {
  clearSelectElements();
  var ps = window.pluginState;
  addItemsToSelectElement(ps.currentTeamList, ps.currentTeam, '#teamList');
  addItemsToSelectElement(ps.currentDomainList, ps.currentDomain, '#domainList');
  addItemsToSelectElement(ps.currentTrailList, ps.currentTrail, '#trailList');
  if(ps.currentTrail){ //If not creating a trail, set the trail to the first available
    if(!window.refreshTrails) {
        window.refreshTrails = false;
        window.createTrailMode = false;
        $('#trailList')[0].onchange();
    }else{ //If creating a trail, set the trail to the name created, then notify the addin of the change since we
        //worked around the dropdown trailSelectionChanged event
        window.refreshTrails = false;
        window.createTrailMode = false;

        $('#trailList').val(window.newTrailName);
        postMessageToAddin({
            action: 'set-current-trail-target-addin',
            value: $('#trailList').val()
        });
    }
  }
}

function clearSelectElements() {
  $('#domainList').children().remove().end();
  $('#trailList').children().remove().end();
  $('#teamList').children().remove().end();
}
function addItemsToSelectElement(items, currentItem, idSelector) {
  $.each(items, function (i, item) {
    $(idSelector).append($('<option>', {
      value: item.name,
      text: item.name
    }));
  });
  if (currentItem && currentItem.name) {
    $(idSelector).val(currentItem.name);
  }
}

function toggleTrailing() {
  if (window.trailingActive) {
    $('#loginButton').show();
    $('#domainList').removeAttr('disabled');
    $('#trailList').removeAttr('disabled');
    $('#trailInput').removeAttr('disabled');
    $('#teamList').removeAttr('disabled');
    $('#toggleTrailButton')
      .addClass('btn-success')
      .removeClass('btn-default')
      .html('Start');
    $('body').removeClass('body-throb');
    togglePanelButtonOff();
    toggleDataItemButtonOff();
  } else {
    $('#loginButton').hide();
    $('#domainList').attr('disabled', 'disabled');
    $('#trailList').attr('disabled', 'disabled');
    //$('#trailInput').val('');
    $('#trailInput').attr('disabled', 'disabled');
    $('#teamList').attr('disabled', 'disabled');
    $('#toggleTrailButton')
      .removeClass('btn-success')
      .addClass('btn-default')
      .html('Stop');
    $('body').addClass('body-throb');
    togglePanelButtonOn();
    toggleDataItemButtonOn
  }
  window.trailingActive = !window.trailingActive;
  postMessageToAddin({
    action: 'set-trailing-active',
    data: window.trailingActive
  });
}

function setUIStateToLoggedIn(pluginState) {
  window.pluginState = pluginState;
  $('#loginButton')
    .html('Logout: ' + pluginState.loggedInUser.username)
    .removeClass('btn-primary')
    .addClass('btn-danger');
  $('#teamList').removeAttr('disabled');
  $('#domainList').removeAttr('disabled');
  $('#trailList').removeAttr('disabled');
  $('#trailInput').removeAttr('disabled');
  syncSelectElementsWithPluginState();
}
function setUIStateToLoggedOut() {
  //Do this check in case we're logged out via toolbar *and* a browser tab is
  //logged in to the server. The server callback would cause this to be executed
  //again unnecessarily.
  if (!window.pluginState) {
    return;
  }
  window.pluginState = null;
  $('#loginButton')
    .html('Login')
    .addClass('btn-primary')
    .removeClass('btn-danger')
    .show();
  $('#teamList').attr('disabled', 'disabled');
  $('#domainList').attr('disabled', 'disabled');
  $('#trailList').attr('disabled', 'disabled');
  $('#trailInput').val('');
  $('#trailInput').attr('disabled', 'disabled');
  $('#toggleTrailButton').addClass('disabled');
  clearSelectElements();
}
function toggleLogin() {
  if (window.pluginState) {
    //We do this in case user logs out from toolbar.
    setUIStateToLoggedOut();
    //And get through to the server
    postMessageToAddin({action: 'logout'});
  } else {
    //Notify server we'd like to log in
    postMessageToAddin({action: 'login'});
  }
}

function togglePanelButtonOn(){
    $('#toggleDWPanel').attr('src', './images/OnButton_Green_transparent.png');
    window.panelActive = true;
    postMessageToAddin({
        action: 'toggle-panel',
        data: window.panelActive
    });
}

function togglePanelButtonOff(){
    $('#toggleDWPanel').attr('src', './images/OffButton_transparent.png');
    window.panelActive = false;
    postMessageToAddin({
        action: 'toggle-panel',
        data: window.panelActive
    });
}

function togglePanel(){
    if (window.trailingActive){
        if(window.panelActive){
            togglePanelButtonOff();
        }else{
            togglePanelButtonOn();
        }
    }
}

function toggleDataItems(){
    if (window.trailingActive) {
        if (window.dataItemsActive) {
            toggleDataItemButtonOff();
        } else {
            toggleDataItemButtonOn();
        }
    }
}

function toggleDataItemButtonOn(){
    $('#toggleDomainItems').attr('src', './images/OnButton_Green_transparent.png');
    window.dataItemsActive = true;
    postMessageToAddin({
        action: 'toggle-dataitems',
        data: window.dataItemsActive
    });
}

function toggleDataItemButtonOff(){
    $('#toggleDomainItems').attr('src', './images/OffButton_transparent.png');
    window.dataItemsActive = false;
    postMessageToAddin({
        action: 'toggle-dataitems',
        data: window.dataItemsActive
    });
}

//
//ComboBox selection changed handlers
//
function teamSelectionChanged() {
  postMessageToAddin({
    action: 'set-current-team-target-addin',
    value: $('#teamList').val()
  });
}
function domainSelectionChanged() {
  postMessageToAddin({
    action: 'set-current-domain-target-addin',
    value: $('#domainList').val()
  });
  //if(!window.refreshTrails)  {
    $('#trailInput').attr('value', $('#trailList option:selected').text());
  //}
}

function trailSelectionChanged2(){
    if($('#trailInput').val()){
        window.refreshTrails = true;
        trailSelectionChanged();
    }
}

function trailSelectionChanged() {
  //http://jsfiddle.net/nwH8A/ this.nextElementSibling.value=this.value

  //detect if we're adding a new trail
  if(!window.createTrailMode){
      if(window.refreshTrails){
          $('#trailList option').each(function(){
              if (this.value == $('#trailInput').val()) {
                  window.createTrailMode = false;
                  return false;
              }
          });
          window.createTrailMode = true;
      }else{
          window.createTrailMode = false;
      }

      if(window.createTrailMode){
          //Lock the toolbar until the new Trail is either created or cancelled
          lockToolbar();
      }else{
          $('#trailInput').val($('#trailList option:selected').text());
          $('#toggleTrailButton').removeClass('disabled');
          postMessageToAddin({
              action: 'set-current-trail-target-addin',
              value: $('#trailList').val()
          });
      }
  }
}

function lockToolbar(){
    $('#domainList').addClass('disabled');
    $('#toggleDiv').hide();
    $('#domainDiv').hide();
    $('#toggleTrailButton').hide();
    $('#loginButton').hide();
    $('#addTrailButton').show();
    $('#cancelTrailButton').show();
}

function unlockToolbar(){
    $('#domainList').removeAttr('disabled');
    $('#toggleDiv').show();
    $('#domainDiv').show();
    $('#toggleTrailButton').show();
    $('#loginButton').show();
    $('#addTrailButton').hide();
    $('#cancelTrailButton').hide();
}

function createTrail(){
    if($('#trailInput').val()){
        window.newTrailName = $('#trailInput').val();
        postMessageToAddin({
            action: 'add-current-trail-to-domain-target-addin',
            trailName: window.newTrailName
        });
        unlockToolbar();
    }
}

function cancelTrail(){
    //reset the input box to blank, set trailist to 0
    unlockToolbar();
    window.createTrailMode = true;
    window.refreshTrails = false;
    $('#trailList')[0].onchange();
}

function openTab(tabTarget){
    postMessageToAddin({
        action: 'open-new-tab-target-addin',
        tabTarget: tabTarget
    });
}

//
//Communication with AddIn
//
function postMessageToAddin(msg) {
  window.parent.postMessage(msg, '*');
}

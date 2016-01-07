window.trailingActive = false;
window.panelActive = true;
window.dataitemsActive = false;
window.refreshTrails = false;
window.createTrailMode = false;
window.addTrailText = ' < add Trail >';

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
  if(ps.currentTrailList.length==0){
      $('#trailList').attr('disabled', 'disabled');
      $('#trailInput').val(window.addTrailText);
  }
  if(ps.currentTrail){
    if(!window.refreshTrails) {
        window.refreshTrails = false;
        window.createTrailMode = false;
    }else{ //If creating a trail, set the trail to the name created, then notify the addin of the change since we
        //worked around the dropdown trailSelectionChanged event
        window.refreshTrails = false;
        window.createTrailMode = false;
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
        if (window.dataitemsActive) {
            toggleDataItemButtonOff();
        } else {
            toggleDataItemButtonOn();
        }
    }
}

function toggleDataItemButtonOn(){
    $('#toggleDomainItems').attr('src', './images/OnButton_Green_transparent.png');
    window.dataitemsActive = true;
    postMessageToAddin({
        action: 'toggle-dataitems',
        data: window.dataitemsActive
    });
}

function toggleDataItemButtonOff(){
    $('#toggleDomainItems').attr('src', './images/OffButton_transparent.png');
    window.dataitemsActive = false;
    postMessageToAddin({
        action: 'toggle-dataitems',
        data: window.dataitemsActive
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
  $('#trailInput').val(window.addTrailText);
}

function trailSelectionChangedManual(){
    if($('#trailInput').val()){
        window.refreshTrails = true;
        trailSelectionChanged();
    }
}

function clearTrailInput(){
    $('#divError').hide();
    $('#trailInput').val('');
    $('#toggleTrailButton').addClass('disabled');
}

function trailSelectionChanged() {
    //detect if we're adding a new trail
    if (!window.createTrailMode) {
      if (window.refreshTrails) {
          $('#trailList option').each(function () {
              if (this.value == $('#trailInput').val()) {
                  window.createTrailMode = false;
                  return false;
              }
          });
          window.createTrailMode = true;
      } else {
          window.createTrailMode = false;
      }

      if (window.createTrailMode) {
          lockToolbar();
      } else if ($('#trailInput').val() != '< add trail >') {
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
    $('#trailInput').removeAttr('.select-editable');
    $('#trailInput').addClass('.selected-editable');
    $('#trailList').hide();
    $('#toggleDiv').hide();
    $('#domainDiv').hide();
    $('#toggleTrailButton').hide();
    $('#loginButton').hide();
    $('#addTrailButton').show();
    $('#cancelTrailButton').show();
}

function unlockToolbar(){
    $('#domainList').removeAttr('disabled');
    $('#trailInput').addClass('.select-editable');
    $('#trailInput').removeAttr('.selected-editable');
    $('#trailList').show();
    $('#toggleDiv').show();
    $('#domainDiv').show();
    $('#toggleTrailButton').show();
    $('#loginButton').show();
    $('#addTrailButton').hide();
    $('#cancelTrailButton').hide();
}

function createTrail(){
    $('#divError').hide();
    if($('#trailInput').val()){
        //Does this already exist? If so show error
        var isNewTrail=true;

        $('#trailList option').each(function(){
            if (this.value == $('#trailInput').val()) {
                isNewTrail= false;
            }
        });

        if(isNewTrail) {
            $('#divError').hide();
            postMessageToAddin({
                action: 'add-current-trail-to-domain-target-addin',
                trailName: $('#trailInput').val()
            });
            unlockToolbar();
            $('#trailInput').val(window.addTrailText);
        }else{
            //Show error and don't submit
            $('#divError').show();
        }
    }
}

function cancelTrail(){
    //reset the input box
    unlockToolbar();
    window.createTrailMode = true;
    window.refreshTrails = false;
    $('#trailInput').val(window.addTrailText);
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

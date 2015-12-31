window.trailingActive = false;
window.panelActive = true;
//
//Handle messages from the AddIn
//
function addInMessageHandler(event) {
  try {
    var msg = JSON.parse(event.data);
    if (msg.type == 'login-success-target-toolbar-frame') {
      setUIStateToLoggedIn(msg.pluginState);
    } else if (msg.type == 'logout-success-target-toolbar-frame') {
      setUIStateToLoggedOut();
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
  if(ps.currentTrail){
    $('#trailList')[0].onchange();
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

var dataItemsVisible;
function toggleDataItems(){
    if(dataItemsVisible){
        toggleDataItemButtonOff();
    }else{
        toggleDataItemButtonOn();
    }
}

function toggleDataItemButtonOn(){
    $('#toggleDomainItems').attr('src', "./images/OnButton_Green_transparent.png");
    dataItemsVisible = true;
}

function toggleDataItemButtonOff(){
    $('#toggleDomainItems').attr('src', "./images/OffButton_transparent.png");
    dataItemsVisible = false;
}

function toggleTrailing() {
  if (window.trailingActive) {
    $('#loginButton').show();
    $('#domainList').removeAttr('disabled');
    $('#trailList').removeAttr('disabled');
    $('#teamList').removeAttr('disabled');
    $('#toggleTrailButton')
      .addClass('btn-success')
      .removeClass('btn-default')
      .html('Start');
    $('body').removeClass('body-throb');
    togglePanelButtonOff();
  } else {
    $('#loginButton').hide();
    $('#domainList').attr('disabled', 'disabled');
    $('#trailList').attr('disabled', 'disabled');
    $('#teamList').attr('disabled', 'disabled');
    $('#toggleTrailButton')
      .removeClass('btn-success')
      .addClass('btn-default')
      .html('Stop');
    $('body').addClass('body-throb');
    togglePanelButtonOn();
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
  $('#toggleTrailButton').addClass('disabled');
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
    $('#toggleDWPanel').attr('src', "./images/OnButton_Green_transparent.png");
    window.panelActive = true;
    postMessageToAddin({
        action: 'toggle-panel',
        data: window.panelActive
    });
}

function togglePanelButtonOff(){
    $('#toggleDWPanel').attr('src', "./images/OffButton_transparent.png");
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
}
function trailSelectionChanged() {
  //http://jsfiddle.net/nwH8A/ this.nextElementSibling.value=this.value
  var newOption=false;

  //detect if we're adding a new domain
  if(!newOption){
      //this.nextElementSibling.value=this.value;
      $('#trailInput').attr('value', $('#trailList option:selected').text());
      $('#toggleTrailButton').removeClass('disabled');
      postMessageToAddin({
          action: 'set-current-trail-target-addin',
          value: $('#trailList').val()
      });
  }else{
      //1. Lock the toolbar until the new Trail is either created or cancelled
      //2. Submit the new trail
      //3. refresh the trail dropdown to get the newly created trail and id, set the dropdown to the created trail
  }

}
//
//Communication with AddIn
//
function postMessageToAddin(msg) {
  window.parent.postMessage(msg, '*');
}

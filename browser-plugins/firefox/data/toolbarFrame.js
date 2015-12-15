window.trailingActive = false;
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
function toggleTrailing() {
  if (window.trailingActive) {
    $('#loginButton').removeClass('disabled');
    $('#domainList').removeAttr('disabled');
    $('#trailList').removeAttr('disabled');
    $('#teamList').removeAttr('disabled');
    $('#toggleTrailButton')
      .addClass('btn-success')
      .removeClass('red-throb')
      .html('Start');
  } else {
    $('#loginButton').addClass('disabled');
    $('#domainList').attr('disabled', 'disabled');
    $('#trailList').attr('disabled', 'disabled');
    $('#teamList').attr('disabled', 'disabled');
    $('#toggleTrailButton')
      .removeClass('btn-success')
      .addClass('red-throb')
      .html('Stop');
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
    .removeClass('btn-success')
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
    .addClass('btn-success')
    .removeClass('btn-danger');
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
function togglePanel(){
    postMessageToAddin({action: 'toggle-panel'});
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
  $('#toggleTrailButton').removeClass('disabled');
  postMessageToAddin({
    action: 'set-current-trail-target-addin',
    value: $('#trailList').val()
  });
}
//
//Communication with AddIn
//
function postMessageToAddin(msg) {
  window.parent.postMessage(msg, '*');
}

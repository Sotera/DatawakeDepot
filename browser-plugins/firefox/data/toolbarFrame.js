window.trailingActive = false;
//
//Handle messages from the AddIn
//
function addInMessageHandler(event){
  try {
    var msg = event.data;
    if (msg.type == 'login-success-target-toolbar-frame') {
      setUIStateToLoggedIn(msg.pluginState);
    } else if (msg.type == 'logout-success-target-toolbar-frame') {
      setUIStateToLoggedOut();
    } else if (msg.type == 'updated-teams-target-toolbar-frame') {
      updateTeams(msg.teams, msg.currentTeam);
    } else if (msg.type == 'updated-domains-target-toolbar-frame') {
      updateDomains(msg.domains, msg.currentDomain);
    } else if (msg.type == 'updated-trails-target-toolbar-frame') {
      updateTrails(msg.trails, msg.currentTrail);
    }
  } catch (ex) {
    console.log('Error decoding message to toolbar frame: ' + ex);
  }
}
function onLoad() {
  window.addEventListener('message', addInMessageHandler);
  postMessageToAddin({action: 'page-loaded'});
}
function clearDomains() {
  $('#domainList').children().remove().end();
}
function clearTrails() {
  $('#trailList').children().remove().end();
}
function updateDomains(domains, currentDomain) {
  clearDomains();
  $.each(domains, function (i, domain) {
    $('#domainList').append($('<option>', {
      value: domain.name,
      text: domain.name
    }));
  });
  //Select a domain (no blank domain in combo box unless we have none)
  if (currentDomain && currentDomain.name) {
    $('#domainList').val(currentDomain.name);
  } else {
    $('#domainList')[0].onchange();
  }
}
function updateTrails(trails, currentTrail) {
  clearTrails();
  $.each(trails, function (i, trail) {
    $('#trailList').append($('<option>', {
      value: trail.name,
      text: trail.name
    }));
  });
  //Select a trail (no blank trail in combo box unless we have none)
  if (currentTrail && currentTrail.name) {
    $('#trailList').val(currentTrail.name);
  } else {
    $('#trailList')[0].onchange();
  }
}
function toggleTrailing() {
  if (window.trailingActive) {
    $('#loginButton').removeClass('disabled');
    $('#domainList').removeAttr('disabled');
    $('#trailList').removeAttr('disabled');
    $('#toggleTrailButton')
      .addClass('btn-success')
      .removeClass('red-throb')
      .html('Start');
  } else {
    $('#loginButton').addClass('disabled');
    $('#domainList').attr('disabled', 'disabled');
    $('#trailList').attr('disabled', 'disabled');
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
  $('#domainList').attr('disabled', 'disabled');
  $('#trailList').attr('disabled', 'disabled');
  $('#toggleTrailButton').addClass('disabled');
  clearTrails();
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
//
//ComboBox selection changed handlers
//
function teamSelectionChanged() {
  postMessageToAddin({
    action: 'set-current-team-target-addin',
    teamValue: $('#teamList').val()
  });
}
function domainSelectionChanged() {
  postMessageToAddin({
    action: 'set-current-domain-target-addin',
    domainValue: $('#domainList').val()
  });
}
function trailSelectionChanged() {
  $('#toggleTrailButton').removeClass('disabled');
  postMessageToAddin({
    action: 'set-current-trail-target-addin',
    trailValue: $('#trailList').val()
  });
}
//
//Communication with AddIn
//
function postMessageToAddin(msg) {
  window.parent.postMessage(msg, '*');
}

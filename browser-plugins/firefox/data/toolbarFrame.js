window.trailingActive = false;
function domainSelectionChanged() {
}
function trailSelectionChanged() {
  $('#toggleTrailButton').removeClass('disabled');
}
function onLoad() {
  window.addEventListener('message', function (event) {
    try {
      var msg = event.data;
      if (msg.type == 'login-success-target-toolbar-frame') {
        setUIStateToLoggedIn(msg.user);
      } else if (msg.type == 'logout-success-target-toolbar-frame') {
        //We do this in case user logs out from WebApp. We'll get a signal from the
        //content script and we need to reset the toolbar UI
        setUIStateToLoggedOut();
      } else if (msg.type == 'updated-trails-target-toolbar-frame') {
        updateTrails(msg.trails);
      }
    } catch (ex) {
      console.log('Error decoding message to toolbar frame: ' + ex);
    }
  });
  postMessageToAddin({action: 'page-loaded'});
}
function clearTrails() {
  $('#trailList').children().remove().end();
}
function updateTrails(updatedTrails) {
  clearTrails();
  $.each(updatedTrails, function (i, trail) {
    $('#trailList').append($('<option>', {
      value: trail.name,
      text: trail.name
    }));
  });
}
function toggleTrailing() {
  if (window.trailingActive) {
    $('#loginButton').removeClass('disabled');
    $('#domainList').removeAttr('disabled');
    $('#trailList').removeAttr('disabled');
    $('#toggleTrailButton')
      .addClass('btn-success')
      .removeClass('red-throb')
      .html('Start Trailing');
  } else {
    $('#loginButton').addClass('disabled');
    $('#domainList').attr('disabled', 'disabled');
    $('#trailList').attr('disabled', 'disabled');
    $('#toggleTrailButton')
      .removeClass('btn-success')
      .addClass('red-throb')
      .html('Stop Trailing');
  }
  window.trailingActive = !window.trailingActive;
  postMessageToAddin({
    action: 'set-trailing-active',
    data: window.trailingActive
  });
}
function setUIStateToLoggedIn(user) {
  window.aminoUser = user;
  $('#loginButton')
    .html('Logout: ' + user.username)
    .removeClass('btn-success')
    .addClass('btn-danger');
  $('#trailList').removeAttr('disabled');
  $('#toggleTrailButton').addClass('disabled');
  postMessageToAddin({action: 'request-trails-target-addin'});
}
function setUIStateToLoggedOut() {
  //Do this check in case we're logged out via toolbar *and* a browser tab is
  //logged in to the server. The server callback would cause this to be executed
  //again unnecessarily.
  if (!window.aminoUser) {
    return;
  }
  window.aminoUser = null;
  $('#loginButton')
    .html('Login')
    .addClass('btn-success')
    .removeClass('btn-danger');
  $('#trailList').attr('disabled', 'disabled');
  $('#toggleTrailButton').addClass('disabled');
  clearTrails();
}
function toggleLogin() {
  if (window.aminoUser) {
    //We do this in case user logs out from toolbar.
    setUIStateToLoggedOut();
    //And get through to the server
    postMessageToAddin({action: 'logout'});
  } else {
    //Notify server we'd like to log in
    postMessageToAddin({action: 'login'});
  }
}
function postMessageToAddin(msg) {
  window.parent.postMessage(msg, '*');
}

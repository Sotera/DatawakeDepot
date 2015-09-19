function onLoad() {
/*  var trails = ['Trail 1', 'Trail 2', 'Trail 3'];
  var select = window.document.getElementById('trailList');
  for (var i = 0; i < trails.length; ++i) {
    var option = window.document.createElement('option');
    option.innerHTML = trails[i];
    option.value = trails[i];
    select.appendChild(option);
  }*/
  //window.document.body.style.border = '5px solid red';
  window.addEventListener('message', function (event) {
    var req = window.superagent;
    req.get('https://api.github.com/repos/visionmedia/superagent', function (res) {
      var r = res;
    });
    //e.source.postMessage('pong', event.origin);
    try {
      var msg = event.data;
      var loginButton = window.document.getElementById('loginButton');
      var startTrailButton = window.document.getElementById('startTrailButton');
      if (msg.type == 'login-success-target-toolbar-frame') {
        window.aminoUser = msg.user;
        loginButton.innerHTML = 'Logout: ' + window.aminoUser.username;
        loginButton.classList.remove('btn-success');
        loginButton.classList.add('btn-danger');
        startTrailButton.classList.remove('disabled');
      } else if (msg.type == 'logout-success-target-toolbar-frame') {
        window.aminoUser = null;
        loginButton.innerHTML = 'Login';
        loginButton.classList.remove('btn-danger');
        loginButton.classList.add('btn-success');
        startTrailButton.classList.add('disabled');
      }
    } catch (ex) {
      console.log('Error decoding message to toolbar frame: ' + ex);
    }
  });
  window.parent.postMessage('page-loaded', '*');
}
function startTrailing() {
}
function login() {
  //window.document.body.style.border = '5px solid red';
  if (window.aminoUser) {
    window.parent.postMessage('logout', '*');
  } else {
    window.parent.postMessage('login', '*');
  }
}

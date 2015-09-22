function trailSelectionChanged() {
}
function onLoad() {
  /*
   var trails = ['Select Trail', 'Woo Hoo Trail', 'Woo Lai Trail'];
   var select = window.document.getElementById('trailList');
   for (var i = 0; i < trails.length; ++i) {
   var option = window.document.createElement('option');
   option.innerHTML = trails[i];
   option.value = trails[i];
   if (i == 0) {
   option.value = '';
   option.setAttribute('disabled', 'disabled');
   option.setAttribute('selected', 'selected');
   }
   select.appendChild(option);
   }*/
  //window.document.body.style.border = '5px solid red';
  window.addEventListener('message', function (event) {
    //e.source.postMessage('pong', event.origin);
    try {
      var msg = event.data;
      var loginButton = window.document.getElementById('loginButton');
      var trailList = window.document.getElementById('trailList');
      var startTrailButton = window.document.getElementById('startTrailButton');
      if (msg.type == 'login-success-target-toolbar-frame') {
        window.aminoUser = msg.user;
        loginButton.innerHTML = 'Logout: ' + window.aminoUser.username;
        loginButton.classList.remove('btn-success');
        loginButton.classList.add('btn-danger');
        trailList.removeAttribute('disabled');
        loadTrails();
      } else if (msg.type == 'logout-success-target-toolbar-frame') {
        window.aminoUser = null;
        loginButton.innerHTML = 'Login';
        loginButton.classList.remove('btn-danger');
        loginButton.classList.add('btn-success');
        trailList.setAttribute('disabled', 'disabled');
        clearTrails();
      }
    } catch (ex) {
      console.log('Error decoding message to toolbar frame: ' + ex);
    }
  });
  window.parent.postMessage('page-loaded', '*');
}
function clearTrails() {
  $('#trailList').children().remove().end();
}
function loadTrails() {
  clearTrails();
  var req = window.superagent;
  req.get('http://localhost:3000/api/dwTrails', function (res) {
    var errorMsg = 'GET /api/dwTrails call FAILED';
    try {
      if (res.status === 200) {
        var rawTrails = JSON.parse(res.text);
        $.each(rawTrails, function (i, trail) {
          $('#trailList').append($('<option>', {
            value: name,
            text: name
          }));
        });
      } else {
        console.log(errorMsg);
      }
    } catch (ex) {
      console.log(errorMsg + ': ' + ex);
    }
  });
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

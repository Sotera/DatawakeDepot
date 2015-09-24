window.trailingActive = false;

function trailSelectionChanged() {
  $('#toggleTrailButton').removeClass('disabled');
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
      if (msg.type == 'login-success-target-toolbar-frame') {
        window.aminoUser = msg.user;
        $('#loginButton').html('Logout: ' + window.aminoUser.username);
        $('#loginButton').removeClass('btn-success');
        $('#loginButton').addClass('btn-danger');
        $('#trailList').removeAttr('disabled');
        $('#toggleTrailButton').addClass('disabled');
        loadTrails();
      } else if (msg.type == 'logout-success-target-toolbar-frame') {
        window.aminoUser = null;
        $('#loginButton').html('Login');
        $('#loginButton').addClass('btn-success');
        $('#loginButton').removeClass('btn-danger');
        $('#trailList').attr('disabled', 'disabled');
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
//  req.get('http://datawake-depot.org/api/dwTrails', function (res) {
    var errorMsg = 'GET /api/dwTrails call FAILED';
    try {
      if (res.status === 200) {
        var rawTrails = JSON.parse(res.text);
        if(!rawTrails.length){
          return;
        }
        $.each(rawTrails, function (i, trail) {
          $('#trailList').append($('<option>', {
            value: trail.name,
            text: trail.name
          }));
        });
        $('#trailList')[0].onchange();
      } else {
        console.log(errorMsg);
      }
    } catch (ex) {
      console.log(errorMsg + ': ' + ex);
    }
  });
}
function toggleTrailing() {
  if(window.trailingActive){
    $('#loginButton').removeClass('disabled');
    $('#trailList').removeAttr('disabled');
    $('#toggleTrailButton').addClass('btn-success');
    $('#toggleTrailButton').removeClass('red-throb');
    $('#toggleTrailButton').html('Start Trailing');
  }else{
    $('#loginButton').addClass('disabled');
    $('#trailList').attr('disabled', 'disabled');
    $('#toggleTrailButton').removeClass('btn-success');
    $('#toggleTrailButton').addClass('red-throb');
    $('#toggleTrailButton').html('Stop Trailing');
  }
  window.trailingActive = !window.trailingActive;
}
function login() {
  //window.document.body.style.border = '5px solid red';
  if (window.aminoUser) {
    window.parent.postMessage('logout', '*');
  } else {
    window.parent.postMessage('login', '*');
  }
}

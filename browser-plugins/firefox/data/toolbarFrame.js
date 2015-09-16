function onLoad() {
  //window.document.body.style.border = '5px solid red';
  window.addEventListener('message', function (event) {
    var req= window.superagent;
    req.get('https://api.github.com/repos/visionmedia/superagent',function(res){
      var r = res;
    });
    //e.source.postMessage('pong', event.origin);
    try {
      var msg = event.data;
      if (msg.type == 'login-success-target-toolbar-frame') {
        var button = window.document.getElementById('loginButton');
        button.innerHTML = 'Logout';
        button.classList.remove('loginButton');
        button.classList.add('logoutButton');
      }
    } catch (ex) {
      console.log('Error decoding message to toolbar frame: ' + ex);
    }
  });
  window.parent.postMessage('page-loaded', '*');
}
function login() {
  //window.document.body.style.border = '5px solid red';
  window.parent.postMessage('login', '*');
}

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
      var button = window.document.getElementById('loginButton');
      if (msg.type == 'login-success-target-toolbar-frame') {
        window.aminoUser = msg.user;
        button.innerHTML = 'Logout: ' + window.aminoUser.username;
        button.classList.remove('loginButton');
        button.classList.add('logoutButton');
      }else if (msg.type == 'logout-success-target-toolbar-frame') {
        window.aminoUser = null;
        button.innerHTML = 'Login';
        button.classList.remove('logoutButton');
        button.classList.add('loginButton');
      }
    } catch (ex) {
      console.log('Error decoding message to toolbar frame: ' + ex);
    }
  });
  window.parent.postMessage('page-loaded', '*');
}
function login() {
  //window.document.body.style.border = '5px solid red';
  if(window.aminoUser){
    window.parent.postMessage('logout', '*');
  }else{
    window.parent.postMessage('login', '*');
  }
}

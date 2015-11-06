//This is the injected content script. It only gets injected into http://datawake-depot.org
//pages
self.port.on('logout-target-content-script', function (message) {
  //This message is from the content script to the listening page script
  //setup in: browserPlugin.service.js in the datawake-depot app
  var msg = {
    type: 'logout'
  }
  window.postMessage(msg, '*');
});
self.port.on('page-attached-target-content-script', function (message) {
  //This listener will hear back from the page script
  window.addEventListener('message', function (event) {
    try {
      var msg = event.data;
      if (msg.type == 'handshake-ack') {
        //document.body.style.border = '5px solid green';
      }
      else if (msg.type == 'logout-success-target-content-script') {
        self.port.emit('logout-success-target-plugin');
      }
      else if (msg.type == 'login-success-target-content-script') {
        //document.body.style.border = '5px solid yellow';
        //Login was successful so tell mainline plugin about our logged in
        //user (Remember this code is running in a content script).
        self.port.emit('login-success-target-plugin', {
          accessToken: msg.user.accessToken,
          username: msg.user.username,
          id: msg.user.id
        });
      } else {
        //document.body.style.border = '5px solid blue';
      }
    }
    catch (ex) {
      //document.body.style.border = '5px solid red';
    }
  });
  //This message is from the content script to the listening page script
  //setup in: browserPlugin.service.js in the datawake-depot app
  var msg = {
    type: 'handshake'
  }
  window.postMessage(msg, '*');
  //window.postMessage(JSON.stringify(msg), '*');
  //document.body.innerHTML = "<h1>" + message + "</h1>";
});
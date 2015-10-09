//This is the injected content script. It gets injected into all non-http://datawake-depot.org
//pages
function scrapePage() {
  try {
    var html = $('body').html();
    var zip = new JSZip();
     zip.file('zipped-content.zip', html);
    var zippedHtml = zip.generate({type: 'string',compression: 'DEFLATE'});
    var pageContents = {
      //html: encodeURIComponent($('body').html())
      //html: $('body').html()
      html: zippedHtml
    };
    console.log("Emitting page contents....");
    self.port.emit("contents", pageContents);
  }
  catch (e) {
    console.error("Unable to Scrape Page: " + e);
  }
}
self.port.on('page-attached-target-content-script', function (message) {
    $(window).on('hashchange', scrapePage);
    scrapePage();

  //This listener will hear back from the page script
  /*  window.addEventListener('message', function(event){
   try{
   var msg = event.data;
   if(msg.type == 'handshake-ack'){
   //document.body.style.border = '5px solid green';
   }
   else if(msg.type == 'logout-success-target-content-script'){
   self.port.emit('logout-success-target-plugin');
   }
   else if(msg.type == 'login-success-target-content-script'){
   //document.body.style.border = '5px solid yellow';
   //Login was successful so tell mainline plugin about our logged in
   //user (Remember this code is running in a content script).
   self.port.emit('login-success-target-plugin', msg.user);
   }else{
   //document.body.style.border = '5px solid blue';
   }
   }
   catch(ex){
   //document.body.style.border = '5px solid red';
   }
   });*/
  document.body.style.border = '5px solid red';
  //This message is from the content script to the listening page script
  //setup in: browserPlugin.service.js in the datawake-depot app
  /*  var msg = {
   type: 'handshake'
   }
   window.postMessage(msg, '*');*/
  //window.postMessage(JSON.stringify(msg), '*');
  //document.body.innerHTML = "<h1>" + message + "</h1>";

});
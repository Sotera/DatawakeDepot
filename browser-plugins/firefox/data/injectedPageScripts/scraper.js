//This is the injected content script. It gets injected into all non-http://datawake-depot.org
//pages
var myContentScriptKey = null;
$(document).ready(function () {
});
function scrapePage() {
  try {
    var html = $('body').html();
    var zip = new JSZip();
    zip.file('zipped-html-body.zip', html);
    var zippedHtmlBody = zip.generate({type: 'string', compression: 'DEFLATE'});
    var pageContents = {
      url: window.document.URL,
      zippedHtmlBody: zippedHtmlBody
    };
    self.port.emit('zipped-html-body-target-addin', pageContents);
  }
  catch (e) {
    console.error("Unable to Scrape Page: " + e);
  }
}
self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  scrapePage();
  //self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

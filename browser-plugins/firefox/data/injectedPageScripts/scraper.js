//This is the injected content script. It gets injected into all non-http://datawake-depot.org
//pages
var zip = new JSZip();
function scrapePage() {
  try {
/*    var html = $('body').html();
    zip.file('zipped-html-body.zip', html);
    var zippedHtmlBody = zip.generate({type: 'string', compression: 'DEFLATE'});
    var pageContents = {
      Url: window.document.URL,
      zippedHtmlBody: zippedHtmlBody
    };
    self.port.emit('zipped-html-body', pageContents);*/
  }
  catch (e) {
    console.error("Unable to Scrape Page: " + e);
  }
}
self.port.on('page-attached-target-content-script', function (message) {
  $(window).on('hashchange', scrapePage);
  scrapePage();
});
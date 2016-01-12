//This is the injected content script. It gets injected into all non-http://datawake-depot.org
//pages
var myContentScriptKey = null;
$(document).ready(function () {
});
function scrapePage() {
  try {
    var html = $('body').html();
    if(html && typeof html === 'string' && html.length){
      /*    var zip = new JSZip();
       zip.file('zipped-html-body.zip', html);
       var zippedHtmlBody = zip.generate({type: 'string', compression: 'DEFLATE'});*/
      var trailUrl =  window.document.URL;
      var zippedHtmlBody = html;
      var searchTerms = getSearchTerms(trailUrl);

      var pageContents = {
        url: trailUrl,
        zippedHtmlBody: zippedHtmlBody,
        searchTerms: searchTerms
      };
      self.port.emit('zipped-html-body-target-addin', pageContents);
    }
  }
  catch (e) {
    console.error("Unable to Scrape Page: " + e);
  }
}

function getSearchTerms(trailUrl){
    var parser = document.createElement('a');
    parser.href = trailUrl;
    var decodedUrl = decodeURI(trailUrl);

    var searchTerm = '';
    var searchTerms = [];
    if (parser.hostname.indexOf("google.com") > -1) {
        var results = new RegExp('[\?&#]' + "q" + '=([^&#]*)').exec(decodedUrl);
        if (results != null) {
            searchTerm = results[1] || 0;
            searchTerms.push(searchTerm);
        }
    } else if (parser.hostname.indexOf("yahoo.com") > -1) {
        var results = new RegExp('[\?&#]' + "p" + '=([^&#]*)').exec(decodedUrl);
        if (results != null) {
            searchTerm = results[1] || 0;
            searchTerms.push(searchTerm);
        }
    } else if (parser.hostname.indexOf("bing.com") > -1) {
        var results = new RegExp('[\?&#]' + "pq" + '=([^&#]*)').exec(decodedUrl);
        if (results != null) {
            searchTerm = results[1] || 0;
            searchTerms.push(searchTerm);
        }
    } else if ((parser.hostname.indexOf('doubleclick') > -1) || ( parser.hostname.indexOf('ads') > -1)) {
        // skip common ads
        return;
    }
    else {
        var results = new RegExp('[\?&#](keyword|query|search|p|q|pq)=([^&#]*)').exec(decodedUrl);
        if (results != null) {
            searchTerm = results[2] || 0;
            searchTerms.push(searchTerm);
        }
    }

    return searchTerms;
}

self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  //Add a very short Pause here to make sure the page finishes rendering before we scrape the body
  $(window).on('hashchange', window.setTimeout(scrapePage, 1000));
  window.setTimeout(scrapePage, 1000);

  //self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

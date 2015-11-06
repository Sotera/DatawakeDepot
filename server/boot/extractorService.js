var es = require('event-stream');
var request = require('request');

module.exports = function(app) {
    var requestUrl = "http://192.168.104.41:3000/api/extract/process";
    var headers = {};
    var dwTrailUrl = app.models.DwTrailUrl;



    function createError(msg, code) {
        var err = new Error(msg);
        err.code = code;

        return err;
    }

    dwTrailUrl.createChangeStream(function(err, changes) {
        changes.on('data', function(change) {
            console.log( change);
        });

        ////console.log(changes.pipe(es.stringify()).pipe(process.stdout));
        //var trailUrl = changes.pipe(es.stringify()).pipe(process.stdout);
        //
        ////console.log(JSON.stringify(changes));
        //switch(changes.type){
        //    case "create":
        //        console.log(JSON.stringify(changes));
        //        break;
        //    case "remove":
        //        console.log("remove:" + changes.id);
        //        break;
        //}
        //
        //if(changes.type === "create") {
        //    ////TODO: make list of extractors dynamic that get loaded on start
        //    ////When a new trail is created or updated POST it to the extractor(s)
        //    request.post({
        //        url: requestUrl,
        //        headers: headers,
        //        //ca: config.ca.register,
        //        //strictSSL: config.strictSsl,
        //        //timeout: config.timeout,
        //        json: true,
        //        form: {
        //            trailId: changes.id,
        //            url: changes.url,
        //            scrapedContent: changes.scrapedContent
        //        }
        //    }, function (err, response) {
        //        // If there was an internal error (e.g. timeout)
        //        if (err) {
        //            return callback(createError('Request to ' + requestUrl + ' failed: ' + err.message, err.code));
        //        }
        //
        //        // Duplicate
        //        if (response.statusCode === 403) {
        //            return callback(createError('Duplicate post', 'EDUPLICATE'));
        //        }
        //
        //        // Invalid format
        //        if (response.statusCode === 400) {
        //            return callback(createError('Invalid URL format', 'EINVFORMAT'));
        //        }
        //
        //        // Everything other than 201 is unknown
        //        if (response.statusCode !== 201) {
        //            return callback(createError('Unknown error: ' + response.statusCode + ' - ' + response.body, 'EUNKNOWN'));
        //        }
        //
        //        //callback(null, {
        //        //    name: name,
        //        //    url: url
        //        //});
        //    });
        //    var x = "success";

    });
};
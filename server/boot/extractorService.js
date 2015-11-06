var es = require('event-stream');
var request = require('request');

module.exports = function (app) {
    var requestUrl = "http://192.168.104.41:3000/api/extract/process";
    var headers = {};
    var dwTrailUrl = app.models.DwTrailUrl;
    var initialized = false;
    var dwUrlExtraction = app.models.DwUrlExtraction;

    dwTrailUrl.createChangeStream(function (err, changes) {



        changes.on('data', function (change) {
            //if(!initialized){
            //    initialized = true;
            //
            //    setInterval(function () {
            //        console.log('hi');
            //        request({
            //            url: requestUrl
            //        }, function (error, response, body) {
            //            if (response) {
            //                if (response.statusCode == 200) {
            //                    JSON.parse(body).forEach(function (extraction) {
            //                        dwUrlExtraction.findOrCreate(extraction);
            //                        //success
            //                    })
            //                }
            //            }
            //            else if (error) {
            //                res.status(500).send(error.message);
            //            }
            //        });
            //    }, 5000)
            //}

            console.log(change);
            switch (change.type) {
                case 'create':
                    request.post({
                        url: requestUrl,
                        headers: headers,
                        form: {
                            dwTrailUrlId: change.data.id.toString(),
                            scrapedContent: change.data.scrapedContent
                        }
                    });
                    break;
                case 'remove':
                    var y = change;
                    break;
            }
        });
    });
};

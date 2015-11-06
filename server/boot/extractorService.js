var es = require('event-stream');
var request = require('request');

module.exports = function (app) {
    var dwTrailUrl = app.models.DwTrailUrl;
    var dwUrlExtraction = app.models.DwUrlExtraction;
    var dwTrail = app.models.DwTrail;
    var headers = {};
    var dwSettingsTimeout;
    var intervalExtractors= [];

    //Get the dwSettingsTimeout
    dwSettingsTimeout = 5000;

    dwTrailUrl.createChangeStream(function (err, changes) {

            changes.on('data', function (change) {
                console.log(change);

                //1. Get extractors for the trail's domain
                dwTrail.findOne({include: [{relation:'domain',include:['extractors']}],where:{id: change.data.id}},function(err,result){


                    //2. If change is a 'create', post to each of the extractors
                    result.domain.extractors.forEach(function (extractor){
                        var extractorUrl =  extractor.protocol + "://" + extractor.extractorUrl + ":" +extractor.port;
                        switch (change.type) {
                            case 'create':
                                request.post({
                                    url: extractorUrl,
                                    headers: headers,
                                    form: {
                                        dwTrailUrlId: change.data.id.toString(),
                                        //handle .zipped content?
                                        scrapedContent: change.data.scrapedContent
                                    }
                                }, function (error, response) {
                                    if (error) {
                                        res.status(500).send(error.message);
                                        return;
                                    }
                                    if (response) {
                                        if (response.statusCode == 200) {
                                            appendExtractor(extractorUrl,extractor);
                                        }
                                        res.status(response.statusCode).end();
                                    }
                                });

                                break;
                            case 'update':
                                //Do we want to re-extract on update?
                                break;
                            case 'remove':
                                break;
                        }
                    });

                });

            });
    });

    intervalExtractors.forEach(function (extractorUrl){
        setInterval(function () {
            request({
                url: extractorUrl
            }, function (error, response, body) {
                if (response) {
                    if (response.statusCode == 200) {
                        JSON.parse(body).forEach(function (extraction) {
                            dwUrlExtraction.findOrCreate(extraction);
                            //success
                        })
                    }
                }
                else if (error) {
                    res.status(500).send(error.message);
                }
            });
        }, dwSettingsTimeout);
    });
};

function appendExtractor (extractorUrl,intervalExtractors){
    if(!intervalExtractors.contains(extractorUrl)){
        intervalExtractors.push(extractorUrl);
    }
};
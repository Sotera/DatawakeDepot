var es = require('event-stream');
var request = require('request');

module.exports = function (app) {
    var me = this;
    var dwTrailUrl = app.models.DwTrailUrl;
    var dwUrlExtraction = app.models.DwUrlExtraction;
    var dwTrail = app.models.DwTrail;
    var headers = {};
    var dwSettingsTimeout;
    var intervalExtractorUrls= [];
    var initialized = false;

    //Get the dwSettingsTimeout
    dwSettingsTimeout = 5000;

    me.unzipContent = function(content){
        //HowTo: decode (unzip)
        var JSZip = require('jszip');
        var zip = new JSZip();
        zip.load(content);
        return zip.file('zipped-html-body.zip').asText();
    };

    me.startIntervalExtractors = function(){
        intervalExtractorUrls.forEach(function (extractorUrl){
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
            initialized = true;
        });
    };

    dwTrailUrl.createChangeStream(function (err, changes) {
        changes.on('data', function (change) {
            console.log(change);

            switch (change.type) {
                case 'create': //If 'create', post to each of the extractors
                    //Get extractors for the trail domains
                    dwTrail.findOne({
                            include:[{relation: 'domain',scope: {include:['extractors']}}],
                            where: {id: change.data.dwTrailId.toString()}
                    }, function (err, trail) {
                        var trailName = trail.name;
                        trail.domain(function (err, domain) {
                            var domainName = domain.name;

                            domain.extractors(function (err, results) {
                                results.forEach(function (extractor) {
                                    var extractorUrl = extractor.protocol + "://" + extractor.extractorUrl + ":" + extractor.port;

                                    //request.post({
                                    //    url: extractorUrl,
                                    //    headers: headers,
                                    //    form: {
                                    //        dwTrailUrlId: change.data.id.toString(),
                                    //        scrapedContent: change.data.scrapedContent.indexOf(" ") == -1 ? me.unzipContent(change.data.scrapedContent) : change.data.scrapedContent
                                    //    }
                                    //}, function (error, response) {
                                    //    if (error) {
                                    //        //res.status(500).send(error.message);
                                    //        return;
                                    //    }
                                    //    if (response) {
                                    //        if (response.statusCode == 200) {
                                    //            if (intervalExtractorUrls.indexOf(extractorUrl) < 0) {
                                    //                intervalExtractorUrls.push(extractorUrl);
                                    //                if (!initialized) {
                                    //                    me.startIntervalExtractors();
                                    //                }
                                    //            }
                                    //        }
                                    //
                                    //    }
                                    //});

                                });
                            });
                        });
                    });
                    break;
                case 'update':
                    break;
                case 'remove':
                    break;
            }
        })
    });
};



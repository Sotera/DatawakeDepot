var es = require('event-stream');
var request = require('request');

module.exports = function (app) {
    var me = this;
    var dwTrailUrl = app.models.DwTrailUrl;
    var dwUrlExtraction = app.models.DwUrlExtraction;
    var dwTrail = app.models.DwTrail;
    var headers = {};
    var dwSettingsTimeout = 5000;
    var initialized = false;
    var dwExtractor = app.models.DwExtractor;
    var dwExtractorMap = {};

    me.unzipContent = function (content) {
        //HowTo: decode (unzip)
        var JSZip = require('jszip');
        var zip = new JSZip();
        zip.load(content);
        return zip.file('zipped-html-body.zip').asText();
    };

    me.getExtractorContainer = function (extractor) {
        var extractorContainer = dwExtractorMap[extractor.id.toString()] || {
                "failureCount": 0,
                "failureLimit": 10,
                "extractor": extractor,
                "extractorUrl": extractor.protocol + "://" + extractor.extractorHost + ":" + extractor.port + "/" + extractor.extractorUrl
            };
        dwExtractorMap[extractor.id.toString()] = extractorContainer;
        return extractorContainer;
    };

    me.startIntervalExtractor = function (extractorContainer) {
        extractorContainer.intervalId = setInterval(function () {
            try {
                request({
                    url: extractorContainer.extractorUrl
                }, function (error, response, body) {
                    if (response && response.statusCode == 200) {
                        extractorContainer.failureCount = 0;
                        try {
                            JSON.parse(body).forEach(function (extraction) {
                                dwUrlExtraction.create(extraction, function (err, obj) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            })
                        }
                        catch (err) {
                            console.log("extractor sent back mal-formed data. " + body);
                        }
                    }
                    else if (error) {
                        console.log("extractor " + extractorContainer.extractor.id + " failed.  We will retry for a bit.");
                        extractorContainer.failureCount++;
                        if (extractorContainer.failureCount > extractorContainer.failureLimit) {
                            console.log("extractor " + extractorContainer.extractor.id + " has failed this app.  Stopping extractor.");
                            me.stopIntervalExtractor(extractorContainer);
                        }
                    }
                });
            }
            catch (err) {
                console.log(err.toString());
            }
        }, dwSettingsTimeout);
    };

    me.stopIntervalExtractor = function (extractorContainer) {
        clearInterval(extractorContainer.intervalId);
    };

    me.startCurrentExtractors = function () {
        if (initialized) {
            return;
        }
        initialized = true;
        dwExtractor.find(function (err, extractors) {
            extractors.forEach(function (extractor) {
                me.startIntervalExtractor(me.getExtractorContainer(extractor));
            })
        });
    };

    dwExtractor.createChangeStream(function (err, changes) {
        changes.on('data', function (change) {
            if (change.type === "create") {
                var extractorContainer = me.getExtractorContainer(change.data);
                me.startIntervalExtractor(extractorContainer);
                return;
            }

            if (change.type === "remove") {
                dwExtractor.findOne({where: {id: change.target.toString()}}, function (err, obj) {
                    if (err || !obj) {
                        return;
                    }
                    me.stopIntervalExtractor(me.getExtractorContainer(obj));
                });
                return;
            }

            if (change.type === "update") {
                dwExtractor.findOne({where: {id: change.target.toString()}}, function (err, obj) {
                    if (err || !obj) {
                        return;
                    }
                    var ec = me.getExtractorContainer(obj);
                    ec.extractor = obj;
                    ec.extractorUrl = ec.extractor.protocol + "://" + ec.extractor.extractorHost + ":" + ec.extractor.port + "/" + ec.extractor.extractorUrl;
                    me.stopIntervalExtractor(ec);
                    me.startIntervalExtractor(ec);

                });

            }

        });
    });

    dwTrailUrl.createChangeStream(function (err, changes) {
        changes.on('data', function (change) {
            switch (change.type) {
                case 'create': //If 'create', post to each of the extractors

                    //start current extractors if not started
                    me.startCurrentExtractors();

                    dwTrail.findOne({
                        include: [{
                            relation: 'domain',
                            scope: {include: [{relation: 'extractors', include: ['serviceType']}]}
                        }],
                        where: {id: change.data.dwTrailId.toString()}
                    }, function (err, trail) {
                        trail.domain(function (err, domain) {
                            //get the domain extractors
                            domain.extractors(function (err, results) {
                                results.forEach(function (extractor) {
                                    //check extractor service type and handle appropriately
                                    extractor.serviceType(function (err, servtype) {
                                        switch (servtype.name) {

                                            case 'ES':
                                                var extractorUrl = extractor.protocol + "://" + extractor.extractorHost + ":" + extractor.port + "/" + extractor.extractorUrl;
                                                var transformedUrl = change.data.scrapedContent;

                                                //begin create CDR
                                                console.log(change.data.id.toString());
                                                dwTrailUrl.findOne({
                                                    "where": {"id": change.data.id.toString()},
                                                    "include": "trail"
                                                }, function (err, trailUrl) {
                                                    trailUrl.trail(function (err, result) {
                                                        var cdr = {
                                                            url: trailUrl.url,
                                                            timestamp: trailUrl.timestamp,
                                                            team: "sotera",
                                                            crawler: "datawake",
                                                            "content-type": "full-raw-html",
                                                            raw_content: change.data.scrapedContent.indexOf("PK") == 0 ? me.unzipContent(change.data.scrapedContent) : change.data.scrapedContent,
                                                            crawl_data: {"domain-name": result.name},
                                                            images: "",
                                                            videos: ""
                                                        }
                                                        request.post({
                                                            url: extractorUrl,
                                                            headers: headers,
                                                            form: {
                                                                dwTrailUrlId: change.data.id.toString(),
                                                                //Code to transform URL goes here
                                                                scrapedContent: cdr
                                                            }
                                                        }, function (error) {
                                                            if (error) {
                                                                console.log(error.message);
                                                            }
                                                        });

                                                    });
                                                });
                                                break;
                                            default:
                                                var extractorUrl = extractor.protocol + "://" + extractor.extractorHost + ":" + extractor.port + extractor.extractorUrl;

                                                request.post({
                                                    url: extractorUrl,
                                                    headers: headers,
                                                    form: {
                                                        dwTrailUrlId: change.data.id.toString(),
                                                        scrapedContent: change.data.scrapedContent.indexOf("PK") == 0 ? me.unzipContent(change.data.scrapedContent) : change.data.scrapedContent
                                                    }
                                                }, function (error) {
                                                    if (error) {
                                                        console.log(error.message);
                                                    }
                                                });
                                                break;
                                        }
                                    })
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



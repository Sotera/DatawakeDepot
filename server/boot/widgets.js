'use strict';
//var async = require('async');
//var deepExtend = require('deep-extend');
var log = require('debug')('routes');

module.exports = function (app) {
    var path = require('path');
    var serverPath = path.join(__dirname,'../modules');

    app.get('/widget/get-domain-list', function (req, res) {
        log('Retrieving dwDomains');
        //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
        app.models.DwDomain.getDataSource().setMaxListeners(0);

        var dwDomain = app.models.DwDomain;

        dwDomain.find(function (err, domains) {
            var domainItems = [];
            domains.forEach(function (domain) {
                domainItems.push({name:domain.name,description: domain.description});
            });
            var renderPath = serverPath.concat('/domainWidget/main');
            res.render(renderPath, {
                "pageTitle": 'Domain Listing',
                "domainList": domainItems
            });
        });
    });

    app.get('/widget/get-url-entities', function (req, res) {
        log('Retrieving Url Entities');
        //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
        app.models.DwTrailUrl.getDataSource().setMaxListeners(0);

        var dwTrailUrl = app.models.DwTrailUrl;

        var whereClause={
            "order":"timestamp DESC",
            "where":{"url":req.query.trailUrl},
            "include":[{"relation":"urlExtractions","scope":{"where": {"extractorTypes": {"nin":["text"]}}, "order":"occurrences DESC"}}]
        };

        dwTrailUrl.findOne(whereClause,function (err, trailUrl) {
            if(err || !trailUrl || !trailUrl.urlExtractions){
                res.render(renderPath,
                    {
                        "pageTitle": 'Extracted Entities',
                        "extractedEntities": {}
                    });
                return;
            }
            trailUrl.urlExtractions(function(err,urlExt){
                var renderPath = serverPath.concat('/extractedEntityWidget/main');
                    res.render(renderPath, {
                        "pageTitle": 'Extracted Entities',
                        "extractedEntities": urlExt
                    });
                }
            )
        });
    });
};



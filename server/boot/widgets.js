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
        app.models.DwUrlExtraction.getDataSource().setMaxListeners(0);

        var dwExtraction = app.models.DwUrlExtraction;

        dwExtraction.find(function (err, extractions) {
            var extractionItems = [];
            extractions.forEach(function (extraction) {
                extractionItems.push({name:extraction.name, value: extraction.value, extractorTypes: extraction.extractorTypes});
            });
            var renderPath = serverPath.concat('/extractedEntityWidget/main');
            res.render(renderPath, {
                "pageTitle": 'Extracted Entities',
                "extractedEntities": extractionItems
            });
        });
    });
};



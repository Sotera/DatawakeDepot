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

        //dwDomain.find()
        //    .then(function(domains){
        //        // Called if the operation succeeds.
        //        var x = domains;
        //        var renderPath = serverPath.concat('/domainWidget/main');
        //        res.render(renderPath, {
        //            "pageTitle": 'Domain Listing',
        //            "domainList": domains
        //        });
        //    })
        //    .catch(function(err){
        //        // Called if the operation encounters an error.
        //    });

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
};



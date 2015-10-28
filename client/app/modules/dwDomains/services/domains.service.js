'use strict';
var app = angular.module('com.module.dwDomains');

app.service('DomainsService', ['$state', 'CoreService', 'DwDomain', 'gettextCatalog', function($state, CoreService, DwDomain, gettextCatalog) {

    this.getDomains = function() {
        return DwDomain.find();
    };

    this.getDomain = function(id) {
        return DwDomain.findById({
            id: id
        });
    };

    this.upsertDomain = function(domain, cb) {
        DwDomain.upsert(domain, function(newDomain) {
            CoreService.toastSuccess(gettextCatalog.getString('Domain saved'), gettextCatalog.getString('Your domain is safe with us!'));

            //TODO: We must first remove all linked items before adding them, otherwise we can't account for removed links

            //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
            if(domain.dwTeams) {
                domain.dwTeams.forEach(function (team) {
                    DwDomain.teams.link({id: newDomain.id, fk: team}, null, function (value, header) {
                        //success
                    });
                });
            };

            if(domain.dwFeeds) {
                domain.dwFeeds.forEach(function (feed) {
                    DwDomain.feeds.link({id: newDomain.id, fk: feed}, null, function (value, header) {
                        //success
                    });
                });
            };

            if(domain.dwExtractors) {
                domain.dwExtractors.forEach(function (extractor) {
                    DwDomain.extractors.link({id: newDomain.id, fk: extractor}, null, function (value, header) {
                        //success
                    });
                });
            };

            cb();
        }, function(err) {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Error saving domain '), gettextCatalog.getString(
                    'This domain could no be saved: ') + err);
        });

    };

    this.deleteDomain = function(domain, cb) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function() {
                DwDomain.deleteById(domain.id, function() {
                    CoreService.toastSuccess(gettextCatalog.getString('Domain deleted'), gettextCatalog.getString('Your domain is deleted!'));

                    //For Many-To-Many relationships you MUST manually unlink the two models for INCLUDE to work in relationships
                    if(domain.dwTeams) {
                        domain.dwTeams.forEach(function (team) {
                            DwDomain.teams.unlink({id: domain.id, fk: team}, null, function (value, header) {
                                //success
                            });
                        });
                    };

                    if(domain.dwFeeds) {
                        domain.dwFeeds.forEach(function (feed) {
                            DwDomain.feeds.unlink({id: domain.id, fk: feed}, null, function (value, header) {
                                //success
                            });
                        });
                    };

                    if(domain.dwExtractors) {
                        domain.dwExtractors.forEach(function (extractor) {
                            DwDomain.extractors.unlink({id: domain.id, fk: extractor}, null, function (value, header) {
                                //success
                            });
                        });
                    };
                    cb();
                }, function(err) {
                    CoreService.toastError(gettextCatalog.getString(
                        'Error deleting domain'), gettextCatalog.getString(
                            'Your domain is not deleted! ') + err);
                });
            },
            function() {
                return false;
            });
    };

}]);

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
        DwDomain.upsert(domain, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Domain saved'), gettextCatalog.getString(
                'Your domain is safe with us!'));
            cb();
        }, function(err) {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Error saving domain '), gettextCatalog.getString(
                    'This domain could no be saved: ') + err);
        });
    };

    this.deleteDomain = function(id, cb) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function() {
                DwDomain.deleteById(id, function() {
                    CoreService.toastSuccess(gettextCatalog.getString(
                        'Domain deleted'), gettextCatalog.getString(
                        'Your domain is deleted!'));
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

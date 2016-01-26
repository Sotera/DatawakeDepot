'use strict';
var app = angular.module('com.module.dwDomains');

app.service('DomainsService', ['$state', 'CoreService', 'DwDomain','gettextCatalog','DwDomainEntityType','DwDomainItem','DwTrail', function($state, CoreService, DwDomain, gettextCatalog, DwDomainEntityType, DwDomainItem, DwTrail) {

    this.getDomains = function() {
        return DwDomain.find({
            filter: {
                include: [
                    'domainEntityTypes',
                    'domainItems',
                    'extractors',
                    'trails',
                    'feeds',
                    'teams'
                ]
            }
        });
    };

    this.getPagedDomains = function(start,number) {
        return DwDomain.find({
            filter: {
                limit: number,
                skip: start,
                order:"name DESC",
                include: [
                    'domainEntityTypes',
                    'domainItems',
                    'extractors',
                    'trails',
                    'feeds',
                    'teams'
                ]
            }
        });
    };

    this.getDomain = function(domainId) {
        return DwDomain.find({
            filter: {
                where: {id: domainId},
                fields:{'name':true,'description':true,'id':true},
                include: ['domainEntityTypes','domainItems']
            }
        });
    };

    this.getUserTeamDomains = function(teamList) {
        var userTeams = [];
        teamList.forEach(function (team) {
            userTeams.push(team.id);
        });
        var whereClause={
            filter:{
                order:"name DESC",
                include: [
                    'domainEntityTypes',
                    'domainItems',
                    'extractors',
                    'trails',
                    'feeds',
                    {relation:'teams',
                        scope:{
                            where:{
                                id:{inq:userTeams}
                            }
                        }
                    }
                ]
            }
        };

        return (DwDomain.find(whereClause));
    };

    this.getUserPagedTeamDomains = function(teamList,start,number) {
        var userTeams = [];
        teamList.forEach(function (team) {
            userTeams.push(team.id);
        });
        var whereClause={
            filter:{
                limit: number,
                skip: start,
                order:"name DESC",
                include: [
                    'domainEntityTypes',
                    'domainItems',
                    'extractors',
                    'trails',
                    'feeds',
                    {relation:'teams',
                        scope:{
                            where:{
                                id:{inq:userTeams}
                            }
                        }
                    }
                ]
            }
        };
        return (DwDomain.find(whereClause));
    };

    this.getPrettyDomain = function(domainId){
        var filter = {
                filter:{
                    fields: ['id','name','description'],
                    where:{
                        id: domainId
                    },
                    include: [
                        {relation:'domainEntityTypes',scope:{fields:['name','description']}},
                        {relation:'domainItems',
                            scope:{
                                fields:{
                                    'itemValue':true,
                                    'type':true,
                                    'source':true,
                                    'dwDomainId':false
                                }
                            }
                        }
                    ]
                }
        };
        return DwDomain.findOne(filter);
    };

    this.getDomainUrls = function(domainId){
        var filter = {
            filter:{
                fields: ['id'],
                where:{
                    dwDomainId: domainId
                },
                include: [
                    {relation:'trailUrls',
                        scope:{
                            //fields: {
                            //    'url',
                            //    'searchTerms'
                            //},
                            include:['urlExtractions']
                        }
                    }
                ]
            }
        };
        return DwTrail.find(filter);
    };

    this.getTopLevels = function(urlList, urlCount){
        //Clean em up
        var strippedUrls = [];
        urlList.forEach(function(url){
            var decodedUrl = decodeURI(url);
            var topLevel = new RegExp('^(?:https?:)?(?:\/\/)?([^\/\?]+)').exec(decodedUrl);
            strippedUrls.push(topLevel[1]);
        });
        //Now count them
        var urlCounts = { };
        for (var i = 0, j = strippedUrls.length; i < j; i++) {
            urlCounts[strippedUrls[i]] = (urlCounts[strippedUrls[i]] || 0) + 1;
        }
        //Now sort them
        var sorted= [];
        for(var key in urlCounts){
            sorted.push({url:key,count:urlCounts[key]});
        }
        sorted.sort(sortBy('count',true)); //Descending

        //Now crop and return them
        return sorted.slice(0,urlCount);
    };


    function sortBy(key, reverse) {
        // Move smaller items towards the front or back of the array depending on if
        // we want to sort the array in reverse order or not.
        var moveSmaller = reverse ? 1 : -1;

        // Move larger items towards the front or back of the array depending on if
        // we want to sort the array in reverse order or not.
        var moveLarger = reverse ? -1 : 1;
        /**
         * @param  {*} a
         * @param  {*} b
         * @return {Number}
         */
        return function(a, b) {
            if (a[key] < b[key]) {
                return moveSmaller;
            }
            if (a[key] > b[key]) {
                return moveLarger;
            }
            return 0;
        };

    }

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
            }

            if(domain.dwFeeds) {
                domain.dwFeeds.forEach(function (feed) {
                    DwDomain.feeds.link({id: newDomain.id, fk: feed}, null, function (value, header) {
                        //success
                    });
                });
            }

            if(domain.dwExtractors) {
                domain.dwExtractors.forEach(function (extractor) {
                    DwDomain.extractors.link({id: newDomain.id, fk: extractor}, null, function (value, header) {
                        //success
                    });
                });
            }
            //For other relationships you MUST manually add the items
            if(domain.domainEntityTypes) {
                domain.domainEntityTypes.forEach(function (det) {
                    DwDomainEntityType.upsert(det, function() {
                        //success
                    }, function(err) {
                    });
                });
            }

            if(domain.domainItems) {
                domain.domainItems.forEach(function (di) {
                DwDomainItem.upsert(di, function() {
                        //success
                    }, function(err) {

                    });
                });
            }

            cb();
        }, function(err) {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Error saving domain '), gettextCatalog.getString(
                    'This domain could not be saved: ') + err);
        });

    };

    this.deleteDomain = function(domain, cb) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function() {
                //For Many-To-Many relationships you MUST manually unlink the entities before deleting the domain
                if(domain.id.dwTeams) {
                    domain.id.dwTeams.forEach(function (team) {
                        DwDomain.teams.unlink({id: domain.id, fk: team}, null, function (value, header) {
                            //success
                        });
                    });
                }

                if(domain.id.dwFeeds) {
                    domain.id.dwFeeds.forEach(function (feed) {
                        DwDomain.feeds.unlink({id: domain.id, fk: feed}, null, function (value, header) {
                            //success
                        });
                    });
                }

                if(domain.id.dwExtractors) {
                    domain.id.dwExtractors.forEach(function (extractor) {
                        DwDomain.extractors.unlink({id: domain.id, fk: extractor}, null, function (value, header) {
                            //success
                        });
                    });
                }

                //Now delete the domain
                DwDomain.deleteById(domain.id, function() {
                    CoreService.toastSuccess(gettextCatalog.getString('Domain deleted'), gettextCatalog.getString('Your domain is deleted!'));

                    //For other relationships you MUST manually remove the child items
                    if(domain.id.domainItems) {
                        domain.id.domainItems.forEach(function (di) {
                            DwDomainItem.delete(di, function() {
                                //success
                            }, function(err) {
                            });
                        });
                    }

                    if(domain.id.domainEntityTypes) {
                        domain.id.domainEntityTypes.forEach(function (det) {
                            DwDomainEntityType.delete(det, function() {
                                //success
                            }, function(err) {
                            });
                        });
                    }

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

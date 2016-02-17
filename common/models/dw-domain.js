module.exports = function(DwDomain) {

    //Unlink the domain from any teams using it
    //DwDomain.observe('before delete', function (ctx, next) {
    //    var domain = ctx.Model.app.models.DwDomain;
    //
    //    var whereClause = {
    //        where: {
    //            id: ctx.where.id
    //        },
    //        include:
    //            [
    //                {relation:'teams',
    //                    scope:{
    //                        fields:['id']
    //                    }
    //                },
    //                {relation: 'extractors',
    //                    scope:{
    //                        fields:['id']
    //                    }
    //                }
    //            ]
    //    };
    //
    //    domain.findOne(whereClause , function (err, domain) {
    //        if(domain.dwTeams) {
    //            domain.dwTeams.forEach(function (team) {
    //                domain.teams.unlink({id: ctx.where.id, fk: team}, null, function (value, header) {
    //                    //success
    //                });
    //            });
    //        }
    //    });
    //    next();
    //});

    //Cascade delete to the domain's DomainItems
    DwDomain.observe('before delete', function (ctx, next) {
        // It would be nice if there was a more elegant way to load this related model
        var domItem = ctx.Model.app.models.DwDomainItem;

        domItem.find({
            where: {
                dwDomainId: ctx.where.id
            }
        }, function (err, domainItems) {
            domainItems.forEach(function (domainItem) {
                domItem.destroyById(domainItem.id, function () {
                    console.log("Deleted domainItem", domainItem.id);
                });
            });
        });
        next();
    });

    //Cascade delete to the domain's DomainEntityTypes
    DwDomain.observe('before delete', function (ctx, next) {
        // It would be nice if there was a more elegant way to load this related model
        var domType = ctx.Model.app.models.DwDomainEntityType;

        domType.find({
            where: {
                dwDomainId: ctx.where.id
            }
        }, function (err, domainTypes) {
            domainTypes.forEach(function (domainType) {
                domType.destroyById(domainType.id, function () {
                    console.log("Deleted domainType", domainType.id);
                });
            });
        });
        next();
    });
};

module.exports = function(DwDomain) {

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

module.exports = function (DWTrailUrl) {
    DWTrailUrl.observe('before save', function (ctx, next) {
        let trailUrl = ctx.instance;
        if (!trailUrl) {
            next();
            return;
        }
        let trailId = trailUrl.dwTrailId.toString();
        let scrapedContent = trailUrl.scrapedContent;
        let dwTrail = ctx.Model.app.models.DwTrail;
        dwTrail.findById(trailId, function (err, trail) {
            let domainId = trail.dwDomainId.toString();
            let dwDomain = ctx.Model.app.models.DwDomain;
            dwDomain.findById(domainId, {include: 'domainItems'}, function (err, domain) {
                domain.domainItems((err, domainItems) => {
                    let domainItemsJson = [];
                    domainItems.forEach((domainItem) => {
                        let regex = new RegExp(domainItem.itemValue, 'ig');
                        let matches = scrapedContent.match(regex);
                        if (matches) {
                            domainItemsJson.push({domainItem: domainItem.itemValue, count: matches.length});
                        }
                    });
                    trailUrl.updateAttribute('domainItemsJson',
                        JSON.stringify(domainItemsJson),
                        (err, instance) => {
                            next();
                        });
                });
                /*                for (let i = 0; i < domain.domainItems.length; ++i) {
                 let domainItem = domain.domainItems[i];
                 let tu = trailUrl;
                 //let itemValue = domainItem.itemValue;
                 }*/
            });
        });
    });
    //Cascade delete to the trailUrl's extractions
    DWTrailUrl.observe('before delete', function (ctx, next) {
        // It would be nice if there was a more elegant way to load this related model
        var urlExtractions = ctx.Model.app.models.DwUrlExtraction;
        urlExtractions.find({
            where: {
                dwTrailUrlId: ctx.where.id
            }
        }, function (err, extractions) {
            extractions.forEach(function (extraction) {
                urlExtractions.destroyById(extraction.id, function () {
                    console.log("Deleted extraction", extraction.id);
                });
            });
        });
        next();
    });

};
module.exports = function(DWTrailUrl) {

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
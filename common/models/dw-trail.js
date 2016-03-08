module.exports = function(DwTrail) {

    //Cascade delete to the trail's Urls
    DwTrail.observe('before delete', function (ctx, next) {
        // It would be nice if there was a more elegant way to load this related model
        var trailUrls = ctx.Model.app.models.DwTrailUrl;

        trailUrls.find({
            where: {
                dwTrailId: ctx.where.id
            }
        }, function (err, urls) {
            urls.forEach(function (url) {
                trailUrls.destroyById(url.id, function () {
                    console.log("Deleted url", url.id);
                });
            });
        });
        next();
    });

};
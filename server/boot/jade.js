'use strict';
module.exports = function (app) {
  var path = require('path');
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '../../client/app/modules'));

  /* Sandbox */
  app.get('/modules/sandbox/views/grid', function (req, res) {
    res.render('sandbox/views/grid', {title: 'Grid'});
  });

  /* Users */
  app.get('/modules/users/views/main', function (req, res) {
    res.render('users/views/main', {title: 'Main'});
  });
  app.get('/modules/users/views/list', function (req, res) {
    res.render('users/views/list', {title: 'List'});
  });
  app.get('/modules/users/views/form', function (req, res) {
    res.render('users/views/form', {title: 'Form'});
  });
  app.get('/modules/users/views/login', function (req, res) {
    res.render('users/views/login', {title: 'Login'});
  });
  app.get('/modules/users/views/register', function (req, res) {
    res.render('users/views/register', {title: 'Login'});
  });

  /* dwCrawlTypes */
  app.get('/modules/dwCrawlTypes/views/main', function (req, res) {
    res.render('dwCrawlTypes/views/main', {title: 'Datawake Crawl Types'});
  });
  app.get('/modules/dwCrawlTypes/views/list', function (req, res) {
    res.render('dwCrawlTypes/views/list', {title: 'Datawake Crawl Types'});
  });
  app.get('/modules/dwCrawlTypes/views/form', function (req, res) {
    res.render('dwCrawlTypes/views/form', {title: 'Datawake Crawl Types'});
  });
  app.get('/modules/dwCrawlTypes/views/view', function (req, res) {
    res.render('dwCrawlTypes/views/view', {title: 'Datawake Crawl Types'});
  });

  /* dwDomains */
  app.get('/modules/dwDomains/views/main', function (req, res) {
    res.render('dwDomains/views/main', {title: 'Datawake Domains'});
  });
  app.get('/modules/dwDomains/views/list', function (req, res) {
    res.render('dwDomains/views/list', {title: 'Datawake Domains'});
  });
  app.get('/modules/dwDomains/views/form', function (req, res) {
    res.render('dwDomains/views/form', {title: 'Datawake Domains'});
  });
  app.get('/modules/dwDomains/views/view', function (req, res) {
    res.render('dwDomains/views/view', {title: 'Datawake Domains'});
  });
  app.get('/modules/dwDomains/views/upload', function (req, res) {
    res.render('dwDomains/views/upload', {title: 'Datawake Domains'});
  });
  app.get('/modules/dwDomains/views/import', function (req, res) {
    res.render('dwDomains/views/import', {title: 'Datawake Domains'});
  });

  /* dwDomainEntityTypes */
  app.get('/modules/dwDomainEntityTypes/views/main', function (req, res) {
      res.render('dwDomainEntityTypes/views/main', {title: 'Datawake Domain Entity Types'});
  });
  app.get('/modules/dwDomainEntityTypes/views/list', function (req, res) {
      res.render('dwDomainEntityTypes/views/list', {title: 'Datawake Domain Entity Types'});
  });
  app.get('/modules/dwDomainEntityTypes/views/form', function (req, res) {
      res.render('dwDomainEntityTypes/views/form', {title: 'Datawake Domain Entity Types'});
  });
  app.get('/modules/dwDomainEntityTypes/views/view', function (req, res) {
      res.render('dwDomainEntityTypes/views/view', {title: 'Datawake  Domain Entity Types'});
  });

  /* dwDomainItems */
  app.get('/modules/dwDomainItems/views/main', function (req, res) {
      res.render('dwDomainItems/views/main', {title: 'Datawake Domain Items'});
  });
  app.get('/modules/dwDomainItems/views/list', function (req, res) {
      res.render('dwDomainItems/views/list', {title: 'Datawake Domain Items'});
  });
  app.get('/modules/dwDomainItems/views/form', function (req, res) {
      res.render('dwDomainItems/views/form', {title: 'Datawake Domain Items'});
  });
  app.get('/modules/dwDomainItems/views/view', function (req, res) {
      res.render('dwDomainItems/views/view', {title: 'Datawake Domain Items'});
  });

  /* dwExtractors */
  app.get('/modules/dwExtractors/views/main', function (req, res) {
    res.render('dwExtractors/views/main', {title: 'Datawake Domain Extractors'});
  });
  app.get('/modules/dwExtractors/views/list', function (req, res) {
    res.render('dwExtractors/views/list', {title: 'Datawake Domain Extractors'});
  });
  app.get('/modules/dwExtractors/views/form', function (req, res) {
    res.render('dwExtractors/views/form', {title: 'Datawake Domain Extractors'});
  });
  app.get('/modules/dwExtractors/views/view', function (req, res) {
    res.render('dwExtractors/views/view', {title: 'Datawake  Domain Extractors'});
  });

  /* dwFeeds */
  app.get('/modules/dwFeeds/views/main', function (req, res) {
    res.render('dwFeeds/views/main', {title: 'Datawake Domain Feeds'});
  });
  app.get('/modules/dwFeeds/views/list', function (req, res) {
    res.render('dwFeeds/views/list', {title: 'Datawake Domain Feeds'});
  });
  app.get('/modules/dwFeeds/views/form', function (req, res) {
    res.render('dwFeeds/views/form', {title: 'Datawake Domain Feeds'});
  });
  app.get('/modules/dwFeeds/views/view', function (req, res) {
    res.render('dwFeeds/views/view', {title: 'Datawake  DomainFeeds'});
  });

  /* dwTransmissions */
  app.get('/modules/dwTransmissions/views/main', function (req, res) {
    res.render('dwTransmissions/views/main', {title: 'Datawake Domain Transmissions'});
  });
  app.get('/modules/dwTransmissions/views/list', function (req, res) {
    res.render('dwTransmissions/views/list', {title: 'Datawake Domain Transmissions'});
  });
  app.get('/modules/dwTransmissions/views/form', function (req, res) {
    res.render('dwTransmissions/views/form', {title: 'Datawake Domain Transmissions'});
  });
  app.get('/modules/dwTransmissions/views/view', function (req, res) {
    res.render('dwTransmissions/views/view', {title: 'Datawake  Domain Transmissions'});
  });

  /* dwServiceTypes */
  app.get('/modules/dwServiceTypes/views/main', function (req, res) {
    res.render('dwServiceTypes/views/main', {title: 'Datawake Service Types'});
  });
  app.get('/modules/dwServiceTypes/views/list', function (req, res) {
    res.render('dwServiceTypes/views/list', {title: 'Datawake Service Types'});
  });
  app.get('/modules/dwServiceTypes/views/form', function (req, res) {
    res.render('dwServiceTypes/views/form', {title: 'Datawake Service Types'});
  });
  app.get('/modules/dwServiceTypes/views/view', function (req, res) {
    res.render('dwServiceTypes/views/view', {title: 'Datawake Service Types'});
  });

  /* dwSettings */
  app.get('/modules/dwSettings/views/main', function (req, res) {
    res.render('dwSettings/views/main', {title: 'Datawake Settings'});
  });
  app.get('/modules/dwSettings/views/list', function (req, res) {
    res.render('dwSettings/views/list', {title: 'Datawake Settings'});
  });
  app.get('/modules/dwSettings/views/form', function (req, res) {
    res.render('dwSettings/views/form', {title: 'Datawake Settings'});
  });
  app.get('/modules/dwSettings/views/view', function (req, res) {
    res.render('dwSettings/views/view', {title: 'Datawake Settings'});
  });

  /* settings */
  app.get('/modules/settings/views/main', function (req, res) {
    res.render('settings/views/main', {title: 'Settings'});
  });
  app.get('/modules/settings/views/list', function (req, res) {
    res.render('settings/views/list', {title: 'Settings'});
  });
  app.get('/modules/settings/views/form', function (req, res) {
    res.render('settings/views/form', {title: 'Settings'});
  });
  app.get('/modules/settings/views/view', function (req, res) {
    res.render('settings/views/view', {title: 'Settings'});
  });

  /* dwTeams */
  app.get('/modules/dwTeams/views/main', function (req, res) {
    res.render('dwTeams/views/main', {title: 'Datawake Domain Teams'});
  });
  app.get('/modules/dwTeams/views/list', function (req, res) {
    res.render('dwTeams/views/list', {title: 'Datawake Domain Teams'});
  });
  app.get('/modules/dwTeams/views/form', function (req, res) {
    res.render('dwTeams/views/form', {title: 'Datawake Domain Teams'});
  });
  app.get('/modules/dwTeams/views/view', function (req, res) {
    res.render('dwTeams/views/view', {title: 'Datawake  Domain Teams'});
  });

  /* dwTrails */
  app.get('/modules/dwTrails/views/main', function (req, res) {
    res.render('dwTrails/views/main', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/list', function (req, res) {
    res.render('dwTrails/views/list', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/form', function (req, res) {
    res.render('dwTrails/views/form', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/view', function (req, res) {
    res.render('dwTrails/views/view', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/newman', function (req, res) {
    res.render('dwTrails/views/newman', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/upload', function (req, res) {
    res.render('dwTrails/views/upload', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/import', function (req, res) {
    res.render('dwTrails/views/import', {title: 'Datawake Trails'});
  });

  /* dwTrailUrls */
  app.get('/modules/dwTrailUrls/views/main', function (req, res) {
      res.render('dwTrailUrls/views/main', {title: 'Datawake Trail Urls'});
  });
  app.get('/modules/dwTrailUrls/views/list', function (req, res) {
      res.render('dwTrailUrls/views/list', {title: 'Datawake Trail Urls'});
  });
  app.get('/modules/dwTrailUrls/views/form', function (req, res) {
      res.render('dwTrailUrls/views/form', {title: 'Datawake Trail Urls'});
  });
  app.get('/modules/dwTrailUrls/views/view', function (req, res) {
      res.render('dwTrailUrls/views/view', {title: 'Datawake Trail Urls'});
  });

  /* dwUrlExtractions */
  app.get('/modules/dwUrlExtractions/views/main', function (req, res) {
      res.render('dwUrlExtractions/views/main', {title: 'Datawake Trail Extractions'});
  });
  app.get('/modules/dwUrlExtractions/views/list', function (req, res) {
      res.render('dwUrlExtractions/views/list', {title: 'Datawake Trail Extractions'});
  });
  app.get('/modules/dwUrlExtractions/views/form', function (req, res) {
      res.render('dwUrlExtractions/views/form', {title: 'Datawake Trail Extractions'});
  });
  app.get('/modules/dwUrlExtractions/views/view', function (req, res) {
      res.render('dwUrlExtractions/views/view', {title: 'Datawake Trail Extractions'});
  });

};

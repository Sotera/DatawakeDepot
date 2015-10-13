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
  app.get('/modules/dwUrlExtractions/views/form', function (req, res) {
      res.render('dwUrlExtractions/views/form', {title: 'Datawake Trail Extractions'});
  });

};

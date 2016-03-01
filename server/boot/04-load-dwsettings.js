'use strict';
// to enable these logs set `DEBUG=boot:04-load-dwsettings` or `DEBUG=boot:*`
var log = require('debug')('boot:04-load-dwsettings');
function dwSettingFindOrCreate(app, name, value) {
  app.models.DwSetting.findOrCreate(
    {where: {setting: name}}, // find
    {
      setting: name,
      value: value
    }, // create
    function (err, data, created) {
      if (err) {
        console.error('err', err);
      }
      (created) ? log('created Setting', data.setting)
        : log('found Setting', data.setting);
    });
}
var nameValuePairs = [
  {name: 'DEEPDIVE_REPO', value: 'atf'},
  {name: 'DEEPDIVE_URL', value: 'https://api.clearcutcorp.com/docs'},
  {name: 'DEEPDIVE_USER', value: 'justin'},
  {name: 'DIG_URL', value: 'http://none.com'},
  {name: 'DW_EXTERNAL_LINK_NAMES', value: 'Tellfinder, Google'},
  {name: 'DW_EXTERNAL_LINK_VALUES', value: 'https://tellfinder.istresearch.com:8443/tellfinder/entitylist.jsp?tip=$VALUE&attribute=false,https://google.com#q=$VALUE'},
  {name: 'ES_CRED', value: null},
  {name: 'ES_HOST', value: 'els.istresearch.com'},
  {name: 'ES_INDEX', value: 'memex_ht'},
  {name: 'ES_MRPN', value: '10'},
  {name: 'ES_PORT', value: '9200'},
  {name: 'EXTRACTION_BLACKLIST', value: 'www.google.com,search.yahoo.com,www.bing.com,www.yahoo.com'}
];
module.exports = function (app) {
/*  if (app.datasources.db.name !== 'memory' && !process.env.initdb) {
    return;
  }*/
  log('Creating dwSettings');
  //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
  app.models.DwSetting.getDataSource().setMaxListeners(0);
  nameValuePairs.forEach(function (item) {
    dwSettingFindOrCreate(app, item.name, item.value);
  });
};

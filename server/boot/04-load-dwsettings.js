'use strict';

// to enable these logs set `DEBUG=boot:04-load-content` or `DEBUG=boot:*`
var log = require('debug')('boot:04-load-dwsettings');

module.exports = function(app) {

    if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
    }

    log('Creating dwSettings');

    var DwSetting = app.models.DwSetting;

    DwSetting.findOrCreate(
      {where:{setting: 'CDR_ES_CRED'}}, // find
      {
        setting: 'CDR_ES_CRED',
        value: null
      }, // create
      function(err, data, created) {
        if (err) {
          console.error('err', err);
        }
        (created) ? log('created Setting', data.setting)
            : log('found Setting', data.setting);
      });
    DwSetting.findOrCreate(
        {where:{setting: 'CDR_ES_HOST'}}, // find
        {
            setting: 'CDR_ES_HOST',
            value: 'els.istresearch.com'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'CDR_ES_INDEX'}}, // find
        {
            setting: 'CDR_ES_INDEX',
            value: 'memex-domains'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'CDR_ES_PORT'}}, // find
        {
            setting: 'CDR_ES_PORT',
            value: '9200'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DEEPDIVE_REPO'}}, // find
        {
            setting: 'DEEPDIVE_REPO',
            value: 'atf'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DEEPDIVE_URL'}}, // find
        {
            setting: 'DEEPDIVE_URL',
            value: 'https://api.clearcutcorp.com/docs'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DEEPDIVE_USER'}}, // find
        {
            setting: 'DEEPDIVE_USER',
            value: 'justin'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DIG_URL'}}, // find
        {
            setting: 'DIG_URL',
            value: 'http://none.com'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DW_CONN_TYPE'}}, // find
        {
            setting: 'DW_CONN_TYPE',
            value: 'mysql'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DW_CRAWL'}}, // find
        {
            setting: 'DW_CRAWL',
            value: 'False'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DW_EXTERNAL_LINK_NAMES'}}, // find
        {
            setting: 'DW_EXTERNAL_LINK_NAMES',
            value: 'Tellfinder, Google'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DW_EXTERNAL_LINK_VALUES'}}, // find
        {
            setting: 'DW_EXTERNAL_LINK_VALUES',
            value: 'https://tellfinder.istresearch.com:8443/tellfinder/entitylist.jsp?tip=$VALUE&attribute=false,https://google.com#q=$VALUE'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });

    DwSetting.findOrCreate(
        {where:{setting: 'DW_MOCK_AUTH'}}, // find
        {
            setting: 'DW_MOCK_AUTH',
            value: '1'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'DW_MOCK_FORENSIC_AUTH'}}, // find
        {
            setting: 'DW_MOCK_FORENSIC_AUTH',
            value: '1'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'ES_CRED'}}, // find
        {
            setting: 'ES_CRED',
            value: null
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'ES_HOST'}}, // find
        {
            setting: 'ES_HOST',
            value: 'els.istresearch.com'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'ES_INDEX'}}, // find
        {
            setting: 'ES_INDEX',
            value: 'memex_ht'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'ES_MRPN'}}, // find
        {
            setting: 'ES_MRPN',
            value: '10'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'ES_PORT'}}, // find
        {
            setting: 'ES_PORT',
            value: '9200'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'EXTRACTION_BLACKLIST'}}, // find
        {
            setting: 'EXTRACTION_BLACKLIST',
            value: 'www.google.com,search.yahoo.com,www.bing.com,www.yahoo.com'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
    DwSetting.findOrCreate(
        {where:{setting: 'MITIE_HOME'}}, // find
        {
            setting: 'MITIE_HOME',
            value: '/usr/lib/mitie/MITIE'
        }, // create
        function(err, data, created) {
            if (err) {
                console.error('err', err);
            }
            (created) ? log('created Setting', data.setting)
                : log('found Setting', data.setting);
        });
};

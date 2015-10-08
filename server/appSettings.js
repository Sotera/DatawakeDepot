'use strict';
exports.getSetting = function (name) {
  return require('./server').models.DwSetting.findOne({where: {setting: name}});
};

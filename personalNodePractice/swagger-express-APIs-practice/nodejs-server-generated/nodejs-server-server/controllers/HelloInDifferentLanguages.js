'use strict';

var utils = require('../utils/writer.js');
var HelloInDifferentLanguages = require('../service/HelloInDifferentLanguagesService');

module.exports.greetingsGET = function greetingsGET (req, res, next) {
  HelloInDifferentLanguages.greetingsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

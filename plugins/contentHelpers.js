/*globals module */
var _ = require('underscore'),
    fs = require('fs');

module.exports = function(env, callback) {
    'use strict';

    env.helpers.getSortedContentFolder = function(folder, contents) {
        return _.chain(contents[folder]._.directories)
                .map(function(item) { return item.index })
                .sortBy(function(item) { return -item.date })
                .value();
    };

    callback();
};

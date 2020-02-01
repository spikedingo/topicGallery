const _ = require('lodash');
const nodeAdminController = require('../controller/manage/node')
const nodeApiController = require('../controller/api/node')

module.exports = (options, app) => {

    return async function nodeRouter(ctx, next) {

        let pluginConfig = app.config.doraNode;
        await app.initPluginRouter(ctx, pluginConfig, nodeAdminController, nodeApiController);
        await next();

    }

}
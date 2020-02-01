const _ = require('lodash');
const topicAdminController = require('../controller/manage/topic')
const topicApiController = require('../controller/api/topic')

module.exports = (options, app) => {

    return async function topicRouter(ctx, next) {

        let pluginConfig = app.config.doraTopic;
        await app.initPluginRouter(ctx, pluginConfig, topicAdminController, topicApiController);
        await next();

    }

}
const _ = require('lodash');
const topicCategoryAdminController = require('../controller/manage/topicCategory')
const topicCategoryApiController = require('../controller/api/topicCategory')

module.exports = (options, app) => {

    return async function topicCategoryRouter(ctx, next) {

        let pluginConfig = app.config.doraTopicCategory;
        await app.initPluginRouter(ctx, pluginConfig, topicCategoryAdminController, topicCategoryApiController);
        await next();

    }

}
const _ = require('lodash');
const phoneCategoryAdminController = require('../controller/manage/phoneCategory')
const phoneCategoryApiController = require('../controller/api/phoneCategory')

module.exports = (options, app) => {

    return async function phoneCategoryRouter(ctx, next) {

        let pluginConfig = app.config.doraPhoneCategory;
        await app.initPluginRouter(ctx, pluginConfig, phoneCategoryAdminController, phoneCategoryApiController);
        await next();

    }

}
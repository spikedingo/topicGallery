const xss = require("xss");
const _ = require('lodash');

const topicCategoryRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 2,
            max: 20,
            message: ctx.__("validate_error_field", [ctx.__("label_cate_name")])
        },
        comments: {
            type: "string",
            required: true,
            min: 4,
            max: 100,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}



let TopicCategoryController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let categoryParams = _.assign({}, payload, {
                isPaging: '0'
            })
            let topicCategoryList = await ctx.service.topicCategory.find(categoryParams, {
                searchKeys: ['name'],
                query: queryObj
            });

            ctx.helper.renderSuccess(ctx, {
                data: topicCategoryList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx, app) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                keywords: fields.keywords,
                sortId: fields.sortId,
                parentId: fields.parentId,
                enable: fields.enable,
                // defaultUrl: fields.defaultUrl,
                topicTemp: fields.topicTemp,
                comments: fields.comments,
                sImg: fields.sImg,
                type: fields.type
            }

            // 兼容中文逗号
            if (fields.keywords) {
                var reg = new RegExp('，', "g")
                formObj.keywords = (fields.keywords).replace(reg, ',');
            }

            // 针对子类自动继承父类的模板
            if (fields.parentId != '0') {
                let parentCate = await ctx.service.topicCategory.item(ctx, {
                    query: {
                        '_id': fields.parentId
                    }
                })
                if (!_.isEmpty(parentCate)) {
                    formObj.topicTemp = parentCate.topicTemp;
                }
            }

            ctx.validate(topicCategoryRule(ctx), formObj);

            let cateObj = await ctx.service.topicCategory.create(formObj);
            // 更新sortPath defaultUrl
            let newQuery = {};
            if (fields.parentId == '0') {
                newQuery.sortPath = '0,' + cateObj._id
            } else {
                let parentObj = await ctx.service.topicCategory.item(ctx, {
                    query: {
                        '_id': fields.parentId
                    },
                    files: 'sortPath'
                })
                newQuery.sortPath = parentObj.sortPath + "," + cateObj._id;
            }
            await ctx.service.topicCategory.update(ctx, cateObj._id, newQuery);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },



    async getOne(ctx, app) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.topicCategory.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async alllist(ctx, app) {
        return await ctx.service.topicCategory.find({
            isPaging: '0'
        })
    },


    async update(ctx, app) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                keywords: fields.keywords,
                sortId: fields.sortId,
                parentId: fields.parentId,
                enable: fields.enable,
                // defaultUrl: fields.defaultUrl,
                topicTemp: fields.topicTemp,
                sortPath: fields.sortPath,
                comments: fields.comments,
                sImg: fields.sImg,
                type: fields.type
            }

            // 针对子类自动继承父类的模板
            if (fields.parentId == '0' && fields.topicTemp) {
                await ctx.service.topicCategory.updateMany(ctx, [], {
                    topicTemp: fields.topicTemp
                }, {
                    'parentId': fields._id
                })
            }

            ctx.validate(topicCategoryRule(ctx), formObj);



            await ctx.service.topicCategory.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.topicCategory.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = TopicCategoryController;
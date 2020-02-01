const xss = require("xss");
const _ = require('lodash');

const phoneCategoryRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 2,
            max: 20,
            message: ctx.__("validate_error_field", [ctx.__("label_cate_name")])
        },
        defaultUrl: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("label_cate_seourl")])
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



let PhoneCategoryController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let categoryParams = _.assign({}, payload, {
                isPaging: '0'
            })
            let phoneCategoryList = await ctx.service.phoneCategory.find(categoryParams, {
                searchKeys: ['name'],
                query: queryObj
            });

            ctx.helper.renderSuccess(ctx, {
                data: phoneCategoryList
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
                defaultUrl: fields.defaultUrl,
                phoneTemp: fields.phoneTemp,
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
                let parentCate = await ctx.service.phoneCategory.item(ctx, {
                    query: {
                        '_id': fields.parentId
                    }
                })
                if (!_.isEmpty(parentCate)) {
                    formObj.phoneTemp = parentCate.phoneTemp;
                }
            }

            ctx.validate(phoneCategoryRule(ctx), formObj);

            let cateObj = await ctx.service.phoneCategory.create(formObj);
            // 更新sortPath defaultUrl
            let newQuery = {};
            if (fields.parentId == '0') {
                newQuery.sortPath = '0,' + cateObj._id
            } else {
                let parentObj = await ctx.service.phoneCategory.item(ctx, {
                    query: {
                        '_id': fields.parentId
                    },
                    files: 'sortPath defaultUrl'
                })
                newQuery.sortPath = parentObj.sortPath + "," + cateObj._id;
                newQuery.defaultUrl = parentObj.defaultUrl + '/' + fields.defaultUrl
            }
            await ctx.service.phoneCategory.update(ctx, cateObj._id, newQuery);

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

            let targetItem = await ctx.service.phoneCategory.item(ctx, {
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
        return await ctx.service.phoneCategory.find({
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
                defaultUrl: fields.defaultUrl,
                phoneTemp: fields.phoneTemp,
                sortPath: fields.sortPath,
                comments: fields.comments,
                sImg: fields.sImg,
                type: fields.type
            }

            // 针对子类自动继承父类的模板
            if (fields.parentId == '0' && fields.phoneTemp) {
                await ctx.service.phoneCategory.updateMany(ctx, [], {
                    phoneTemp: fields.phoneTemp
                }, {
                    'parentId': fields._id
                })
            }

            ctx.validate(phoneCategoryRule(ctx), formObj);



            await ctx.service.phoneCategory.update(ctx, fields._id, formObj);

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
            await ctx.service.phoneCategory.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = PhoneCategoryController;
const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const {
    siteFunc
} = require('../../utils');
const topicRule = (ctx) => {
    return {
        title: {
            type: "string",
            required: true,
            min: 2,
            max: 50,
            message: ctx.__("validate_error_field", [ctx.__("label_topic_title")])
        },
        nodes: {
            type: "array",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("label_topic_nodes")])
        },
        discription: {
            type: "string",
            required: false,
            min: 3,
            max: 300,
            message: ctx.__("validate_error_field", [ctx.__("label_topic_dis")])
        }
    }
}



let TopicController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let state = ctx.query.state;
            let userId = ctx.query.userId;

            let queryObj = {};

            if (state) {
                queryObj.state = state
            }
            if (userId) {
                queryObj.uAuthor = userId;
            }

            let topicList = await ctx.service.topic.find(payload, {
                query: queryObj,
                searchKeys: ['title', 'content', 'discription'],
                populate: [
                    // {
                    //     path: 'author',
                    //     select: 'userName name logo _id group'
                    // },
                    // {
                    //     path: 'uAuthor',
                    //     select: 'userName name logo _id group',
                    //     $match: {
                    //         group: '1'
                    //     }
                    // },
                    {
                        path: 'categories',
                        select: 'name _id defaultUrl'
                    }, {
                        path: 'tags',
                        select: 'name _id'
                    }
                ]

            });

            ctx.helper.renderSuccess(ctx, {
                data: topicList
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
            let targetKeyWords = [];
            if (fields.keywords) {
                if ((fields.keywords).indexOf(',') >= 0) {
                    targetKeyWords = (fields.keywords).split(',');
                } else if ((fields.keywords).indexOf('，') >= 0) {
                    targetKeyWords = (fields.keywords).split('，');
                } else {
                    targetKeyWords = fields.keywords;
                }
            }

            const formObj = {
                title: fields.title,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                discription: xss(fields.discription),
                state: fields.state,
                nodes: fields.nodes,
                keywords: targetKeyWords,
                rank: fields.rank, 
            }


            ctx.validate(topicRule(ctx), formObj);;

            // 设置显示模式
            // let checkInfo = siteFunc.checkTopicType(formObj.simpleComments);
            // formObj.appShowType = checkInfo.type;
            // formObj.imageArr = checkInfo.imgArr;
            // formObj.videoArr = checkInfo.videoArr;
            // if (checkInfo.type == '3') {
            //     formObj.videoImg = checkInfo.defaultUrl;
            // }
            // formObj.simpleComments = siteFunc.renderSimpleTopic(formObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);


            // 如果是管理员代发,则指定用户
            // if (ctx.session.adminUserInfo && fields.targetUser) {
            //     formObj.uAuthor = fields.targetUser;
            // }

            await ctx.service.topic.create(formObj);

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

            let targetTopic = await ctx.service.topic.item(ctx, {
                query: {
                    _id: _id
                },
                populate: [
                    // {
                    //     path: 'author',
                    //     select: 'userName name logo _id group'
                    // },
                    // {
                    //     path: 'uAuthor',
                    //     select: 'userName name logo _id group'
                    // },
                    {
                        path: 'categories',
                        select: 'name _id defaultUrl'
                    }, {
                        path: 'tags',
                        select: 'name _id'
                    }
                ]
            });
            
            console.log(targetTopic.nodes, 'check nodes first')

            let nodeList = await ctx.service.node.find(ctx.query, {
                query: {_id: {$in: targetTopic.nodes}}
            });

            console.log(nodeList, 'check node list ')
            
            let finalTopic = targetTopic.toObject()

            if (nodeList.docs.length) {
                finalTopic.nodeResults = nodeList.docs
            }

            ctx.helper.renderSuccess(ctx, {
                data: finalTopic
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    // 文章推荐
    async updateTopicToTop(ctx, app) {

        try {

            let fields = ctx.request.body || {};
            if (!fields._id) {
                throw new Error(ctx.__('validate_error_params'));
            }
            await ctx.service.topic.update(ctx, fields._id, {
                isTop: fields.isTop
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    // 文章置顶
    async roofPlacement(ctx, app) {

        try {

            let fields = ctx.request.body || {};
            await ctx.service.topic.update(ctx, fields._id, {
                roofPlacement: fields.roofPlacement
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    // 给文章分配用户
    async redictTopicToUsers(ctx, app) {

        try {

            let fields = ctx.request.body || {};
            let errMsg = '',
                targetIds = fields.ids;
            let targetUser = fields.targetUser;

            if (!shortid.isValid(targetUser)) {
                errMsg = ctx.__("validate_error_params");
            }

            if (!checkCurrentId(targetIds)) {
                errMsg = ctx.__("validate_error_params");
            } else {
                targetIds = targetIds.split(',');
            }

            if (errMsg) {
                throw new Error(errMsg);
            }

            await ctx.service.topic.updateMany(ctx, targetIds, {
                uAuthor: targetUser
            })

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    async update(ctx, app) {

        try {

            let fields = ctx.request.body || {};

            let targetKeyWords = [];
            if (fields.keywords) {
                if ((fields.keywords).indexOf(',') >= 0) {
                    targetKeyWords = (fields.keywords).split(',');
                } else if ((fields.keywords).indexOf('，') >= 0) {
                    targetKeyWords = (fields.keywords).split('，');
                } else {
                    targetKeyWords = fields.keywords;
                }
            }
            const formObj = {
                title: fields.title,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                discription: xss(fields.discription),
                state: fields.state,
                nodes: fields.nodes,
                keywords: targetKeyWords,
                rank: fields.rank, 
            }

            ctx.validate(topicRule(ctx), formObj);

            // 设置显示模式
            // let checkInfo = siteFunc.checkTopicType(formObj.simpleComments);
            // formObj.appShowType = checkInfo.type;
            // formObj.imageArr = checkInfo.imgArr;
            // formObj.videoArr = checkInfo.videoArr;

            // formObj.simpleComments = siteFunc.renderSimpleTopic(formObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            // if (checkInfo.type == '3') {
            //     formObj.videoImg = checkInfo.defaultUrl;
            // }

            // 如果是管理员代发,则指定用户
            // if (ctx.session.adminUserInfo && fields.targetUser) {
            //     formObj.uAuthor = fields.targetUser;
            // }

            await ctx.service.topic.update(ctx, fields._id, formObj);

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

            if (!checkCurrentId(targetIds)) {
                throw new Error(ctx.__("validate_error_params"));
            } else {
                await ctx.service.message.removes(ctx, targetIds, 'topicId');
            }

            await ctx.service.topic.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }


}

module.exports = TopicController;
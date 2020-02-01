const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const {
    siteFunc,
    validatorUtil
} = require('../../utils');
const validator = require('validator');


let TopicController = {

    checkTopicFormData(ctx, fields) {

        let errMsg = '';

        if (fields._id && !checkCurrentId(fields._id)) {
            errMsg = ctx.__("validate_error_params");
        }

        if (!validatorUtil.isRegularCharacter(fields.title)) {
            errMsg = ctx.__("validate_error_field", [ctx.__("label_topic_title")]);
        }
        if (!validator.isLength(fields.title, 2, 50)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_topic_title"), 2, 50]);
        }
        // if (fields.stitle && !validator.isLength(fields.stitle, 2, 50)) {
        //     errMsg = ctx.__("validate_rangelength", [ctx.__("label_topic_stitle"), 2, 50]);
        // }
        if (!fields.categories) {
            errMsg = ctx.__("validate_userTopic_category");
        }
        // if (!fields.tags) {
        //     errMsg = ctx.__("validate_selectNull", [ctx.__("label_topic_tags")]);
        // }

        if (!validator.isLength(fields.discription, 5, 300)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_topic_dis"), 5, 300]);
        }

        if (fields.content && !validator.isLength(fields.content, 5, 100000)) {
            errMsg = ctx.__("validate_rangelength", [ctx.__("label_topic_content"), 5, 100000]);
        }

        if (errMsg) {
            throw new Error(errMsg);
        }

    },

    renderOneTopic(ctx, userId = "", topicItem = {}, nodeList = []) {
        return new Promise(async (resolve, reject) => {
            try {
                // let newTopicList = JSON.parse(JSON.stringify(topicList));
                let userInfo;

                if (userId) {
                    userInfo = await ctx.service.user.item(ctx, {
                        query: {
                            _id: userId
                        },
                        files: getAuthUserFields('session')
                    })
                }

                topicItem.id = topicItem._id;
                topicItem.hasPraised = false;
                topicItem.hasComment = false;
                topicItem.hasFavorite = false;
                topicItem.hasDespise = false;
                topicItem.uAuthor && (topicItem.uAuthor.had_followed = false);

                if (!_.isEmpty(userInfo)) {
                    // 本人是否已点赞
                    if (userInfo.praiseTopics && userInfo.praiseTopics.indexOf(topicItem._id) >= 0) {
                        topicItem.hasPraised = true;
                    }
                    // 本人是否已收藏
                    if (userInfo.favorites && userInfo.favorites.indexOf(topicItem._id) >= 0) {
                        topicItem.hasFavorite = true;
                    }
                    // 本人是否已踩
                    if (userInfo.despises && userInfo.despises.indexOf(topicItem._id) >= 0) {
                        topicItem.hasDespise = true;
                    }
                }

                // 留言总数
                let commentNum = await ctx.service.message.count({
                    topicId: topicItem._id
                });
                topicItem.commentNum = commentNum;

                // 点赞总数
                let likeNum = await ctx.service.user.count({
                    praiseTopics: topicItem._id
                })
                topicItem.likeNum = likeNum;

                // 收藏总数
                let favoriteNum = await ctx.service.user.count({
                    favorites: topicItem._id
                })
                topicItem.favoriteNum = favoriteNum;

                // 踩帖总数
                let despiseNum = await ctx.service.user.count({
                    despises: topicItem._id
                });
                topicItem.despiseNum = despiseNum;

                // if (topicItem.simpleComments) {
                //     topicItem.simpleComments = JSON.parse(topicItem.simpleComments);
                // }

                // 处理用户敏感信息
                topicItem.uAuthor && siteFunc.clearUserSensitiveInformation(topicItem.uAuthor);

                console.log(nodeList, 'check nodelist')
                let finalTopic = topicItem.toObject()

                if (nodeList.length) {
                    finalTopic.nodeResults = nodeList
                }

                resolve(finalTopic);
            } catch (error) {
                resolve([]);
            }
        })
    },

    renderTopicList(ctx, userId = "", topicList = []) {

        return new Promise(async (resolve, reject) => {
            try {

                let newTopicList = JSON.parse(JSON.stringify(topicList));
                let userInfo;

                if (userId) {
                    userInfo = await ctx.service.user.item(ctx, {
                        query: {
                            _id: userId
                        },
                        files: getAuthUserFields('session')
                    })
                }

                for (let topicItem of newTopicList) {
                    topicItem.id = topicItem._id;
                    topicItem.hasPraised = false;
                    topicItem.hasComment = false;
                    topicItem.hasFavorite = false;
                    topicItem.hasDespise = false;
                    topicItem.uAuthor && (topicItem.uAuthor.had_followed = false);

                    if (!_.isEmpty(userInfo)) {
                        // 本人是否已点赞
                        if (userInfo.praiseTopics && userInfo.praiseTopics.indexOf(topicItem._id) >= 0) {
                            topicItem.hasPraised = true;
                        }
                        // 本人是否已收藏
                        if (userInfo.favorites && userInfo.favorites.indexOf(topicItem._id) >= 0) {
                            topicItem.hasFavorite = true;
                        }
                        // 本人是否已踩
                        if (userInfo.despises && userInfo.despises.indexOf(topicItem._id) >= 0) {
                            topicItem.hasDespise = true;
                        }
                        // 本人是否已留言
                        // let topicMessage = await ctx.service.message.item(ctx, {
                        //     query: {
                        //         topicId: topicItem._id,
                        //         author: userInfo._id
                        //     }
                        // })
                        // if (!_.isEmpty(topicMessage)) {
                        //     topicItem.hasComment = true;
                        // }
                        // 本人是否已关注作者
                        // if (userInfo.watchers.length > 0 && topicItem.uAuthor && userInfo.watchers.indexOf(topicItem.uAuthor._id) >= 0) {
                        //     topicItem.uAuthor.had_followed = true;
                        // }
                    }

                    // 留言总数
                    let commentNum = await ctx.service.message.count({
                        topicId: topicItem._id
                    });
                    topicItem.commentNum = commentNum;

                    // 点赞总数
                    let likeNum = await ctx.service.user.count({
                        praiseTopics: topicItem._id
                    })
                    topicItem.likeNum = likeNum;

                    // 收藏总数
                    let favoriteNum = await ctx.service.user.count({
                        favorites: topicItem._id
                    })
                    topicItem.favoriteNum = favoriteNum;

                    // 踩帖总数
                    let despiseNum = await ctx.service.user.count({
                        despises: topicItem._id
                    });
                    topicItem.despiseNum = despiseNum;

                    // if (topicItem.simpleComments) {
                    //     topicItem.simpleComments = JSON.parse(topicItem.simpleComments);
                    // }

                    // 处理用户敏感信息
                    topicItem.uAuthor && siteFunc.clearUserSensitiveInformation(topicItem.uAuthor);
                }

                resolve(newTopicList);
            } catch (error) {
                resolve([]);
            }
        })

    },

    async getEnableCateList(ctx, isSingerPage) {

        try {
            const enableCates = await ctx.service.topicCategory.find({
                isPaging: '0'
            }, {
                query: {
                    enable: true,
                    type: isSingerPage ? '2' : '1'
                },
                files: 'id'
            })

            let queryCate = enableCates.map((item, index) => {
                const reg = new RegExp(item.id, 'i')
                // return {
                //     categories: {
                //         $regex: reg
                //     }
                // }
                return item.id;
            })
            return queryCate;

        } catch (error) {
            return []
        }
    },

    /**
     * @api {get} /api/topic/getList 查询帖子列表
     * @apiDescription 根据参数获取对应的帖子列表,默认按时间查询，可作为发现栏目列表
     * @apiName /topic/getList
     * @apiGroup Topic
     * @apiParam {string} current 当前页码
     * @apiParam {string} pageSize 每页记录数
     * @apiParam {string} searchkey 搜索关键字
     * @apiParam {string} userId 指定作者ID
     * @apiParam {string} model (1:推荐帖子)
     * @apiParam {string} sortby 按字段排序(0:默认按时间，1:热门)
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "topiclist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "translate": "",
     *           "bearish": [],
     *           "profitable": [],
     *           "from": "1",
     *           "likeUserIds": [],
     *           "likeNum": 0, // 点赞总数
     *           "commentNum": 0, // 留言总数
     *           "favoriteNum": 0, // 收藏总数
     *           "despiseNum": 0, // 踩帖总数
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "duration": "0:01",, // 针对视频的视频时长
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *           "hasPraised": false // 当前用户是否已赞�
     *           "hasReworded": false // 当前用户是否已打赏�
     *           "hasComment": false // 当前用户是否已评论
     *           "hasFavorite": false // 当前用户是否已收藏
     *           "hasDespise": false // 当前用户是否已踩
     *           "total_reward_num": 0  // 打赏总额
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/getList
     * @apiVersion 1.0.0
     */

    /**
     * @api {get} /api/topic/getUserTopics 查询指定用户的节点列表
     * @apiDescription 查询指定用户的节点列表，带分页
     * @apiName /topic/getUserTopics
     * @apiGroup Topic
     * @apiParam {string} current 当前页码
     * @apiParam {string} pageSize 每页记录数
     * @apiParam {string} userId 指定用户的ID
     * @apiParam {string} listState 针对本人可以根据状态显示节点列表(all:全部)
     * @apiParam {string} token 登录时返回的参数鉴权
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *  "status": 200,
     *  "message": "topiclist",
     *  "server_time": 1542891752268,
     *  "data": [
     *    {
     *      "_id": "jRInYUowi",
     *      "title": "六小龄童做了什么事引来这么多的口诛笔伐？",
     *      "stitle": "六小龄童做了什么事引来这么多的口诛笔伐？",
     *      "author": null,
     *      "discription": "蓉城圆滚滚： 今天上午刚好听完六小龄童的现场讲座，有视频有真相，还是先附上一段现场版视频吧～ 这是我们省图书馆的一个讲座系列活动，叫“巴蜀讲坛”。通常会在周末邀请很多知名专家学者给大家做一些学术或者科普讲…",
     *      "comments": "9:00的时候开始入场，我虽然到的挺早，但还是只在报告厅的倒数第二排的角落里找到了个位置～大家陆续进场后，工作人员就开始在台上频繁地说：讲座结束后，章老师会有签名活动，为了避免拥挤，大家现在就可以在报告厅门口去购书～～（其实省图挺少接这种签售活动，就算接，一般也是安排在楼上的小活动室里，而不会在这个大报告厅，果然明星还是比较有面儿的哇～）讲座准时开始的，第一个环节是捐赠仪式，大约是捐赠了6套还是8套章老师的书给图书馆来着↓↓↓（红色衣服的是章老师，旁边那位是图书馆某个部门的主任～其实，我大约记得之前几位第一次来馆里办讲座的老师都是副馆长来致欢迎词的～）",
     *      "uAuthor": {
     *        "_id": "zwwdJvLmP",
     *        "userName": "doramart",
     *        "logo": "/upload/images/defaultlogo.png",
     *        "date": "2018-11-22 21:02:32",
     *        "id": "zwwdJvLmP"
     *      },
     *      "__v": 0,
     *      "keywords": null,
     *      "likeNum": 0, // 点赞总数
     *      "commentNum": 0, // 留言总数
     *      "favoriteNum": 0, // 收藏总数
     *      "despiseNum": 0, // 踩帖总数
     *      "clickNum": 1,  
     *      "isTop": 1,
     *      "state": true,
     *      "updateDate": "2018-11-18",
     *      "date": "2018-11-18 20:49:29",
     *      "appShowType": "0",
     *      "sImg": "/upload/images/img20181118203911.jpeg",
     *      "tags": [
     *        
     *      ],
     *      "categories": [
     *        
     *      ],
     *      "type": "1",
     *      "id": "jRInYUowi"
     *      "hasPraised": false // 当前用户是否已赞�
     *      "total_reward_num": 0  // 打赏总额
     *      "hasReworded": false // 当前用户是否已打赏�
     *      "hasComment": false // 当前用户是否已评论
     *      "hasFavorite": false // 当前用户是否已收藏
     *      "hasDespise": false // 当前用户是否已踩
     *    },
     *    ...
     *  ]
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/getUserTopics
     * @apiVersion 1.0.0
     */
    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userId = ctx.query.userId;
            let userInfo = ctx.session.user || {};
            let model = ctx.query.model;
            let sortby = ctx.query.sortby;
            let listState = ctx.query.listState || '2';
            let typeId = ctx.query.typeId;
            let tagName = ctx.query.tagName;
            let filesType = 'normal'; // 查询模式 full/normal/simple
            let isSingerPage = false; // 是否是单页面

            let queryObj = {
                    state: '2'
                },
                sortObj = {
                    date: -1
                };


            if (ctx.query.pageType == 'index') {
                sortObj = {
                    roofPlacement: -1,
                    date: -1
                };
            }

            if (model == '1') {
                queryObj.isTop = 1;
            }

            // if (tagName) {
            //     let targetTag = await ctx.service.contentTag.item(ctx, {
            //         query: {
            //             name: tagName
            //         }
            //     });
            //     if (!_.isEmpty(targetTag)) {
            //         queryObj.tags = targetTag._id;
            //         delete queryObj.categories;
            //     }
            // }


            if (sortby == '1') { // 按点击量排序
                delete sortObj.date;
                delete sortObj.roofPlacement;
                sortObj = {
                    clickNum: 1
                }
                let rangeTime = getDateStr(-720);
                queryObj.date = {
                    "$gte": new Date(rangeTime.startTime),
                    "$lte": new Date(rangeTime.endTime)
                }
            }

            // 如果是本人，返回所有节点
            if (!_.isEmpty(userInfo) && userInfo._id == userId) {
                queryObj.uAuthor = userInfo._id;
                if (listState == 'all') {
                    delete queryObj.state;
                } else {
                    if (listState == '0' || listState == '1' || listState == '2') {
                        queryObj.state = listState;
                    }
                }
            } else {
                userId && (queryObj.uAuthor = userId);
            }

            if (typeId) {
                queryObj.categories = typeId
                _.assign(queryObj, {
                    categories: typeId
                });
                // 针对顶级分类下挂载的文章
                let singerCate = await ctx.service.topicCategory.count({
                    _id: typeId,
                    enable: true,
                    type: '2'
                });
                if (singerCate > 0) {
                    filesType = 'stage1';
                    isSingerPage = true;
                    let ableCateList = await this.getEnableCateList(ctx, isSingerPage);
                    _.assign(queryObj, {
                        categories: {
                            $in: ableCateList
                        }
                    });
                }
            } else {
                // 只查询可见分类的文章
                let ableCateList = await this.getEnableCateList(ctx, false);
                _.assign(queryObj, {
                    categories: {
                        $in: ableCateList
                    }
                });
            }

            // console.log('--sortObj--', sortObj);
            let topicList = await ctx.service.topic.find(payload, {
                sort: sortObj,
                query: queryObj,
                searchKeys: ['userName', 'title', 'content', 'discription'],
                files: getTopicListFields(filesType)
            });

            topicList.docs = await this.renderTopicList(ctx, userInfo._id, topicList.docs);

            ctx.helper.renderSuccess(ctx, {
                data: topicList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async getTopIndexTopics(ctx, app) {

        try {
            let current = ctx.query.current || 1;
            let pageSize = ctx.query.pageSize || 10;
            let model = ctx.query.model || 'normal'; // 查询模式 full/normal/simple
            let userInfo = ctx.session.user || {};
            let payload = ctx.query;

            // 条件配置
            let queryObj = {
                state: '2',
                isTop: 1,
                uAuthor: {
                    $ne: null
                }
            };

            let sortObj = {
                roofPlacement: -1
            };

            let recTopics = [];

            if (!_.isEmpty(userInfo) && !_.isEmpty(userInfo.watchTags) && userInfo.watchTags.length > 0) {
                // 查询置顶文章
                let tagQuery = {
                    state: '2',
                    $or: [{
                        roofPlacement: 1
                    }, {
                        tags: {
                            $in: userInfo.watchTags
                        }
                    }]
                };

                let recTopicsNum = await ctx.service.topic.count(tagQuery);
                recTopics = await ctx.service.topic.find(payload, {
                    query: tagQuery,
                    files: getTopicListFields(),
                    sort: sortObj
                })

                if (recTopicsNum > current * pageSize) {
                    recTopics.docs = await this.renderTopicList(ctx, userInfo._id, recTopics.docs);
                    ctx.helper.renderSuccess(ctx, {
                        data: recTopics
                    });
                } else {

                    let leftNormalSize = current * pageSize - recTopicsNum;
                    if (leftNormalSize <= pageSize) {

                        if (leftNormalSize > 0) {
                            let leftTopics = await ctx.service.topic.find({
                                current: 1,
                                pageSize: Number(leftNormalSize)
                            }, {
                                query: {
                                    state: '2',
                                    tags: {
                                        $nin: userInfo.watchTags
                                    }
                                },
                                files: getTopicListFields(),
                                sort: sortObj
                            })
                            recTopics = _.concat(recTopics, leftTopics);
                        }

                    } else {

                        let leftTopics = await ctx.service.topic.find({
                            skip: leftNormalSize,
                            pageSize: Number(pageSize)
                        }, {
                            query: {
                                state: '2',
                                tags: {
                                    $nin: userInfo.watchTags
                                }
                            },
                            files: getTopicListFields(),
                            sort: sortObj
                        })
                        recTopics = _.concat(recTopics, leftTopics);
                    }

                    recTopics.docs = await renderTopicList(ctx, userInfo._id, recTopics.docs);

                    ctx.helper.renderSuccess(ctx, {
                        data: recTopics
                    });

                }

            } else {
                let topics = await ctx.service.topic.find(payload, {
                    query: queryObj,
                    files: getTopicListFields(),
                    sort: sortObj
                })
                topics.docs = await this.renderTopicList(ctx, userInfo._id, topics.docs);

                ctx.helper.renderSuccess(ctx, {
                    data: topics
                });
            }

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    /**
     * @api {get} /api/topic/getRadomTopics 获取随机节点列表
     * @apiDescription 获取随机节点列表 不分页
     * @apiName /topic/getRadomTopics
     * @apiGroup Topic
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "topiclist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "translate": "",
     *           "bearish": [],
     *           "profitable": [],
     *           "from": "1",
     *           "likeUserIds": [],
     *           "likeNum": 0, // 点赞总数
     *           "commentNum": 0, // 留言总数
     *           "favoriteNum": 0, // 收藏总数
     *           "despiseNum": 0, // 踩帖总数
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "duration": "0:01",, // 针对视频的视频时长
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *           "hasPraised": false // 当前用户是否已赞�
     *           "hasReworded": false // 当前用户是否已打赏�
     *           "hasComment": false // 当前用户是否已评论
     *           "hasFavorite": false // 当前用户是否已收藏
     *           "hasDespise": false // 当前用户是否已踩
     *           "total_reward_num": 0  // 打赏总额
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/getRadomTopics
     * @apiVersion 1.0.0
     */
    async getRadomTopics(ctx, app) {

        let payload = ctx.query;

        let queryObj = {
            type: '1',
            state: '2'
        };
        let randomArticles = [];
        try {
            // 只查询可见分类的文章
            let ableCateList = await this.getEnableCateList(ctx, false);

            _.assign(queryObj, {
                categories: {
                    $in: ableCateList
                }
            });

            const totalTopics = await ctx.service.topic.count(queryObj);

            randomArticles = await ctx.service.topic.find(_.assign(payload, {
                skip: Math.floor(totalTopics * Math.random())
            }), {
                query: queryObj,
                files: 'stitle sImg title'
            })

            ctx.helper.renderSuccess(ctx, {
                data: randomArticles
            });
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },



    /**
     * @api {get} /api/topic/getTopic 查询帖子详情
     * @apiDescription 查询帖子详情(只普通帖子或专题)
     * @apiName /api/topic/getTopic
     * @apiGroup Topic
     * @apiParam {string} id 帖子Id
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     * {
     *  "status": 200,
     *  "message": "topic",
     *  "server_time": 1545154926558,
     *  "data": {
     *     "_id": "ri5WaXugX",
     *     "title": "谷歌AI首席科学家：想当研究科学家，一事无成你受得了吗？",
     *     "stitle": "谷歌AI首席科学家：想当研究科学家，一事无成你受得了吗？",
     *     "sortPath": "",
     *     "keywords": "",
     *     "uAuthor": {
     *        "_id": "uUKsBv5y_",
     *        "userName": "creator10",
     *        "logo": "https://cg2010studio.files.wordpress.com/2015/12/cartoonavatar2.jpg",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "uUKsBv5y_"
     *     },
     *     "discription": "AI研究科学家不是那么好当的！近日谷歌AI首席科学家Vincent Vanhoucke发表在Medium上的文章引来众人关注。在本文中，他列举了成为研究科学家所要面对的9大挑战，看完这篇内容或许可以在立志投身于科学事业前，给你先“泼一盆冷水”。",
     *     "__v": 0,
     *     "author": {
     *        "userName": "doramart",
     *        "name": "超管",
     *        "logo": "/upload/smallimgs/img1448202744000.jpg"
     *     },
     *     "simpleComments": [
     *       {
     *        "type": "topics",
     *        "topic": "做一名研究人员可能会让你的人生非常充实并得到他人的认可。但我知道很多学生在做研究时受到前景的压力，一时陷入工程的舒适区。他们通常把这个阶段视为个人失败，觉得自己“不够优秀”。而根据我个人的经验，这从来就不是个人价值或者天赋的问题：在研究中成长需要某种不同的气质，这种气质往往与工程师成长的原因有些矛盾。以下是我见过的研究人员在职业生涯的某个阶段不得不面对的一些主要压力：\n  \n做研究要解决的是有多个答案（或没有答案）的不适定问题\n                               *        "
     *       },
     *       {
     *        "type": "video",
     *        "topic": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392.mp4"
     *       },
     *       {
     *        "type": "topics",
     *        "topic": " \n\n大学教育很大程度上教会了你如何用特定的方案解决适定问题，但用这种方式去对待研究却注定失败。你在研究中做的很多事并不会让你接近答案，而是让你更好地理解问题。 \n"
     *       },
     *       {
     *        "type": "image",
     *        "topic": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1075054319700676608.png"
     *       },
     *       {
     *        "type": "topics",
     *        "topic": " \n用学到的东西，而不是取得的研究进展来衡量自己的进步，是一个人在研究环境中必须经历的重要范式转变之一。\n\n"
     *       }
     *     ],
     *     "likeNum": 0,
     *     "commentNum": 10,
     *     "clickNum": 77,
     *     "isTop": 1,
     *     "state": true,
     *     "updateDate": "2018-12-08 21:37:38",
     *     "date": "2018-12-08 21:37:38",
     *     "duration": "0:01",
     *     "videoArr": [
     *        "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392.mp4"
     *     ],
     *     "imageArr": [
     *        "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1075054319700676608.png"
     *     ],
     *     "appShowType": "3",
     *     "videoImg": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/1071402816293179392_thumbnail.jpg", // 视频缩略图（当appShowType=3）
     *     "sImg": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/img1544276235259.jpg",
     *     "tags": [
     *       {
     *        "_id": "aGE-YfyLRjx",
     *        "name": "化学",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "aGE-YfyLRjx"
     *       },
     *       {
     *        "_id": "_euYIiOqvLA",
     *        "name": "体育",
     *        "date": "2018-12-19 01:42:06",
     *        "id": "_euYIiOqvLA"
     *       }
     *     ],
     *     "categories": [
     *       
     *     ],
     *     "type": "1",
     *     "id": "ri5WaXugX",
     *     "hasPraised": false,
     *     "hasReworded": false,
     *     "hasComment": true,
     *     "hasFavorite": false,
     *     "hasDespise": false,
     *     "total_reward_num": 0,
     *     "favoriteNum": 0,
     *     "despiseNum": 0
     *   }
     * }
     * @apiSampleRequest http://localhost:8080/api/topic/getTopic
     * @apiVersion 1.0.0
     */
    async getOneTopic(ctx, app) {

        try {
            let targetId = ctx.query.id;
            let userId = ctx.query.userId;
            let isPractise = ctx.query.practise;

            console.log(targetId, 'target id')

            if (!shortid.isValid(targetId)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let queryObj = {
                _id: targetId,
                state: '2'
            };

            let userInfo = ctx.session.user || {};

            // 查询自己的文章不需要约束状态
            if (!_.isEmpty(userInfo) && userInfo._id == userId) {
                delete queryObj.state;
                queryObj.uAuthor = userId;
            }

            await ctx.service.topic.inc(ctx, targetId, {
                'clickNum': 1
            })
            // 如果是练习模式则将练习次数加1
            if (isPractise) {
                await ctx.service.topic.inc(ctx, targetId, {
                    'execTimes': 1
                })
            }

            let targetTopic = await ctx.service.topic.item(ctx, {
                query: queryObj,
                files: getTopicListFields()
            });

            let nodeList = await ctx.service.node.find(ctx.query, {
                query: {_id: {$in: targetTopic.nodes}}
            });
            
            renderTopic = await this.renderOneTopic(ctx, userInfo._id, targetTopic, nodeList.docs);

            ctx.helper.renderSuccess(ctx, {
                data: renderTopic
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    /**
     * @api {get} /api/topic/getNearbyTopic 获取当前节点的上一篇和下一篇
     * @apiDescription 获取随机节点列表 不分页
     * @apiName /topic/getNearbyTopic
     * @apiParam {string} id 帖子Id
     * @apiGroup Topic
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *  "status": 200,
     *  "data": {
     *      "preTopic": {
     *          "categories": [
     *               {
     *                   "enable": true,
     *                   "defaultUrl": "document",
     *                   "_id": "Ek7skiaw",
     *                   "name": "DoraCMS",
     *                   "topicTemp": null,
     *                   "id": "Ek7skiaw"
                        },
     *               {
     *                   "enable": true,
     *                   "defaultUrl": "document/course",
     *                   "_id": "EJFzljaw",
     *                   "name": "原创教程",
     *                   "topicTemp": null,
     *                   "id": "EJFzljaw"
     *              }
     *          ],
     *          "tags": [
     *               {
     *                   "_id": "N1OYhcvpg",
     *                   "name": "版本更新",
     *                   "id": "N1OYhcvpg"
     *              },
     *               {
     *                   "_id": "4JZjY1Ru",
     *                   "name": "DoraCMS",
     *                   "id": "4JZjY1Ru"
     *              }
     *          ],
     *          "sImg": "/static/upload/images/1571243055075.jpeg",
     *          "_id": "FDIy_dWl",
     *          "title": "DoraCMS 插件化探索（一）",
     *          "author": {
     *              "logo": "/static/upload/smallimgs/img1448202744000.jpg",
     *              "_id": "4JiWCMhzg",
     *              "userName": "doramart"
     *          },
     *          "discription": "DoraCMS 从今年年初的时候开始有插件化构想，为什么会有这种想法？其实就目前发布的DoraCMS 2.1.3 来讲，对比之前的版本有很多优化，最重要的一点是建立了比较清晰的代码结构",
     *          "uAuthor": {
     *              "logo": "/static/upload/smallimgs/img1447739082000.jpg",
     *              "group": "0",
     *              "_id": "41oT6sQXl",
     *              "userName": "doramart",
     *              "name": "生哥",
     *              "id": "41oT6sQXl"
     *          },
     *          "updateDate": "2019-10-17 00:28:05",
     *          "id": "FDIy_dWl"
     *      },
     *      "nextTopic": []
     *   },
     *  "message": ""
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/getNearbyTopic
     * @apiVersion 1.0.0
     */
    async getNearbyTopic(ctx, app) {

        try {
            let topicId = ctx.query.id;

            if (!topicId || !shortid.isValid(topicId)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetTopic = await ctx.service.topic.item(ctx, {
                query: {
                    _id: topicId
                },
                files: 'title _id id data updateDate'
            });

            if (_.isEmpty(targetTopic)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let preTopic = await ctx.service.topic.find({
                isPaging: '0',
                pageSize: 1
            }, {
                query: {
                    _id: {
                        '$ne': targetTopic._id
                    },
                    state: '2',
                    updateDate: {
                        "$lte": new Date(targetTopic.updateDate)
                    }
                },
                files: 'title _id id data updateDate sImg discription'
            });

            let nextTopic = await ctx.service.topic.find({
                isPaging: '0',
                // pageSize: 1
            }, {
                query: {
                    _id: {
                        '$ne': targetTopic._id
                    },
                    state: '2',
                    updateDate: {
                        "$gte": new Date(targetTopic.updateDate)
                    }
                },
                sort: {
                    updateDate: 1
                },
                files: 'title _id id data updateDate sImg discription'
            });

            ctx.helper.renderSuccess(ctx, {
                data: {
                    preTopic: !_.isEmpty(preTopic) ? preTopic[0] : [],
                    nextTopic: !_.isEmpty(nextTopic) ? nextTopic[0] : []
                }
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },


    /**
     * @api {get} /api/topic/getMyFavoriteTopics 获取我收藏的帖子列表
     * @apiDescription 获取我收藏的帖子列表 带分页
     * @apiName /topic/getMyFavoriteTopics
     * @apiGroup Topic
     * @apiParam {string} current 当前页码
     * @apiParam {string} pageSize 每页记录数
     * @apiParam {string} token 登录时返回的参数鉴权
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *   "status": 200,
     *   "message": "topiclist",
     *   "server_time": 1542380520270,
     *   "data": [
     *       {
     *           "_id": "Y1XFYKL52",
     *           "title": "如何优化vue的内存占用？",
     *           "stitle": "如何优化vue的内存占用？",
     *           "sortPath": "",
     *           "keywords": "",
     *           "author": {
     *               "_id": "4JiWCMhzg",
     *               "userName": "doramart",
     *               "name": "生哥",
     *               "logo": "/upload/smallimgs/img1448202744000.jpg"
     *           },
     *           "discription": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后",
     *           "comments": "在使用了一段时间的vue.js开发移动端h5页面（电商类页面，会有一些数据量较大但一次渲染就可以的商品列表）后，感觉相比于传统的jquery（zepto）和前端模板引擎的组合能有效的提升开发效率和代码维护性，但是也存在一些问题，比如说内存占用问题，用vue.js开发的页面内存占用相比于传统方式会更多，而且传统的开发方式页面渲染完后，还能对不需要的js对象进行垃圾回收，但vue.js里面的一些指令对象、watcher对象、data数据等似乎目前都没有找到比较好的垃圾回收的方式。想问下对于那些只用渲染一次的页面部分（比如数据量较大的列表页）有没有比较合适的内存优化方案（比如释放指令对象、watcher对象、data对象）？举个例子：比如其中的lazy指令，以及对于items这个基本上只用渲染一次的data等有没有可以优化内存占用的方法",
     *           "likeNum": 0,
     *           "commentNum": 0,
     *           "clickNum": 1,
     *           "isTop": 0,
     *           "state": true,
     *           "updateDate": "2018-11-16",
     *           "date": "2018-11-16 23:00:16",
     *           "appShowType": "0", // app端展示模式 0，1，2，3
     *           "sImg": "/upload/images/img20181116225948.jpeg",
     *           "tags": [
     *               {
     *                "_id": "Y3DTgmHK3",
     *                "name": "区块链",
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Y3DTgmHK3"
     *                }
     *            ],
     *           "categories": [
     *                {
     *                "_id": "Nycd05pP",
     *                "name": "人工智能",
     *                "defaultUrl": "artificial-intelligence",
     *                "enable": true,
     *                "date": "2018-11-16 23:02:00",
     *                "id": "Nycd05pP"
     *                }
     *            ],
     *           "type": "1",
     *           "id": "Y1XFYKL52"
     *        }
     *    ]
     *}
     * @apiSampleRequest http://localhost:8080/api/user/getMyFavoriteTopics
     * @apiVersion 1.0.0
     */
    async getMyFavoriteTopics(ctx, app) {

        try {


            let payload = ctx.query;
            let userInfo = ctx.session.user;

            let queryObj = {
                state: '2'
            };

            let targetUser = await ctx.service.user.item(ctx, {
                query: {
                    _id: userInfo._id
                }
            })
            queryObj._id = {
                $in: targetUser.favorites
            }

            let favoriteTopicsData = await ctx.service.topic.find(payload, {
                query: queryObj,
                searchKeys: ['name'],
                files: getTopicListFields()
            })

            favoriteTopicsData.docs = await this.renderTopicList(ctx, userInfo._id, favoriteTopicsData.docs);

            ctx.helper.renderSuccess(ctx, {
                data: favoriteTopicsData
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },



    /**
     * @api {post} /api/topic/addOne 创建节点
     * @apiDescription 创建节点
     * @apiName /topic/addOne
     * @apiParam {string}  token 登录时返回的参数鉴权
     * @apiParam {string}  title   节点标题，必填
     * @apiParam {string}  discription  节点简介，必填
     * @apiParam {string}  sImg  节点首图(url)，必填
     * @apiParam {string}  type    节点类型，必填(1:普通)
     * @apiParam {string}  draft   是否草稿(1:是，0:不是)
     * @apiParam {string}  tags   节点标签ID(目前只传1个)，必填
     * @apiParam {string}  keywords   关键字,非必填
     * @apiParam {string}  comments   节点详情(html 格式，必填)
     * @apiParam {string}  simpleComments   节点详情简约版(html 格式，客户端端传值和comments字段一样，必填)
     * @apiGroup Topic
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "addTopic",
     *    "server_time": 1548037382973,
     *    "data": {
     *    }
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/addOne
     * @apiVersion 1.0.0
     */
    async addTopic(ctx, app) {


        try {

            let fields = ctx.request.body;

            this.checkTopicFormData(ctx, fields);

            let targetKeyWords = [];
            if (fields.keywords) {
                if ((fields.keywords).indexOf(',') >= 0) {
                    targetKeyWords = (fields.keywords).split(',');
                } else if ((fields.keywords).indexOf('，') >= 0) {
                    targetKeyWords = (fields.keywords).split('，');
                }
            }

            const topicFormObj = {
                title: fields.title,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                // tags: fields.tags,
                discription: xss(fields.discription),
                state: fields.state,
                content: fields.content,
                puzzleContent: fields.puzzleContent,
                keywords: targetKeyWords,
                rank: fields.rank, 

                // stitle: fields.stitle,
                // sImg: fields.sImg,
                // author: !_.isEmpty(ctx.session.adminUserInfo) ? ctx.session.adminUserInfo._id : '',
                // dismissReason: fields.dismissReason,
                // isTop: fields.isTop,
                // simpleComments: xss(fields.simpleComments),
                // likeUserIds: [],
            }

            // 设置显示模式
            // let checkInfo = siteFunc.checkTopicType(topicFormObj.simpleComments);
            // topicFormObj.appShowType = checkInfo.type;
            // topicFormObj.imageArr = checkInfo.imgArr;
            // topicFormObj.videoArr = checkInfo.videoArr;
            // if (checkInfo.type == '3') {
            //     topicFormObj.videoImg = checkInfo.defaultUrl;
            // }

            // topicFormObj.simpleComments = siteFunc.renderSimpleTopic(topicFormObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            // TODO 临时控制普通用户添加1天内不超过30篇
            // let rangeTime = getDateStr(-1);
            // let hadAddTopicsNum = await ctx.service.topic.count({
            //     uAuthor: ctx.session.user._id,
            //     date: {
            //         "$gte": new Date(rangeTime.startTime),
            //         "$lte": new Date(rangeTime.endTime)
            //     }
            // });

            // if (hadAddTopicsNum > 30) {
            //     throw new Error(ctx.__("validate_forbid_more_req"));
            // }

            // topicFormObj.comments = xss(fields.comments);
            // topicFormObj.tags = Array(topicFormObj.tags);
            // topicFormObj.stitle = topicFormObj.title;
            // topicFormObj.uAuthor = ctx.session.user._id;
            // if (fields.draft == '1') {
            //     topicFormObj.state = '0'
            // } else {
            //     topicFormObj.state = '1'
            // }
            topicFormObj.author = '';

            let newTopic = await ctx.service.topic.create(topicFormObj);

            ctx.helper.renderSuccess(ctx, {
                data: {
                    id: newTopic._id
                }
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    /**
     * @api {post} /api/topic/updateOne 更新节点
     * @apiDescription 更新节点
     * @apiName /topic/updateOne
     * @apiParam {string}  token 登录时返回的参数鉴权
     * @apiParam {string}  id 节点ID
     * @apiParam {string}  title   节点标题，必填
     * @apiParam {string}  discription  节点简介，必填
     * @apiParam {string}  sImg  节点首图(url)，必填
     * @apiParam {string}  type    节点类型，必填(1:普通)
     * @apiParam {string}  draft   是否草稿(1:是，0:不是)
     * @apiParam {string}  tags   节点标签ID(目前只传1个)，必填
     * @apiParam {string}  keywords   关键字,非必填
     * @apiParam {string}  comments   节点详情(html 格式，必填)
     * @apiParam {string}  simpleComments   节点详情简约版(html 格式，客户端端传值和comments字段一样，必填)
     * @apiGroup Topic
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "addTopic",
     *    "server_time": 1548037382973,
     *    "data": {
     *    }
     *}
     * @apiSampleRequest http://localhost:8080/api/topic/updateOne
     * @apiVersion 1.0.0
     */
    async updateTopic(ctx, app) {


        try {

            let fields = ctx.request.body;

            this.checkTopicFormData(ctx, fields);

            let targetTopic = await ctx.service.topic.item(ctx, {
                query: {
                    uAuthor: ctx.session.user._id
                }
            })

            if (_.isEmpty(targetTopic)) {
                throw new Error(ctx.__('validate_error_params'));
            }

            let targetKeyWords = [];
            if (fields.keywords) {
                if ((fields.keywords).indexOf(',') >= 0) {
                    targetKeyWords = (fields.keywords).split(',');
                } else if ((fields.keywords).indexOf('，') >= 0) {
                    targetKeyWords = (fields.keywords).split('，');
                }
            }

            const topicObj = {
                title: fields.title,
                type: fields.type,
                categories: fields.categories,
                sortPath: fields.sortPath,
                // tags: fields.tags,
                discription: xss(fields.discription),
                state: fields.state,
                content: fields.content,
                puzzleContent: fields.puzzleContent,
                keywords: targetKeyWords,
                rank: fields.rank, 
            }

            // 设置显示模式
            // let checkInfo = siteFunc.checkTopicType(topicObj.simpleComments);
            // topicObj.appShowType = checkInfo.type;
            // topicObj.imageArr = checkInfo.imgArr;
            // topicObj.videoArr = checkInfo.videoArr;

            // topicObj.simpleComments = siteFunc.renderSimpleTopic(topicObj.simpleComments, checkInfo.imgArr, checkInfo.videoArr);

            // if (checkInfo.type == '3') {
            //     topicObj.videoImg = checkInfo.defaultUrl;
            // }

            // topicObj.comments = xss(fields.comments);
            // topicObj.stitle = topicObj.title;
            // topicObj.uAuthor = ctx.session.user._id;

            // if (fields.draft == '1') {
            //     topicObj.state = '0'
            // } else {
            //     topicObj.state = '1'
            // }
            topicObj.author = '';
            topicObj.updateDate = new Date();

            await ctx.service.topic.update(ctx, fields.id, topicObj);

            ctx.helper.renderSuccess(ctx, {
                data: {}
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    // 随机获取图片
    async getRandomTopicImg(ctx, app) {

        try {

            // let payload = ctx.query;
            // let pageSize = ctx.query.pageSize || 1;
            // let queryObj = {
            //     type: '1',
            //     state: '2'
            // };

            // // 只查询可见分类的文章
            // let ableCateList = await this.getEnableCateList(ctx, false);
            // _.assign(queryObj, {
            //     categories: {
            //         $in: ableCateList
            //     }
            // });

            // const totalTopics = await ctx.service.topic.count(queryObj);
            // let randomArticles = await ctx.service.topic.find(_.assign(payload, {
            //     isPaging: '0',
            //     pageSize,
            //     skip: Math.floor(totalTopics * Math.random())
            // }), {
            //     query: queryObj,
            //     files: 'sImg'
            // })

            // let sImgArr = [];

            // for (const articleItem of randomArticles) {
            //     if (articleItem.sImg) {
            //         sImgArr.push(articleItem.sImg);
            //     }
            // }

            // ctx.helper.renderSuccess(ctx, {
            //     data: sImgArr
            // });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = TopicController;
/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
module.exports = app => {
    const mongoose = app.mongoose
    var Schema = mongoose.Schema;
    var moment = require('moment')
    var shortid = require('shortid');

    var NodeSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        title: String,
        // stitle: String,
        type: {
            type: String,
            default: "1"
        }, // 发布类型 1位普通，2为专题
        categories: [{
            type: String,
            ref: 'TopicCategory'
        }], //文章类别
        sortPath: String, //存储所有父节点结构
        // tags: [{
        //     type: String,
        //     ref: 'ContentTag'
        // }], // 标签
        discription: String,
        date: {
            type: Date,
            default: Date.now
        },
        updateDate: {
            type: Date,
            default: Date.now
        }, // 更新时间
        state: {
            type: String,
            default: '2'
        }, // 2启用 3下架
        clickNum: {
            type: Number,
            default: 1
        },
        commentNum: {
            type: Number,
            default: 0
        }, // 评论数
        likeNum: {
            type: Number,
            default: 0
        }, // 喜欢数
        content: {
            type: String,
            default: ''
        }, // 节点正文
        puzzleContent: {
            type: String,
            default: ''
        }, // 替换了关键字为空格的节点正文
        keywords: [{
            type: String,
            default: ''
        }], // 关键字数组，创建时会根据匹配正文内关键字的顺序排序
        rank: {
            type: Number,
            default: 1 // 节点星级，一般继承于题目星级，3级最高
        },
        execed: {
            type: Boolean,
            default: false // 是否已练习
        },
        execTimes: {
            type: Number,
            default: 0 // 节点被作为题目联系的次数
        },
        correctRate: {
            type: Array,
            default: [] // 题目正确率（存入最近10次的结果，供前端计算）
        }
        // sImg: {
        //     type: String,
        //     default: "/upload/images/defaultImg.jpg"
        // }, // 文章小图
        // videoImg: {
        //     type: String,
        //     default: ""
        // }, // 视频缩略图
        // comments: String,
        // simpleComments: String, //带格式的纯文本
        // markDownComments: String, // markdow格式
        // dismissReason: String, // 驳回原因(针对审核不通过)
        // isTop: {
        //     type: Number,
        //     default: 0
        // }, // 是否推荐，默认不推荐 0为不推荐，1为推荐
        // roofPlacement: {
        //     type: String,
        //     default: '0'
        // }, // 是否置顶，默认不置顶 0为不置顶，1为置顶
        // author: {
        //     type: String,
        //     ref: 'AdminUser'
        // }, // 文档作者
        // uAuthor: {
        //     type: String,
        //     ref: 'User'
        // }, // 文档作者(普通用户)
        // imageArr: [{
        //     type: String
        // }], // 媒体集合（图片）
        // videoArr: [{
        //     type: String
        // }], // 媒体集合（影片）
        // duration: {
        //     type: String,
        //     default: '0:01'
        // }, // 针对有视频的帖子时长
    });


    NodeSchema.index({
        state: 1,
        uAuthor: 1
    }); // 添加索引

    NodeSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    NodeSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    NodeSchema.path('date').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    NodeSchema.path('updateDate').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("Node", NodeSchema, 'nodes');

}
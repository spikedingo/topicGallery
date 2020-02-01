'use strict'

/**
 * egg-dora-topic default config
 * @member Config#eggDoraTopic
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraTopic = {
    alias: 'topic', // 插件目录，必须为英文
    pkgName: 'egg-dora-topic', // 插件包名
    enName: 'doraTopic', // 插件名
    name: '节点管理', // 插件名称
    description: '提供题目节点管理', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_doc_fill', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/topic/js/app.js',
    adminApi: [{
        url: 'topic/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取节点列表',
    }, {
        url: 'topic/getTopic',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条节点信息',
    }, {
        url: 'topic/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个节点',
    }, {
        url: 'topic/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新节点信息',
    }, {
        url: 'topic/deleteTopic',
        method: 'get',
        controllerName: 'removes',
        details: '删除节点',
    }, {
        url: 'topic/topTopic',
        method: 'post',
        controllerName: 'updateTopicToTop',
        details: '节点推荐',
    }, {
        url: 'topic/roofTopic',
        method: 'post',
        controllerName: 'roofPlacement',
        details: '节点置顶',
    }, {
        url: 'topic/redictTopicToUsers',
        method: 'post',
        controllerName: 'redictTopicToUsers',
        details: '分配用户',
    }],
    fontApi: [{
        url: 'topic/getMyFavoriteTopics',
        method: 'get',
        controllerName: 'getMyFavoriteTopics',
        details: '获取收藏的节点列表',
        authToken: true
    }, {
        url: 'topic/getUserTopics',
        method: 'get',
        controllerName: 'list',
        details: '获取用户的节点列表',
    }, {
        url: 'topic/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取节点列表',
    }, {
        url: 'topic/getRadomTopics',
        method: 'get',
        controllerName: 'getRadomTopics',
        details: '获取随机节点列表',
    }, {
        url: 'topic/getRandomTopicImg',
        method: 'get',
        controllerName: 'getRandomTopicImg',
        details: '获取随机节点首图',
    }, {
        url: 'topic/getRecommendedList',
        method: 'get',
        controllerName: 'getTopIndexTopics',
        details: '获取推荐节点列表',
    }, {
        url: 'topic/getTopic',
        method: 'get',
        controllerName: 'getOneTopic',
        details: '获取单个节点信息',
    }, {
        url: 'topic/addOne',
        method: 'post',
        controllerName: 'addTopic',
        details: '新增节点',
        authToken: true
    }, {
        url: 'topic/updateOne',
        method: 'post',
        controllerName: 'updateTopic',
        details: '更新节点',
        authToken: true
    }, {
        url: 'topic/getNearbyTopic',
        method: 'get',
        controllerName: 'getNearbyTopic',
        details: '上一篇/下一篇',
    }],

    initData: 'topics.json', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraTopic = {\n
        enable: true,\n        package: 'egg-dora-topic',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    topicRouter:{\n
        match: [ctx => ctx.path.startsWith('/manage/topic'), ctx => ctx.path.startsWith('/api/topic')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}
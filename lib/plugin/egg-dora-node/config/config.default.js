'use strict'

/**
 * egg-dora-node default config
 * @member Config#eggDoraNode
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraNode = {
    alias: 'node', // 插件目录，必须为英文
    pkgName: 'egg-dora-node', // 插件包名
    enName: 'doraNode', // 插件名
    name: '节点管理', // 插件名称
    description: '提供题目节点管理', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_doc_fill', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/node/js/app.js',
    adminApi: [{
        url: 'node/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取节点列表',
    }, {
        url: 'node/getNode',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条节点信息',
    }, {
        url: 'node/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个节点',
    }, {
        url: 'node/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新节点信息',
    }, {
        url: 'node/deleteNode',
        method: 'get',
        controllerName: 'removes',
        details: '删除节点',
    }, {
        url: 'node/topNode',
        method: 'post',
        controllerName: 'updateNodeToTop',
        details: '节点推荐',
    }, {
        url: 'node/roofNode',
        method: 'post',
        controllerName: 'roofPlacement',
        details: '节点置顶',
    }, {
        url: 'node/redictNodeToUsers',
        method: 'post',
        controllerName: 'redictNodeToUsers',
        details: '分配用户',
    }],
    fontApi: [{
        url: 'node/getMyFavoriteNodes',
        method: 'get',
        controllerName: 'getMyFavoriteNodes',
        details: '获取收藏的节点列表',
        authToken: true
    }, {
        url: 'node/getUserNodes',
        method: 'get',
        controllerName: 'list',
        details: '获取用户的节点列表',
    }, {
        url: 'node/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取节点列表',
    }, {
        url: 'node/getRadomNodes',
        method: 'get',
        controllerName: 'getRadomNodes',
        details: '获取随机节点列表',
    }, {
        url: 'node/getRandomNodeImg',
        method: 'get',
        controllerName: 'getRandomNodeImg',
        details: '获取随机节点首图',
    }, {
        url: 'node/getRecommendedList',
        method: 'get',
        controllerName: 'getTopIndexNodes',
        details: '获取推荐节点列表',
    }, {
        url: 'node/getNode',
        method: 'get',
        controllerName: 'getOneNode',
        details: '获取单个节点信息',
    }, {
        url: 'node/addOne',
        method: 'post',
        controllerName: 'addNode',
        details: '新增节点',
        authToken: true
    }, {
        url: 'node/updateOne',
        method: 'post',
        controllerName: 'updateNode',
        details: '更新节点',
        authToken: true
    }, {
        url: 'node/getNearbyNode',
        method: 'get',
        controllerName: 'getNearbyNode',
        details: '上一篇/下一篇',
    }],

    initData: 'nodes.json', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraNode = {\n
        enable: true,\n        package: 'egg-dora-node',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    nodeRouter:{\n
        match: [ctx => ctx.path.startsWith('/manage/node'), ctx => ctx.path.startsWith('/api/node')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}
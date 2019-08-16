'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const express = require('express')
const app = express()
let appData = require('../src/mock/data.json')
let jkData = require('../src/mock/jkData.json') //集客
var jkCharts = jkData.chartList
let jkDataV = require('../src/mock/jkDataV.json')
var jkActiveDeploydata = jkDataV.activedeploydata
var jkActiveDeployTabledata = jkDataV.activedeploytabledata
var jkArea = jkData.area
var jkCity = jkData.city
var jkStore = jkData.store
var jkPerson = jkData.person
var jkPower = jkData.power

var liveroom = appData.liveroom
var senddata = appData.senddata
var effectTop = appData.effectTop
var effectList = appData.effectList
var effectSingle = appData.effectSingle
var userGroup = appData.userGroup
var testGroup = appData.testGroup
var userGroupCount = appData.userGroupCount
var testGroupCount = appData.testGroupCount
var taskBase = appData.taskBase
var getMsgTemp = appData.getMsgTemp
var copyMsg = appData.copyMsg
var replyRecord = appData.replyRecord
var sendRecord = appData.sendRecord
var tempList = appData.tempList
var msgManage = appData.msgManage
var getTaskRef = appData.getTaskRef
var tempDelete = appData.tempDelete
var tempCreat = appData.tempCreat
var msgDelete = appData.msgDelete
let dudata = require('../src/mock/dudata.json')
var groupManage = dudata.groupManage
let UManageData = require('../src/mock/usermanage.json') // 用户群管理
var usernamecheck = UManageData.usernamecheck // 普通用户名验证
var userinfocount = UManageData.userinfocount // 普通用户群计算
var userinfosend = UManageData.userinfosend // 普通用户群保存
var nomalusereditdata = UManageData.nomalusereditdata // 普通用户群编辑
var catIdistdata = UManageData.catIdistdata // 新建用户群品类
var brandlistdata = UManageData.brandlistdata // 新建用户群品牌
var citylistdata = UManageData.citylistdata // 新建用户群城市
var deletemanagelist = UManageData.deletemanagelist // 删除用户群
var exportOk = UManageData.exportOk // 用户管理-导出成功
var exportErr = UManageData.exportErr // 用户管理-导出失败
var usergroupmanagedata = UManageData.usergroupmanagedata
var editgroupmanagedata = UManageData.editgroupmanagedata // 编辑测试群
var deleteTestUserdata = UManageData.deleteTestUser // 测试群管理  删除测试号
var deleteTestGroupdata = UManageData.deleteTestGroup // 测试群管理  删除测试组
var saveHandTestGroupdata = UManageData.saveHandTestGroup // 测试群管理  添加测试组
var saveImportTestGroupdata = UManageData.saveImportTestGroup // 测试群管理  上传文件测试组
var targetgroupdata = UManageData.targetgroupdata // 目标群组
var usercountdata = UManageData.usercountdata // 计算
var updataserch = UManageData.updataserch // 计算
var normaldata = UManageData.normaldata // 普通
var unnormaldata = UManageData.unnormaldata // 复合
var userblackdata = UManageData.userblackdata // 手机黑名单
var deletuserblacklist = UManageData.deletuserblacklist // 删除手机黑名单
var batchupload = UManageData.batchupload // 批量上传
var handaddblack = UManageData.handaddblack // 手动添加
var saveHandTestGroupUserdata = UManageData.saveHandTestGroupUser // 测试群编辑  手动添加
var deleteTestGroupUserdata = UManageData.deleteTestGroupUser // 测试群编辑  删除测试群组用户id
var saveImportTestGroupUserdata = UManageData.saveImportTestGroupUser // 测试群编辑  批了导入用户群组
var apiRoutes = express.Router()
app.use('/api', apiRoutes)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      app.get('/api/liveroom', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: liveroom
        })
      }),
      app.get('/api/effectTop', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: effectTop
        })
      }),
      app.get('/api/effectList', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: effectList
        })
      }),
      app.get('/api/effectSingle', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: effectSingle
        })
      }),
      app.get('/api/userGroup', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: userGroup
        })
      }),
      app.get('/api/tempDelete', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: tempDelete
        })
      }),
      app.get('/api/tempCreat', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: tempCreat
        })
      }),
      app.get('/api/testGroup', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: testGroup
        })
      }),
      app.get('/api/userGroupCount', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: userGroupCount
        })
      }),
      app.get('/api/testGroupCount', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: testGroupCount
        })
      }),
      app.get('/api/getMsgTemp', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: getMsgTemp
        })
      }),
      app.get('/api/copyMsg', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: copyMsg
        })
      }),
      app.get('/api/replyRecord', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: replyRecord
        })
      }),
      app.get('/api/sendRecord', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: sendRecord
        })
      }),
      app.get('/api/tempList', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: tempList
        })
      }),
      app.get('/api/msgManage', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: msgManage
        })
      }),
      app.get('/api/msgDelete', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: msgDelete
        })
      }),
      app.get('/api/getTaskRef', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: getTaskRef
        })
      }),
      app.get('/api/taskBase', (req, res) => {
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: taskBase
        })
      }),
      app.get('/api/senddata', (req, res) => {
        res.json({
          errno: 0,
          data: senddata
        })
      }),
      app.get('/api/groupManage', (req, res) => {
        res.json({
          errno: 0,
          data: groupManage
        })
      }),
      app.get('/api/usernamecheck', (req, res) => { // 普通用户名验证
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: usernamecheck
        })
      }),
      app.get('/api/userinfocount', (req, res) => { // 普通用户计算
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: userinfocount
        })
      }),
      app.get('/api/userinfosend', (req, res) => { // 普通用户保存
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: userinfosend
        })
      }),
      app.get('/api/nomalusereditdata', (req, res) => { // 普通用户群编辑
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: nomalusereditdata
        })
      }),
      app.get('/api/catIdistdata', (req, res) => { // 新建品类数据
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: catIdistdata
        })
      }),
      app.get('/api/brandlistdata', (req, res) => { // 新建品牌数据
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: brandlistdata
        })
      }),
      app.get('/api/citylistdata', (req, res) => { // 新建城市数据
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: citylistdata
        })
      }),
      app.get('/api/deletemanagelist', (req, res) => { // 删除用户群
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: deletemanagelist
        })
      }),
      app.get('/api/exportOk', (req, res) => { // 用户管理-导出成功
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: exportOk
        })
      }),
      app.get('/api/exportErr', (req, res) => { // 用户管理-导出失败
        res.json({
          success: true,
          errCode: "0",
          errMsg: null,
          data: exportErr
        })
      }),
      app.get('/api/usergroupmanagedata', (req, res) => { // 用户群管理
        res.json({
          errno: 0,
          data: usergroupmanagedata
        })
      }),
      app.get('/api/editgroupmanagedata', (req, res) => { // 编辑测试群
        res.json({
          errno: 0,
          data: editgroupmanagedata
        })
      }),
      app.get('/api/deleteTestUserdata', (req, res) => { // 测试群管理 删除测试号
        res.json({
          errno: 0,
          data: deleteTestUserdata
        })
      }),
      app.get('/api/deleteTestGroupdata', (req, res) => { // 测试群管理 删除测试群
        res.json({
          errno: 0,
          data: deleteTestGroupdata
        })
      }),
      app.get('/api/saveHandTestGroupdata', (req, res) => { // 测试群管理 添加测试群
        res.json({
          errno: 0,
          data: saveHandTestGroupdata
        })
      }),
      app.get('/api/saveImportTestGroupdata', (req, res) => { // 测试群管理 添加测试群
        res.json({
          errno: 0,
          data: saveImportTestGroupdata
        })
      }),
      app.get('/api/targetgroupdata', (req, res) => { // 新建复合群目标群组
        res.json({
          errno: 0,
          data: targetgroupdata
        })
      }),
      app.get('/api/usercountdata', (req, res) => { // 计算
        res.json({
          errno: 0,
          data: usercountdata
        })
      }),
      app.get('/api/updataserch', (req, res) => { // 更新
        res.json({
          success: true,
          errCode: "0",
          remark:"操作成功",
          errMsg: null,
          data: updataserch
        })
      }),
      app.get('/api/normaldata', (req, res) => { // 普通
        res.json({
          errno: 0,
          data: normaldata
        })
      }),
      app.get('/api/unnormaldata', (req, res) => { // 复合
        res.json({
          errno: 0,
          data: unnormaldata
        })
      }),
      app.get('/api/userblackdata', (req, res) => { // 黑名单
        res.json({
          errno: 0,
          data: userblackdata
        })
      }),
      app.get('/api/deletuserblacklist', (req, res) => { // 删除黑名单
        res.json({
          errno: 0,
          data: deletuserblacklist
        })
      }),
      app.get('/api/batchupload', (req, res) => { // 批量上传黑名单
        res.json({
          errno: 0,
          data: batchupload
        })
      }),
      app.get('/api/handaddblack', (req, res) => { // 手动添加黑名单
        res.json({
          errno: 0,
          data: handaddblack
        })
      }),
      app.get('/api/saveHandTestGroupUserdata', (req, res) => { // 测试群编辑 手动添加
        res.json({
          errno: 0,
          data: saveHandTestGroupUserdata
        })
      }),
      app.get('/api/deleteTestGroupUserdata', (req, res) => { // 测试群编辑 删除测试群组用户id
        res.json({
          errno: 0,
          data: deleteTestGroupUserdata
        })
      }),
      app.get('/api/saveImportTestGroupUserdata', (req, res) => { // 测试群编辑 批量导入用户群组
        res.json({
          errno: 0,
          data: saveImportTestGroupUserdata
        })
      }),
      app.get('/api/statistical', (req, res) => { // 集客概论表数据
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkCharts
        })
      }),
      app.get('/api/activedeploydata', (req, res) => { // 集客领券
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkActiveDeploydata
        })
      }),
      app.get('/api/activedeploytabledata', (req, res) => { // 集客领券
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkActiveDeployTabledata
        })
      }),
      app.get('/api/area', (req, res) => { // 集客
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkArea
        })
      }),
      app.get('/api/city', (req, res) => { // 集客
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkCity
        })
      }),
      app.get('/api/store', (req, res) => { // 集客
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkStore
        })
      }),
      app.get('/api/person', (req, res) => { // 集客
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          data: jkPerson
        })
      }),
      app.get('/api/power', (req, res) => { // 集客
        res.json({
          success: true,
          errCode: '0',
          errMsg: null,
          login: true,
          data: jkPower
        })
      })
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

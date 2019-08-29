'use strict'
var path = require('path');
var webpack = require('webpack');
const merge = require('webpack-merge');
const options = require('./webpack.base.conf');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');



module.exports = merge(options,{
  entry:path.resolve(__dirname,'../packages/index.js'),
  output:{
    path:path.resolve(__dirname, '../static'),
    filename: 'gv-unit.js',
    library: 'GVUNIT', // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  externals:{
    vue:{
      root:'Vue',
      commonjs:'vue',
      commonjs2:'vue',
      amd:'vue'
    }
  },
  
  plugins:[
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          dead_code: true,    //移除没被引用的代码
          warnings: false,
          loops: true //当do、while 、 for循环的判断条件可以确定是，对其进行优化
        },
        except: ['$super', '$', 'exports', 'require']    //混淆,并排除关键字
      },
      sourceMap: true,
      parallel: true
    })
  ]
})
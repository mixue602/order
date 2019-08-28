# 11

> 1.0.0

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
# 代码提交uat
npm run commit -uat
```
# 代码提交生产
npm run commit
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
##前端分布详情  src
``` bash
src
  |
  |--api   #后端接口
       |--api_address   #地址接口
       |--api_card      #卡接口
       |--api_invoice   #发票接口
       |--api_resume    #履历接口
       |--api_login.js  #登录接口
       |--api_test.js   #本地测试接口
       |--env.js        #环境变量
       |--index.js      #请求封装
  |--assets    #图片、字体、css样式
       |--font          #字体
       |--images        #图片
       |--styles        #样式
  |
  |--common     #公共组件
  |
  |--components     #前端页面
  |
  |--router         #前端路由
  |
  |--store          #前端公共变量

```
## 前端页面详情 src/components

``` bash
# 会员查询
memberQuery.vue

# 新建会员卡           
memberNewlyBuild.vue

# 会员详情
memberDetails.vue

# 会员地址    
memberAddress.vue

# 会员美豆
memberBeanRecord.vue

# 会员订单
memberOrderRecord.vue

# 会员优惠券
memberVoucherRecord.vue

# 会员发票
memberInvoice.vue
```

## 前端接口配置详情  src/api

``` bash
# 环境变量配置文件
env.js

# 接口封装文件
index.js

# 登录接口配置
api_login.js

# 开卡、查询卡、卡详情接口
api_card
   |  ## 卡公共接口
   |--cardCommon.js
   |  ## 卡查询接口
   |--memberQuery.js
   |  ## 开卡接口
   |--memberNewlyBuild.js
   |  ## 卡详情接口
   |--memberDetails.js

# 会员地址接口
api_address/memberAddress.js

# 发票接口
api_invoice/memberInvoice.js

# 优惠券履历、美豆履历，订单履历
api_resume
    |  ## 优惠券履历
    |--memberVoucherRecord.js
    |  ## 订单履历
    |--memberOrderRecord.js
    |  ## 美豆履历
    |--memberBeanRecord.js
```

##  前端测试环境url

``` bash
# 会员查询
http://mpf.atguat.com.cn/member/memberQuery

# 新建会员卡
http://mpf.atguat.com.cn/member/memberNewlyBuild

# 会员详情
http://mpf.atguat.com.cn/member/memberDetails

#会员地址
http://mpf.atguat.com.cn/member/memberAddress

#会员美豆
http://mpf.atguat.com.cn/member/memberBeanRecord

#会员订单
http://mpf.atguat.com.cn/member/memberOrderRecord

#会员优惠券
http://mpf.atguat.com.cn/member/memberVoucherRecord

#会员发票
http://mpf.atguat.com.cn/member/memberInvoice

#测试数据
有卡数据
18612660813
13311118888
可升级卡
18010120153
0018010120152
0018010120152
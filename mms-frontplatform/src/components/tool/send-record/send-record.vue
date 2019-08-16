<template>
  <div class="sr-wrapper" v-if="authorizedPage">
    <div class="widget-box clearfix">
      <div class="widget-header n-widget-header">
        <h5 class="widget-title">检索条件</h5>
      </div>
      <div class="widget-main">
        <el-form ref="ruleForm" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户ID/手机号：" required>
                <el-input v-model.trim="searchData.content" placeholder="请输入用户ID和手机号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发送状态：">
                <el-select v-model="searchData.status" clearable>
                  <el-option value="1" label="发送成功"></el-option>
                  <el-option value="0" label="发送失败"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="类型：">
                <el-select v-model="searchData.type" clearable>
                  <el-option value="0" label="正式"></el-option>
                  <el-option value="1" label="测试"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发送时间：" required>
                <el-date-picker class="fl"
                  v-model="searchData.createDateStart"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart">
                </el-date-picker>
                <el-date-picker class="fr"
                  v-model="searchData.createDateEnd"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :style="'padding-bottom:15px'">
            <el-col :span="12" :offset="12">
              <el-button class="btn btn-primary" :style="'margin-left:150px'" v-if="authorizedData.mms_tool_searchsend_note" @click="sendSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="mt15 clearfix">
      <table class="table">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>手机号</th>
            <th>类型</th>
            <th width="50%">短信内容</th>
            <th>发送时间</th>
            <th>发送渠道</th>
            <th>发送状态</th>
            <th>失败原因</th>
          </tr>
        </thead>
        <tbody v-if="isFirst">
          <tr class="bgf">
            <td class="no-search text-center" colspan="7">
              由于数据过多，请先输入过滤条件后点击“搜索”按钮
            </td>
          </tr>
        </tbody>
        <tbody v-if="!isFirst && sendData.length">
          <tr v-for="(item, index) in sendData" :key="index">
            <td>{{ item.userId }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.operateType | operateFilter }}</td>
            <td>{{ item.sendContent }}</td>
            <td>{{ item.sendTime | mmtime }}</td>
            <td>{{ initBase.channels[item.channel] }}</td>
            <td>{{ item.stateCode | sendState }}</td>
            <td>{{ item.errCode }}</td>
          </tr>
        </tbody>
        <tbody v-if="!isFirst && !sendData.length">
          <tr class="bgf">
            <td class="text-center no-search" colspan="7">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <div class="clearfix">
        <pager :total="total" :pages="pages" :pageNum="searchData.pageNum" v-on:pageinfo="pageInit"></pager>
        <div class="result" :style="'margin-top:25px'" v-if="sendData.length > 0">
          共为您找到<i class="red">{{total}}</i>条结果
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { getTask, sendInfoList, pageAuthorized } from 'api/msgService'
import pager from 'common/pager'
export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      isFirst: true, // 判断是否是第一次渲染页面
      sendData: [], // 渲染列表数据
      initBase: {},
      pages: '', // 总页数
      total: '', // 总条数
      copySearchData: {}, // 处理填写搜索条件后，不点搜索按钮，点分布情况
      searchData: { // 搜索条件数据组
        content: '',
        status: '',
        createDateStart: '',
        createDateEnd: '',
        type: '',
        pageNum: 1,
        pageSize: 10
      },
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.createDateEnd !== '' && this.searchData.createDateEnd) {
            var d = new Date(this.searchData.createDateEnd).getTime()
            return time.getTime() < d - 3600 * 1000 * 24 * 60 + 86400000 || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.createDateStart !== '' && this.searchData.createDateStart) {
            var d = new Date(this.searchData.createDateStart).getTime() - 86400000
            var endTime = d + 3600 * 1000 * 24 * 60
            endTime = endTime > Date.now() ? Date.now() : endTime
            return time.getTime() < d || time.getTime() > endTime
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  /** 渲染列表，通过value值渲染不同方案 */
  filters: {
    sendState: function (value) {
      return (value === '1' || value === 1) ? '成功' : '失败'
    },
    operateFilter: function (value) {
      return (value === '1' || value === 1) ? '测试' : '正式'
    }
  },
  components: {
    'pager': pager
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_sms_send_record'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_sms_send_record
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.initTaskBase()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    initTaskBase: function () {
      var _this = this
      getTask((data) => {
        if (data.success === true || data.success === 'true') {
          _this.initBase = data.data
        }
      })
    },
    /** 搜索渲染 */
    sendSearch: function () {
      if (this.searchData.content && this.searchData.createDateStart && this.searchData.createDateEnd) {
        this.isFirst = false
        this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
        this.searchData.pageNum = 1
        this.search()
      } else {
        if (!this.searchData.content) {
          this.$message('请输入用户ID/手机号')
        } else {
          this.$message('请选择发送时间')
        }
      }
    },
    search: function () {
      var _this = this
      sendInfoList(_this.searchData, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.sendData = data.data.list
          _this.pages = data.data.pages
          _this.total = data.data.total
          _this.searchData.pageNum = data.data.pageNum
          _this.searchData.pageSize = data.data.pageSize
        }
      })
    },
    /** 分页跳转渲染 */
    pageInit: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.copySearchData.pageSize = data.pagecount
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.search()
    }
  }
}
</script>

<style>
.el-main .sr-wrapper .el-date-editor.el-input{ width:49%}
.el-main .sr-wrapper .el-date-editor.el-input .el-input__inner{ background-color:#fff!important;}
.sr-wrapper .el-select{ width: 100%;}
.sr-wrapper .el-select .el-input__inner{ background: #fff!important;}
</style>

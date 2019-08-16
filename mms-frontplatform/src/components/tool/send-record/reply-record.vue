<template>
  <div class="reply-record" v-if="authorizedPage">
    <div class="widget-box clearfix">
        <div class="widget-header n-widget-header">
            <h5 class="widget-title">检索条件</h5>
        </div>
      <div class="widget-main clearfix">
        <el-form ref="ruleForm" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户ID/手机号：">
                <el-input v-model.trim="searchData.content" placeholder="请输入用户ID和手机号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="短信内容：">
                <el-input v-model.trim="searchData.replayInfo" placeholder="请输入短信内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :style="'padding-bottom:15px'">
            <el-col :span="12">
              <el-form-item label="接收时间：" required>
                <el-date-picker class="fl"
                  v-model="searchData.receiveDateStart"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart">
                </el-date-picker>
                <el-date-picker class="fr"
                  v-model="searchData.receiveDateEnd"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" :style="'margin-left:150px'" class="primary—btn btn btn-primary" v-if="authorizedData.mms_tool_searchreply_note" @click="replyRearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="mt15 clearfix">
      <a class="btn btn-primary" :style="'padding:8px 12px; line-height:1'" v-if="authorizedData.mms_tool_importreply_note" @click="replayExport">导出</a>
    </div>
    <div class="reply-table mt10">
      <table class="table">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>手机号码</th>
            <th>短信回复内容</th>
            <th>接收时间</th>
          </tr>
        </thead>
        <tbody v-if="isFirst">
          <tr class="bgf">
            <td class="text-center no-search" colspan="4">
              由于数据过多，请先输入过滤条件后点击“搜索”按钮
            </td>
          </tr>
        </tbody>
        <tbody v-if="!isFirst && replyData.length">
          <tr v-for="(item, index) in replyData" :key="index">
            <td>{{ item.userId }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.content }}</td>
            <td>{{ item.receiveTime | time }}</td>
          </tr>
        </tbody>
        <tbody v-if="!isFirst && !replyData.length">
          <tr class="bgf">
            <td class="text-center no-search" colspan="4">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <div class="clearfix">
        <pager :total="total" :pages="pages" :pageNum="searchData.pageNum" v-on:pageinfo="pageInit"></pager>
        <div class="result" :style="'margin-top:25px'" v-if="replyData.length > 0">
          共为您找到<i class="red">{{total}}</i>条结果
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { sendReplayList, exportReplayList, pageAuthorized } from 'api/msgService'
import pager from 'common/pager'
export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      isFirst: true, // 判断是否是第一次渲染页面
      pages: '', // 总页数
      total: '', // 总条数
      replyData: [], // 渲染列表数据
      copySearchData: {}, // 处理填写搜索条件后，不点搜索按钮，点分布情况
      searchData: { // 搜索条件数据组
        content: '', // 用户ID和手机号
        replayInfo: '', // 内容
        receiveDateStart: '',
        receiveDateEnd: '',
        pageNum: 1,
        pageSize: 10
      },
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.receiveDateEnd !== '' && this.searchData.receiveDateEnd) {
            var d = new Date(this.searchData.receiveDateEnd).getTime()
            return time.getTime() < d - 3600 * 1000 * 24 * 60 + 86400000 || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.receiveDateStart !== '' && this.searchData.receiveDateStart) {
            var d = new Date(this.searchData.receiveDateStart).getTime() - 86400000
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
  components: {
    'pager': pager
  },
  mounted: function () {
    var _this = this
    pageAuthorized({
      code: 'mms_sms_reply_record'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_sms_reply_record
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    /** 搜索渲染 */
    replyRearch: function () {
      var _this = this
      if (this.searchData.receiveDateStart && this.searchData.receiveDateStart) {
        _this.isFirst = false
        _this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
        _this.searchData.pageNum = 1
        _this.search()
      } else {
        _this.$message('请选择接收时间')
      }
    },
    search: function () {
      var _this = this
      sendReplayList(_this.searchData, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.replyData = data.data.list
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
    },
    replayExport: function () {
      if (this.searchData.receiveDateStart && this.searchData.receiveDateEnd) {
        exportReplayList(this.searchData)
      } else {
        this.$message('请选择接收时间')
      }
    }
  }
}
</script>

<style>
.el-main .reply-record .el-date-editor.el-input{ width:49%}
.el-main .reply-record .el-date-editor.el-input .el-input__inner{ background-color:#fff!important;}
</style>

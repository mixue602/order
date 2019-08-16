<template>
  <div class="mt-wrapper" v-if="authorizedPage">
    <div class="widget-box clearfix">
      <div class="widget-header n-widget-header">
        <h5 class="widget-title">检索条件</h5>
      </div>
      <div class="widget-main">
        <el-form ref="ruleForm" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="短信内容：">
                <el-input v-model.trim="searchData.content" placeholder="请输入短信模板内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作人：">
                <el-input v-model.trim="searchData.user" placeholder="请输入操作人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :style="'padding-bottom:15px'">
            <el-col :span="12">
              <el-form-item label="创建时间：" required>
                <el-date-picker class="fl"
                  v-model="searchData.createDateStart"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="false"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart">
                </el-date-picker>
                <el-date-picker class="fr"
                  v-model="searchData.createDateEnd"
                  type="date"
                  size="small"
                  :editable="false"
                  :clearable="false"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" :style="'margin-left:150px'" class="btn btn-primary" v-if="authorizedData.mms_tool_search_note" @click="tempSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="mt15 clearfix">
      <el-button class="btn btn-green" v-if="authorizedData.mms_tool_newnote_note" @click="creatMsgVisible = true">新建短信模板</el-button>
      <el-dialog title="新建短信模板" class="creat-msg-dialog" :visible.sync="creatMsgVisible">
        <div class="form-group clearfix">
          <label class="col-xs-2 col-sm-2 col-md-2 text-right">短信模板</label>
          <div class="col-xs-10 col-sm-10 col-md-10">
            <textarea class="textarea-box" v-model="msgContent"></textarea>
            <span>已输入<i class="red">{{infoContent.length}}</i>字，预计发送{{infoContent.size}}条短信，70字/条，最多500字。</span>
            <span v-if="infoContent.error" class="error" :style="'display:inline; position:static;'">{{infoContent.errorMsg}}</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn btn-white" @click="creatMsgVisible = false">取 消</el-button>
          <el-button class="btn btn-primary" @click="checkWord">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mt10 clearfix" ref="tableWrap">
      <table class="table">
        <thead>
          <tr>
            <th width="60%">短信内容</th>
            <th width="15%">创建时间</th>
            <th width="10%">操作人</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody v-if="tempData.length">
          <tr v-for="(item, index) in tempData" :key="index">
            <td><span class="tempcon-item" :style="{width: tempWidth}">{{ item.content }}</span></td>
            <td>{{ item.createTime | mmtime }}</td>
            <td>{{ item.updateUser }}</td>
            <td>
              <a class="mm-btn" v-if="authorizedData.mms_tool_macking_note" @click="jumpEffect(item.id)">短信营销</a>
              <a class="mm-btn" v-if="authorizedData.mms_tool_change_note" @click="(taskId = item.id, msgContent = item.content, creatMsgVisible = true)">修改</a>
              <a class="mm-btn" v-if="authorizedData.mms_tool_del_note" @click="deleteTemp(item.id)">删除</a>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr class="bgf">
            <td class="text-center no-search" colspan="7">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <div class="clearfix">
        <pager :total="total" :pages="pages" :pageNum="searchData.pageNum" isTotalTxt="true" v-on:pageinfo="pageInit"></pager>
        <div class="result" :style="'margin-top:25px'" v-if="tempData.length > 0">
          共为您找到<i class="red">{{total}}</i>条结果，<a @click="getManaggeAll">返回查看全部</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { tempList, tempCreat, tempModify, tempDelete, pageAuthorized, checkSensitiveWords } from 'api/msgService'
import pager from 'common/pager'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      creatMsgVisible: false, // 新建修改弹窗控制值
      tempData: [], // 模板渲染数据
      pages: 0, // 总页数
      total: 0, // 总条数
      taskId: '', // 修改时存放taskId
      msgContent: '', // 新建修改时存放内容
      infoContent: { // 短信内容textarea信息
        length: 4,
        size: 1,
        isWarn: false,
        error: true,
        errorMsg: ''
      },
      copySearchData: {}, // 处理填写搜索条件后，不点搜索按钮，点分布情况
      searchData: { // 搜索条件数据组
        content: '',
        user: '',
        createDateStart: '',
        createDateEnd: '',
        pageNum: 1,
        pageSize: 10
      },
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => {
          if (this.searchData.createDateEnd !== '' && this.searchData.createDateEnd) {
            var d = new Date(this.searchData.createDateEnd).getTime()
            return time.getTime() > Date.now() || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      /** 今日以前日期，后面日期不可选择 */
      pickerEnd: {
        disabledDate: (time) => {
          if (this.searchData.createDateStart !== '' && this.searchData.createDateStart) {
            var d = new Date(this.searchData.createDateStart).getTime()
            return time.getTime() < d || time.getTime() > Date.now()
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
      code: 'mms_sms_template_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_sms_template_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.tempWidth = parseInt(document.body.offsetWidth * 0.6) + 'px'
            _this.tempSearch()
          }
        } else {
          window.location.href = mmsDomain.ermHome
        }
      }
    })
  },
  methods: {
    getManaggeAll: function () {
      this.search({
        content: '',
        user: '',
        createDateStart: '',
        createDateEnd: '',
        pageNum: 1,
        pageSize: this.searchData.pageSize
      })
    },
    tempSearch: function () {
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.searchData.pageNum = 1
      this.search(this.searchData)
    },
    search: function (searchData) {
      var _this = this
      tempList(searchData, function (data) {
        if (data.success === true || data.success === 'true') {
          _this.tempData = data.data.list
          _this.pages = data.data.pages ? data.data.pages : _this.pages
          _this.total = data.data.total ? data.data.total : _this.total
          _this.searchData.pageNum = data.data.pageNum ? data.data.pageNum : _this.searchData.pageNum
          _this.searchData.pageSize = data.data.pageSize ? data.data.pageSize : _this.searchData.pageSize
        }
      })
    },
    pageInit: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.copySearchData.pageSize = data.pagecount
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.search(this.searchData)
    },
    msgCompute: function (content) {
      var obj = {}
      if (content !== '') {
        var length = content.length
        /** 默认按4个字符计算 */
        var nameReg = /#用户名#/g
        /** 默认按9个字符计算 */
        var voucherReg = /#券号#/g
        /** 默认按6个字符计算 */
        var codeReg = /#激活码#/g
        /** 默认按10个字符计算 */
        var categoryReg = /#品类#/g
        /** 默认按13个字符计算 */
        var urlReg = /#url#/g
        length += content.match(nameReg) ? -1 * content.match(nameReg).length : 0
        length += content.match(voucherReg) ? content.match(voucherReg).length * 5 : 0
        length += content.match(codeReg) ? content.match(codeReg).length : 0
        length += content.match(categoryReg) ? content.match(categoryReg).length * 6 : 0
        length += content.match(urlReg) ? content.match(urlReg).length * 8 : 0
        obj.length = length
        obj.error = length > 500

        var n = length !== 0 ? length > 70 ? Math.ceil(length / 67) : 1 : 0
        switch (n) {
          case 0:
          case 1:
            obj.size = n
            obj.isWarn = false
            break
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            obj.size = n
            if (!this.infoContent.isWarn) {
              this.$confirm('短信内容已超 70 个字，已成为多条短信。', '提示', {
                confirmButtonText: '知道了',
                showCancelButton: false,
                type: 'warning'
              })
            }
            obj.isWarn = true
            break
          default:
            obj.size = n
            obj.isWarn = false
        }
        return obj
      } else {
        return {
          length: 4,
          size: 0,
          isWarn: false,
          error: false,
          errorMsg: ''
        }
      }
    },
    checkMsgcon: function (value) {
      var _this = this
      if (value === '' && _this.creatMsgVisible) {
        _this['infoContent'].error = true
        _this['infoContent'].errorMsg = '短信内容不能为空'
      } else if (value.length > 500) {
        _this['infoContent'].error = true
        _this['infoContent'].errorMsg = '已超过最大字数限制'
      } else {
        _this['infoContent'].error = false
        _this['infoContent'].errorMsg = ''
      }
    },
    checkWord: function () {
      var _this = this
      if (!_this.infoContent.error) {
        checkSensitiveWords({
          'shortMsgContentA': _this.msgContent
        }, function (data) {
          if (data.success === false || data.success === 'false') {
            _this.$confirm(data.data, '敏感词提示', {
              confirmButtonText: '忽略保存',
              cancelButtonText: '取消修改',
              type: 'warning'
            }).then(() => {
              _this.tempSave()
            })
          } else {
            _this.tempSave()
          }
        })
      } else {
        this.infoContent.error = '短信内容不能为空'
        this.infoContent.errorMsg = '短信内容不能为空'
      }
    },
    tempSave: function () {
      var _this = this
      if (!_this.taskId) {
        tempCreat({
          'content': _this.msgContent
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            _this.creatMsgVisible = false
            _this.search(_this.searchData)
          } else {
            _this.$message('保存失败' + data.remark)
          }
        })
      } else {
        tempModify({
          'id': _this.taskId,
          'content': _this.msgContent
        }, function (data) {
          if (data.success === true || data.success === 'true') {
            _this.creatMsgVisible = false
            _this.search(_this.searchData)
          } else {
            _this.$message('保存失败' + data.remark)
          }
        })
      }
    },
    deleteTemp: function (id) {
      var _this = this
      _this.$confirm('确定要删除该短信模板么?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        tempDelete({
          id: id
        }, function (data) {
          _this.search(_this.searchData)
        })
      }).catch(() => {})
    },
    jumpEffect: function (id) {
      this.creatMsgTempId(id)
      this.$router.push('/messagecreat')
    },
    ...mapMutations({
      creatMsgTempId: 'SET_MSGTEMPLETID'
    })
  },
  watch: {
    creatMsgVisible: function (value) {
      var _this = this
      if (!value) {
        setTimeout(function () {
          _this.msgContent = ''
          _this.taskId = ''
          _this.infoContent = {
            length: 0,
            size: 0,
            isWarn: false,
            error: true,
            errorMsg: ''
          }
        }, 50)
      }
    },
    'msgContent': function () {
      this.infoContent = this.msgCompute(this.msgContent)
      this.checkMsgcon(this.msgContent)
    }
  }
}
</script>

<style>
.textarea-box{ width:100%; height:200px;}
.el-date-editor.el-input, .el-date-editor.el-input__inner{ width: 180px;}
.creat-msg-dialog .el-dialog{ width:600px;}
.creat-msg-dialog .el-dialog__body{ padding:20px 20px 0;}
.tempcon-item{ display:block; height:22px; line-height:22px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;}
.el-main .mt-wrapper .el-date-editor.el-input{ width:49%}
.el-main .mt-wrapper .el-date-editor.el-input .el-input__inner{ background-color:#fff!important;}
.mt-wrapper .mm-btn{ margin-right:12px;}
</style>

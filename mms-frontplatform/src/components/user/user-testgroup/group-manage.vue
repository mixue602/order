<template>
  <div class="group">
    <div class="widget-box clearfix">
        <div class="widget-header n-widget-header">
            <h5 class="widget-title">检索条件</h5>
        </div>
      <div class="widget-main clearfix">
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">ID/手机号码</label>
            <div class="col-xs-8 col-sm-8">
                <input type="text" class="form-control" name="" v-model="searchData.phone" placeholder="请输入ID/手机号码"/>
            </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">编号</label>
            <div class="col-xs-8 col-sm-8">
                <input type="text" class="form-control" name="" v-model="searchData.name" placeholder="请输入编号或测试名称"/>
            </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <label class="col-xs-4 col-sm-4 control-label text-right">更新人</label>
            <div class="col-xs-8 col-sm-8">
                <input type="text" class="form-control" name="" v-model="searchData.updateUser" placeholder="请输入更新人"/>
            </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <div class="col-xs-4 col-sm-4 pr0 control-label text-right">
            <el-select v-model="searchData.dateType" style="width:105px; float: right;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="col-xs-4 col-sm-4">
            <el-date-picker
                  v-model="searchData.startDate"
                  type="date"
                  placeholder="开始时间"
                  size="small"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerStart">
            </el-date-picker>
          </div>
          <div class="col-xs-4 col-sm-4">
            <el-date-picker
                  v-model="searchData.endDate"
                  type="date"
                  size="small"
                  placeholder="结束时间"
                  :editable="false"
                  :clearable="true"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerEnd">
            </el-date-picker>
          </div>
        </div>
        <div class="form-group col-xs-6 col-sm-6 col-md-6">
          <!-- <label class="col-xs-4 col-sm-4 control-label text-right">搜索按钮</label> -->
           <div class="col-xs-4 col-sm-4"></div>
          <div class="col-xs-4 col-sm-4">
              <el-button type="primary" class="btn btn-primary primary—btn mr10" @click="managgeSearch" v-if="authorizedData.mms_group_search_testgroup">搜索</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="user" style="margin:10px 0 10px 0;">
      <el-button type="primary" class="btn btn-primary primary—btn " @click="delTestNum = true" v-if="authorizedData  .mms_group_deltestnum_testgroup">删除测试号</el-button>
      <el-button type="primary" class="btn btn-primary primary—btn " @click="addTestGroupShow = true" v-if="authorizedData.mms_group_newtestgroup">+新建测试群</el-button>
      <el-dialog title="删除测试号" :visible.sync="delTestNum" class="align-left" width="600px">
        <el-form :model="delform" :rules="rules" ref="delform" label-width="120px" class="align-left">
          <el-form-item label="删除类型">
            <el-radio-group v-model="deltestradio">
              <el-radio label="0">用户ID</el-radio>
              <el-radio label="1">手机号码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="删除测试号" prop="desc">
            <el-input v-model="delform.desc" placeholder="请输入测试号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="delTestNumBtn('delform')" class="btn btn-primary primary—btn">确 定</el-button>
          <el-button @click="delTestNum = false" class="btn btn-primary btn-white primary—btn">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 新建测试群弹层 -->
      <el-dialog title="新建测试群" :visible.sync="addTestGroupShow" class="align-left" width="600px">
        <el-form :model="addform" :rules="rules" ref="addform" label-width="120px" class="align-left" enctype="multipart/form-data">
          <el-form-item label="测试群名称:" prop="name">
            <el-input v-model="addform.name" placeholder="请输入测试群名称" v-on:blur="testGroupNameCheck(addform.name)"></el-input>
            <div class="el-form-item__error" v-show="sameName">用户名已存在</div>
          </el-form-item>
          <el-form-item label="添加方式:">
            <el-radio-group v-model="addModeRadio" @change="changeAddModeRadio">
              <el-radio label="1">批量导入</el-radio>
              <el-radio label="2">手动添加</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="添加类型:" v-show="typeshow">
            <el-radio-group v-model="addform.type">
              <el-radio label="0">用户ID</el-radio>
              <el-radio label="1">手机号码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="导入文件:" v-show="addfile" class="add-file" enctype="multipart/form-data" ref="up">
            <el-input disabled class="up-input" v-model="upLoadName"></el-input>
            <el-button type="primary" class="btn btn-primary primary—btn">选择</el-button>
            <input type="file" @change="getFile($event)" class="file" ref="clearfile"/>
            <p style="font-size:12px;">请先下载 <a :href="mmscUrl+'/static/template/TestGroupTemplate.xlsx'">测试用户导入模版</a></p>
            <!-- <el-upload
              class="ensure ensureButt up-button"
              ref="upload"
              action="http://mmsc.atguat.com.cn/mms/testGroup/saveHandTestGroup.do"
              :on-change="handleChange"
              :file-list="fileList"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选择</el-button>
            </el-upload> -->
          </el-form-item>
          <el-form-item label="添加测试号:" v-if="typeshow" prop="content">
            <el-input type="textarea" v-model="addform.content" placeholder="请添加测试号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addTestGroup('addform')" :disabled="addTestGroupShowState" class="btn btn-primary primary—btn"   v-if="addModeRadio === '1' && authorizedData.mms_group_import_newtestgroup">上 传</el-button> <!-- 批量导入 -->
          <el-button type="primary" @click="addTestGroup('addform')" :disabled="addTestGroupShowState" class="btn btn-primary primary—btn" v-if="addModeRadio === '2' && authorizedData.mms_group_hand_newtestgroup">上 传</el-button> <!-- 手动添加 -->
          <el-button @click="addTestGroupShow = false" class="btn btn-primary btn-white primary—btn">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mr25">
      <div :class="groupdata.list ? 'Ht0' : 'Ht100' " v-loading="groupdata.list ? false : true" element-loading-text="拼命加载中" :data="groupdata.list"></div>
      <table class="table dataTable table-striped" v-if="isFirst && groupdata.list">
        <thead>
          <tr role="row">
            <th>测试群名称</th>
            <th>群组信息</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>更新人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in groupdata.list" :key="index">
            <td>
              <div>{{item.name}}</div>
              <div>{{item.id}}</div>
            </td>
            <td>
              <div>用户ID：{{item.userCount}}</div>
              <div>手机数：{{item.phoneCount}}</div>
            </td>
            <td>{{item.createDate | time}}</td>
            <td>{{item.updateDate | time}}</td>
            <td>{{item.updateUser}}</td>
            <td>
              <a type="primary" class="btn-s1" @click="editTestGroup(item.id)" v-if="authorizedData.mms_group_edit_testgroup">编辑</a>
              <a type="primary" class="btn-s1" @click="delBoxBtn(index,item.id)" v-if="authorizedData.mms_group_del_testgroup">删除</a>
            </td>
          </tr>
        </tbody>
        <tbody v-if="listState">
          <tr class="bgf">
            <td class="text-center no-search" colspan="7">没有搜索到相关结果！</td>
          </tr>
        </tbody>
      </table>
      <pager :total="total" :pages="pages" v-on:pageinfo="pageInit" :pageNum="searchData.pageNum"></pager>
      <div class="result" v-if="isFirst && groupdata.list">
        共为您找到<i>{{total}}</i>条结果，<a @click="getManaggeAll">返回查看全部</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { getGroupManageList, getDeleteTestUser, getDeleteTestGroup, getSaveHandTestGroupUser, testGroupcheckList, userpageAuthorized } from 'api/serviceuser'
import pager from 'common/pager'
import { mapActions } from 'vuex'
export default {
  data () {
    var _this = this
    return {
      mmscUrl: mmsDomain.mmsc,
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      isFirst: true,
      addTestGroupShowState: false,
      pages: '',
      total: '',
      isSearch: true,
      listState: false,
      sameName: false, // 用户名验证
      searchData: {
        phone: '',
        name: '',
        updateUser: '',
        dateType: '0',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: '10'
      },
      copySearchData: {
        phone: '',
        name: '',
        updateUser: '',
        dateType: '0',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: '10'
      },
      options: [{
        value: '0',
        label: '创建时间'
      }, {
        value: '1',
        label: '更新时间'
      }],
      value: '创建时间',
      delTestNum: false, // 删除测试号
      delform: { // 删除测试号添加弹框表单内容 多余的自己删
        desc: ''
      },
      deltestradio: '0', // 选择删除测试类型
      addTestGroupShow: false, // 添加测试群
      addform: { // 新建测试群添加弹框表单内容 多余的自己删
        name: '',
        content: '',
        type: '0'
      },
      addModeRadio: '1', // 选择添加方式
      typeshow: false, // 添加类型是否显示
      addfile: true, // 导入文件是否显示
      addTypeRadio: '1', // 选择添加类型
      groupdata: '',
      rules: {
        desc: [
          { required: true, message: '请添加测试号', trigger: 'blur' }
          // { min: 4, max: 20, message: '长度在 4 到20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入测试群名称', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        upLoadName: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请添加测试号', trigger: 'blur' }
        ]
      },
      /** 上传参数 */
      upLoadName: '',
      upath: '',
      file: '',
      fileList: [],
      /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */
      pickerStart: {
        disabledDate: (time) => { // 判断前一个日历的日期不能大于后面的日历日期  且没有到的日期  不能选择
          if (_this.searchData.endDate !== '' && _this.searchData.endDate) {
            var d = new Date(_this.searchData.endDate).getTime()
            return time.getTime() > Date.now() || time.getTime() > d
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerEnd: { // 没有到的日期  不能选择
        disabledDate: (time) => {
          if (_this.searchData.startDate !== '' && _this.searchData.startDate) {
            var d = new Date(_this.searchData.startDate).getTime() - 86400000
            d = d > 0 ? d : 0
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
  created: function () {
    var _this = this
    userpageAuthorized({
      code: 'mms_test_group_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_test_group_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.getGroupData({})
          }
        } else {
          // 跳转到REM首页
          window.location.href(mmsDomain.ermHome)
        }
      }
    })
  },
  methods: {
    testGroupNameCheck: function (name) { // 验证用户名
      testGroupcheckList({'id': -1, 'name': this.addform.name}, (data) => {
        if (name !== '') {
          if (data.success === true) {
            this.sameName = false
          } else {
            this.sameName = true
          }
        }
      })
    },
    changeAddModeRadio (value) { // 添加方式按钮绑定值改变
      if (value === '2') {
        this.typeshow = true
        this.addfile = false
        this.addTypeRadio = '1'
      } else {
        this.typeshow = false
        this.addfile = true
      }
    },
    delBoxBtn (index, id) { // 删除按钮
      var _this = this
      _this.$confirm('确定删除测试群吗？', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDeleteTestGroup({
          'id': id
        }, (data) => {
          if (data.success === true) {
            _this.$message({
              message: '该测试群组删除成功',
              type: 'success'
            })
            _this.groupdata.list.splice(index, 1)
            _this.getGroupData(this.searchData)
          } else {
            _this.$message({
              message: '该测试群组正在使用中，无法删除。',
              type: 'warning'
            })
          }
        })
      }).catch(() => {
      })
    },
    delTestNumBtn (formName) { // 删除测试号方法
      var _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          getDeleteTestUser({
            'type': _this.deltestradio, // 类型
            'content': _this.delform.desc // 黑名单内容
          }, (data) => {
            if (data.success === true) {
              _this.delTestNum = false
              _this.$refs[formName].resetFields()
              _this.getGroupData(_this.copySearchData)
              _this.$message({
                message: '删除测试号成功',
                type: 'success'
              })
            } else {
              _this.$message({
                message: '删除测试号失败,请重试',
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    /** 分页跳转渲染 */
    pageInit: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.copySearchData.pageSize = data.pagecount
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getGroupData(this.copySearchData)
    },
    managgeSearch () { // 搜索按钮
      if (this.isSearch) {
        this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
        this.searchData.pageNum = 1
        this.getGroupData(this.searchData)
        // if (this.searchData.startDate !== '' || this.searchData.endDate !== '' || this.searchData.phone !== '' || this.searchData.name !== '' || this.searchData.updateUser !== '') {
        //   this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
        //   this.getGroupData(this.searchData)
        // } else {
        //   this.$message({
        //     message: '搜索条件不能为空',
        //     type: 'warning'
        //   })
        // }
      }
    },
    getManaggeAll: function () {
      this.getGroupData({
        phone: '',
        name: '',
        updateUser: '',
        dateType: '0',
        startDate: '',
        endDate: '',
        pageNum: '1',
        pageSize: this.searchData.pageSize
      })
      // 搜索数据重置
      this.searchData.phone = ''
      this.searchData.name = ''
      this.searchData.updateUser = ''
      this.searchData.dateType = ''
      this.searchData.startDate = ''
      this.searchData.endDate = ''
      this.searchData.pageNum = '1'
      this.searchData.pageSize = '10'
      // 搜索数据重置
      this.copySearchData.phone = ''
      this.copySearchData.name = ''
      this.copySearchData.updateUser = ''
      this.copySearchData.dateType = ''
      this.copySearchData.startDate = ''
      this.copySearchData.endDate = ''
      this.copySearchData.pageNum = '1'
      this.copySearchData.pageSize = '10'
    },
    getGroupData: function (Sdata) {
      var _this = this
      getGroupManageList(Sdata, (data) => { // 初始化列表
        if (data.success === true) {
          if (data.data.list.length > 0) {
            _this.listState = false
            _this.groupdata = data.data
            _this.pages = data.data.pages
            _this.total = data.data.total
            _this.searchData.pageNum = data.data.pageNum
            _this.searchData.pageSize = data.data.pageSize
          } else {
            _this.listState = true
            _this.groupdata = data.data
            _this.pages = data.data.pages
            _this.total = data.data.total
            _this.searchData.pageNum = data.data.pageNum
            _this.searchData.pageSize = data.data.pageSize
          }
        }
      })
    },
    addTestGroup: function (formName) { // 添加测试群
      var _this = this
      if (_this.addModeRadio === '2') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            getSaveHandTestGroupUser({
              'name': _this.addform.name,
              'type': _this.addform.type,
              'content': _this.addform.content
            }, (data) => {
              if (data.success === true) {
                _this.addTestGroupShow = false
                _this.$message({
                  message: '添加测试号成功',
                  type: 'success'
                })
                _this.addTestGroupShow = false
                _this.getGroupData(_this.copySearchData)
              } else {
                _this.$message('添加测试号失败,请重试!' + data.remark)
              }
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.addTestGroupShowState = true
            var zipFormData = new FormData()
            zipFormData.append('file', _this.file)
            zipFormData.append('name', _this.addform.name)
            // let config = { headers: { 'Content-Type': 'multipart/form-data' } }
            // postSaveImportTestGroupdata({
            //   zipFormData,
            //   config
            // }, (data) => {
            //   if (data.success === true) {
            //     _this.$message({
            //       message: '上传成功',
            //       type: 'success'
            //     })
            //     _this.addTestGroupShow = false
            //   } else {
            //     _this.$message({
            //       message: '上传失败',
            //       type: 'warning'
            //     })
            //   }
            // })
            this.$http.post(mmsDomain.mms + '/testGroup/saveImportTestGroup.do', zipFormData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(res => {
              if (res.body.success === true) {
                _this.$message('添加测试群成功,成功导入' + res.body.data + '条记录！')
                _this.getGroupData(_this.copySearchData)
                _this.addTestGroupShow = false
                _this.addTestGroupShowState = false
                _this.$refs[formName].resetFields()
                _this.upLoadName = ''
                _this.file = ''
                _this.$refs.clearfile.value = ''
              } else {
                _this.addTestGroupShowState = false
                if (res.body.code === 109) {
                  _this.$message({
                    message: '没有有效记录！',
                    type: 'error'
                  })
                } else {
                  _this.$message('添加测试群失败' + res.body.remark)
                }
              }
            }, res => {})
          } else {
            return false
          }
        })
      }
    },
    pageinfo: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.getGroupData(this.copySearchData)
    },
    getFile: function ($event) {
      var _this = this
      let file = $event.target.files[0]
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 25
      if (!extension && !extension2) {
        _this.$message({
          message: '上传模板只能是 xls、xlsx 格式!',
          type: 'warning'
        })
      } else if (!isLt2M) {
        _this.$message({
          message: '上传模板大小不能超过 25MB!',
          type: 'warning'
        })
      } else {
        _this.file = file
        _this.upLoadName = file.name
      }
      return (extension || extension2) && isLt2M
    },
    handleChange (file, fileList) {
      let _this = this
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt2M = (file.size) / 1024 / 1024 < 25
      if (!extension && !extension2) {
        // console.log('上传模板只能是 xls、xlsx 格式!')
        _this.$message({
          type: 'info',
          message: '上传模板只能是 xls、xlsx 格式!'
        })
        return false
      } else if (!isLt2M) {
        _this.$message({
          type: 'info',
          message: '上传模板大小不能超过 25MB!'
        })
        return false
      } else {
        _this.upLoadName = file.name
        _this.file = file
      }
      return (extension || extension2) && isLt2M
    },
    editTestGroup: function (id) {
      this.TGEdit(id) // 编辑传进id
      this.$router.push('/groupedit')
    },
    ...mapActions([
      'TGEdit'
    ])
  }
}
</script>

<style src="assets/css/usercommon.styl" lang="stylus"></style>
<style>
.group .el-input__inner[readonly]{
  background: #fff!important;
  height: 30px;

}
.group .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
.group .el-input--small .el-input__inner{
  background: #fff!important;
}
.group .result i{
  color: #e3101e;
}
.group .el-dialog__body{
  width: 600px;
  padding: 20px 20px 0 20px;
}
.group .el-form-item{
  margin-bottom: 20px;
}
.group .el-dialog__footer{
  padding-top: 0px;
}
.group .up-input{
  width: 60%;
}
.group .up-button{
  display: inline-block !important;
}
.group .none{
  display: none !important;
}
.group .add-file{
  position: relative;
}
.group .add-file .file{
  display: inline-block;
  margin-left: -68px;
  opacity: 0;
  width: 72px;
}
.mt10{ margin-top: 10px;}
.mb10{ margin-bottom: 10px;}
.group .pager{margin: 0px 0 !important;}
.group .el-loading-spinner .el-loading-text{ color: #4990e2;}
.Ht100{ height: 100px;}
.Ht0{ height: 0px;}
</style>

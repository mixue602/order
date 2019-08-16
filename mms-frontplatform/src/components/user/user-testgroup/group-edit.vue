<template>
  <div class="usergroupedit">
    <div class="widget-box clearfix">
      <div class="widget-header n-widget-header">
          <h5 class="widget-title">检索条件</h5>
      </div>
      <div class="widget-main clearfix">
        <!-- <div class="form-group col-xs-8 col-sm-8 col-md-4">
          <label class="col-xs-4 col-sm-4 control-label text-right">用户ID/手机号</label>
          <div class="col-xs-8 col-sm-8">
              <input type="text" class="form-control" name="id" v-model="searchData.name"  value="" placeholder="请输入用户ID或者手机号"/>
          </div>
        </div>
        <div class="form-group col-md-4">
          <el-button style="float:left;" type="primary" class="primary—btn btn btn-primary" @click="managgeSearch()" v-if="authorizedData.mms_group_search_testedit">搜索</el-button>
        </div> -->
        <el-form label-width="150px">
          <el-form-item label="用户ID/手机号">
            <el-input :style="'width:200px'" name="id" value="" v-model="searchData.name" placeholder="请输入用户ID或手机号"></el-input>
             <el-button type="primary" class="primary—btn btn btn-primary" @click="managgeSearch()" v-if="authorizedData.mms_group_search_testedit">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="form-group col-xs-12 col-sm-12 col-md-8 align-right">
            <div class="col-xs-12 col-sm-12">
              <el-dialog
                title="批量导入"
                :visible.sync="open"
                width="600px"
                class="align-left">
                <el-form ref="form" label-width="90px" class="align-left">
                  <el-form-item label="导入文件:" v-show="open" class="add-file" enctype="multipart/form-data" ref="up">
                    <el-input disabled class="up-input" v-model="upLoadName"></el-input>
                    <el-button type="primary" class="btn btn-primary primary—btn">选择</el-button>
                    <input type="file" @change="getFile($event)" class="file" ref="clearfile"/>
                    <!-- <el-upload
                      class="ensure ensureButt up-button"
                      ref="upload"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :on-change="handleChange"
                      :file-list="fileList"
                      :show-file-list="false"
                      :auto-upload="false">
                      <el-button slot="trigger" size="small" type="primary">选择</el-button>
                      </el-upload> -->
                  </el-form-item>
                </el-form>
                <p style=" margin:0 0 0 90px; font-size:12px;">请先下载 <a :href="mmscUrl+'/static/template/TestGroupTemplate.xlsx'">测试用户导入模版</a></p>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addUpload('form')" class="btn btn-primary primary—btn">上传</el-button>
                    <el-button @click="open = false" class="btn btn-primary btn-white primary—btn">取 消</el-button>
                  </div>
              </el-dialog>
              <el-dialog title="手动添加" :visible.sync="dialogFormVisible" class="align-left">
                <el-form ref="handaddform" :model="handaddform" :rules="rules" label-width="100px" class="align-left">
                  <el-form-item label="添加类型">
                    <el-radio-group v-model="handaddform.radio">
                      <el-radio label="0">用户ID</el-radio>
                      <el-radio label="1">手机号码</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="添加测试号" prop="desc">
                    <el-input type="textarea" v-model="handaddform.desc" placeholder="请输入测试号"></el-input>
                  </el-form-item>
                  <div label="" style="margin:0 0 0 99px;">
                    <span class="tip" style="color:#bbb;">(只支持 "，"进行分隔)</span>
                  </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="handAdd('handaddform')" class="btn btn-primary primary—btn">确 定</el-button>
                <el-button @click="dialogFormVisible = false" class="btn btn-primary btn-white primary—btn">取 消</el-button>
              </div>
            </el-dialog>
            </div>
        </div>
      </div>
    </div>
    <div class="m_jj" style="margin:10px 0 10px 0;">
      <el-button type="text" class="btn btn-primary" @click="open = true" v-if="authorizedData.mms_group_import_testedit">批量导入</el-button>
      <el-button type="text" class="btn btn-primary" @click="dialogFormVisible = true" v-if="authorizedData.mms_group_hand_testedit">手动添加</el-button>
      <el-button type="text" class="btn btn-primary" @click="backBtn">返回</el-button>
    </div>
    <div class="user-table">
      <table class="table dataTable table-striped no-margin">
          <thead>
            <tr role="row">
              <th>用户ID</th>
              <th>手机号码</th>
              <th>添加时间</th>
              <th>来源</th>
              <th>操作人</th>
              <th>操作</th>
            </tr>
          </thead>
          <!-- <tbody v-if="isFirst">
            <tr>
              <td class="text-center" colspan="7">
                由于数据过多，请先输入过滤条件后点击“搜索”按钮
              </td>
            </tr>
          </tbody> -->
          <tbody v-if="editgroupdata.list">
          <tr v-for="(item, index) in editgroupdata.list" :key="index">
            <td>{{item.userId}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.createDate | time}}</td>
            <td>{{item.source | source}}</td>
            <td>{{item.createUser}}</td>
            <td>
              <a class="delBtn" @click="delBoxBtn(index, item.id)" v-if="authorizedData.mms_group_del_testedit">删除</a>
            </td>
          </tr>
          </tbody>
          <tbody v-if="!editgroupdata.list">
            <tr class="bgf">
              <td class="text-center no-search" colspan="7">没有搜索到相关结果！</td>
            </tr>
        </tbody>
        </table>
        <pager :total="total" :pages="pages" :pageNum="searchData.pageNum" :pageSize="searchData.pageSize" v-on:pageinfo="pageinfo"></pager>
        <div class="result" v-if="!isFirst && editgroupdata.list">
        共为您找到<i>{{total}}</i>条结果。<a @click="getManaggeAll">返回查看全部</a>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { getEditManageList, editSaveHandTestGroupUser, deleteTestGroupUser, userpageAuthorized } from 'api/serviceuser'
import pager from 'common/pager'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      mmscUrl: mmsDomain.mmsc,
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      getGroupmanageId: '', // 接收id
      editgroupdata: {}, // 编辑测试列表数据
      isFirst: true,
      pages: '',
      total: '',
      searchData: {
        name: '',
        id: '',
        pageNum: '1',
        pageSize: '10'
      },
      copySearchData: {
        name: '',
        id: '',
        pageNum: '1',
        pageSize: '10'
      },
      dialogFormVisible: false, // 手动添加
      open: false, // 批量添加
      handaddform: { // 手动添加弹框表单内容
        radio: '0',
        desc: ''
      },
      formLabelWidth: '120px',
      currentPage: 4,
      rules: { // input输入框验证
        desc: [
          { required: true, message: '请输入测试号', trigger: 'blur' }
        ]
      },
      /** 上传参数 */
      upLoadName: '',
      upath: '',
      file: '',
      fileList: []
    }
  },
  components: {
    'pager': pager
  },
  computed: {
    ...mapGetters([
      'GroupmanageId'
    ])
  },
  created: function () {
    this.searchData.id = this.GroupmanageId ? this.GroupmanageId : ''
    this.copySearchData.id = this.GroupmanageId ? this.GroupmanageId : ''
  },
  mounted: function () {
    var _this = this
    userpageAuthorized({
      code: 'mms_test_user_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_test_user_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
          if (_this.authorizedPage) {
            _this.editmanage(_this.searchData)
          }
        } else {
          // 跳转到REM首页
          window.location.href(mmsDomain.ermHome)
        }
      }
    })
  },
  filters: { // 过滤器
    source: function (val) {
      if (val === 0) {
        return '批量'
      } else if (val === 1) {
        return '手动'
      } else if (val === 2) {
        return '自动'
      }
    }
  },
  methods: {
    backBtn: function () {
      this.$router.push('/groupmanage')
    },
    getManaggeAll: function () {
      this.editmanage({
        name: '',
        id: this.GroupmanageId,
        pageNum: '1',
        pageSize: this.searchData.pageSize
      })
      // Object.assign(this.$data, this.$options.data())
      // 搜索数据重置
      this.searchData.name = ''
      this.searchData.pageNum = '1'
      this.searchData.pageSize = '10'
      // 搜索数据重置
      this.copySearchData.name = ''
      this.copySearchData.pageNum = '1'
      this.copySearchData.pageSize = '10'
    },
    delBoxBtn (index, id) { // 删除按钮
      let _this = this
      _this.$confirm('确定将该用户删除吗？?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestGroupUser({
          'id': id
        }, (data) => {
          if (data.success === true) {
            _this.$message({
              message: '该测试群组用户删除成功',
              type: 'success'
            })
            _this.editgroupdata.list.splice(index, 1)
            _this.editmanage(_this.copySearchData)
          } else {
            _this.$message({
              message: '该测试群组用户正在使用中，无法删除。',
              type: 'warning'
            })
          }
        })
      }).catch(() => {})
    },
    managgeSearch () { // 搜索按钮
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.searchData.pageNum = 1
      this.editmanage(this.copySearchData)
    },
    editmanage: function (data) {
      var _this = this
      getEditManageList(data, (data) => {
        if (data.success === true) {
          _this.isFirst = false
          _this.editgroupdata = data.data
          _this.pages = data.data.pages
          _this.total = data.data.total
          _this.searchData.pageNum = data.data.pageNum
          _this.searchData.pageSize = data.data.pageSize
        } else {
        }
      })
    },
    pageinfo: function (data) {
      this.copySearchData.pageNum = data.pageindex
      this.searchData = this.copySearchData
      this.copySearchData = JSON.parse(JSON.stringify(this.searchData))
      this.editmanage(this.copySearchData)
    },
    handAdd: function (formName) { // 手动添加
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          editSaveHandTestGroupUser({
            'id': _this.searchData.id,
            'type': _this.handaddform.radio,
            'content': _this.handaddform.desc
          }, (data) => {
            if (data.success === true) {
              _this.dialogFormVisible = false
              _this.$refs[formName].resetFields()
              _this.editmanage(this.copySearchData)
              _this.$message({
                message: '测试用户添加成功',
                type: 'success'
              })
            } else {
              if (data.code === 109) {
                _this.$message({
                  message: '没有有效记录',
                  type: 'warning'
                })
              } else {
                _this.$message({
                  message: '测试用户添加失败，请重试',
                  type: 'warning'
                })
              }
            }
          })
        }
      })
    },
    addUpload: function (formName) { // 上传按钮
      let _this = this
      // this.searchData.id 用户群组id
      // _this.$refs.upload.submit()
      var zipFormData = new FormData()
      zipFormData.append('id', _this.copySearchData.id)
      zipFormData.append('file', _this.file)
      // let config = { headers: { 'Content-Type': 'multipart/form-data' } }
      // saveImportTestGroupUser({
      //   zipFormData,
      //   config
      // }, (data) => {
      //   if (data.data.success === true) {
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
      this.$http.post(mmsDomain.mms + '/testGroup/saveImportTestGroupUser.do', zipFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.body.success === true) {
          _this.open = false
          _this.editmanage(this.copySearchData)
          _this.$message({
            message: '导入成功',
            type: 'success'
          })
          _this.open = false
          _this.$refs[formName].resetFields()
          _this.upLoadName = ''
          _this.file = ''
          _this.$refs.clearfile.value = ''
        } else {
          if (res.body.code === 109) {
            _this.$message({
              message: '没有有效记录！',
              type: 'warning'
            })
          } else {
            _this.$message({
              message: '导入失败',
              type: 'warning'
            })
          }
        }
      }, res => {
        console.log('获取失败！')
      })
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
      const isLt2M = (file.size) / 1024 / 1024 < 100
      if (!extension && !extension2) {
        _this.$message({
          type: 'info',
          message: '上传模板只能是 xls、xlsx 格式!'
        })
        return false
      } else if (!isLt2M) {
        _this.$message({
          type: 'info',
          message: '上传模板大小不能超过 100MB!'
        })
        return false
      } else {
        _this.upLoadName = file.name
      }
      return (extension || extension2) && isLt2M
    }
  }
}
</script>

<style src="assets/css/usercommon.styl" lang="stylus"></style>
<style>
.usergroupedit .el-input {width: 60%; margin-right:5px;}
.usergroupedit .result{ margin-top: 20px;}
.usergroupedit .file { display: inline-block;  margin-left: -68px; opacity: 0; width: 72px;}
.mt10{ margin-top: 10px;}
.mb10{ margin-bottom: 10px;}
.usergroupedit .delBtn{ cursor: pointer}
</style>

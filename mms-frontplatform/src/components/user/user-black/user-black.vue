<template>
  <div class="userblack">
    <!-- <div>{{fileName}}</div> -->
    <div class="widget-box clearfix">
        <div class="widget-header n-widget-header">
            <h5 class="widget-title">检索条件</h5>
        </div>
      <div class="widget-main clearfix">
        <el-form label-width="150px">
          <el-form-item label="用户ID/手机号">
            <el-input :style="'width:200px'" name="id" value="" v-model="searchData.name" placeholder="请输入用户ID或手机号"></el-input>
             <el-button type="primary" class="primary—btn btn btn-primary ml5" @click="managgeSearch" v-if="authorizedData.mms_group_search_userblack">搜索</el-button>
          </el-form-item>
        </el-form>
          <el-dialog
            title="批量导入"
            :visible.sync="open"
            width="600px"
            class="align-left">
              <el-form ref="form" label-width="90px" class="align-left">
                <el-form-item label="导入文件:" v-show="open" class="add-file" enctype="multipart/form-data" ref="up">
                  <el-input disabled class="up-input" v-model="upLoadName"></el-input>
                  <el-button type="primary" class="btn btn-primary primary—btn">选择</el-button>
                  <input type="file" @change="getFile($event)" class="file" />
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
              <p style=" margin:0 0 0 89px; font-size:12px;">请先下载 <a :href="mmscUrl+'/static/template/TestGroupTemplate.xlsx'">测试黑名单导入模版</a></p>
              <div slot="footer" class="dialog-footer margin-top20">
                <el-button type="primary" class="btn btn-primary primary—btn"  @click="batchupload('upload')">上传</el-button>
                <el-button  class="btn btn-primary btn-white primary—btn"  @click="delUpload('upload')">取 消</el-button>
              </div>
          </el-dialog>
          <el-dialog title="手动添加" width="600px" :visible.sync="dialogFormVisible" class="align-left">
            <el-form ref="handaddlayer" :model="handaddlayer" :rules="rules" label-width="120px" class="align-left">
              <el-form-item label="添加类型">
                <el-radio-group v-model="handaddlayer.type">
                  <el-radio label="0">用户ID</el-radio>
                  <el-radio label="1">手机号码</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="添加黑名单" prop="content">
                <el-input type="textarea" v-model="handaddlayer.content" placeholder="输入黑名单"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" class="btn btn-primary primary—btn" @click="handadd('handaddlayer')">确 定</el-button>
            <el-button  class="btn btn-primary btn-white primary—btn" @click="celhandadd('handaddlayer')">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div>
    <div class="m_jj" style="margin:10px 0 10px 0">
      <el-button type="text" class="btn btn-primary"  @click="open = true" v-if="authorizedData.mms_group_import_userblack">批量导入</el-button>
      <el-button type="text" class="btn btn-primary" @click="dialogFormVisible = true" v-if="authorizedData.mms_group_hand_userblack">手动添加</el-button>
    </div>
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
          <tbody v-if="showfirst">
            <tr class="bgf">
              <td class="text-center no-search" colspan="7">由于数据过多，请先输入过滤条件后点击“搜索”按钮</td>
            </tr>
          </tbody>
          <tbody v-if="isFirst && userblackdata.list">
          <tr v-for="(item, index) in userblackdata.list" :key="item.id">
            <td>{{item.userId}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.createDate | time}}</td>
            <td>{{item.source | source}}</td>
            <td>{{item.createUser}}</td>
            <td class="result">
              <a  @click="delBoxBtn(index, item.id)" v-if="authorizedData.mms_group_del_userblack">删除</a>
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
        <div class="result" v-if="!isFirst && userblackdata.list">
        共为您找到<i>{{total}}</i>条结果。<a @click="getManaggeAll">返回查看全部</a>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mmsDomain } from 'api/config'
import { userblackList, deleteuserblackList, handaddblackList, userpageAuthorized } from 'api/serviceuser'
import pager from 'common/pager'
export default {
  data () {
    return {
      mmscUrl: mmsDomain.mmsc,
      authorizedPage: false, // 页面权限控制
      authorizedData: {}, // 按钮权限控制
      userblackdata: {},
      showfirst: true,
      isFirst: true,
      listState: false,
      pages: '',
      total: '',
      searchData: { // 搜索
        name: '',
        pageNum: '1',
        pageSize: '10'
      },
      copySearchData: { // 搜索
        name: '',
        pageNum: '1',
        pageSize: '10'
      },
      dialogFormVisible: false, // 手动添加
      open: false, // 批量添加
      handaddlayer: { // 手动添加弹框表单内容
        type: '0',
        content: ''
      },
      fileName: '', // 批量上传参数
      formLabelWidth: '120px',
      importFileUrl: '//10.144.36.12:8081/api/usergroupmanagedata?122',
      upLoadData: {
        cpyId: '123456',
        occurTime: '2017-08'
      },
      rules: { // input输入框验证
        content: [
          { required: true, message: '请先添加黑名单', trigger: 'blur' }
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
  created: function () {
    var _this = this
    userpageAuthorized({
      code: 'mms_black_user_mngr'
    }, function (data) {
      if (data.success) {
        if (data.data.isLogin) {
          _this.authorizedPage = data.data.authorize.mms_black_user_mngr
          _this.authorizedData = data.data.authorize ? data.data.authorize : {}
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
    getManaggeAll: function () {
      this.userblack({
        name: '',
        pageNum: '1',
        pageSize: this.searchData.pageSize
      })
      // Object.assign(this.$data, this.$options.data())
      this.searchData.name = ''
      this.searchData.pageNum = '1'
      this.searchData.pageSize = '10'
      this.copySearchData.name = ''
      this.copySearchData.pageNum = '1'
      this.copySearchData.pageSize = '10'
    },
    dellist: function (index, id) { // 删除
      var _this = this
      deleteuserblackList({ 'id': id }, (data) => {
        if (data.success === true) {
          _this.$message({
            message: '删除成功',
            type: 'success'
          })
          _this.userblackdata.list.splice(index, 1)
        } else {
          _this.$message({
            message: '该黑名单正在使用中，无法删除。',
            type: 'warning'
          })
        }
      })
    },
    delBoxBtn (index, id) { // 删除按钮
      this.$confirm('确定将该黑名单用户移出吗？?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dellist(index, id) // 调用删除
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    managgeSearch () { // 搜索按钮
      this.userblack(this.searchData)
    },
    userblack: function (Sdata) {
      var _this = this
      // if (_this.searchData.name === '') {
      //   _this.$message({
      //     message: '搜索条件不能为空',
      //     type: 'warning'
      //   })
      // } else {
      _this.copySearchData = JSON.parse(JSON.stringify(_this.searchData))
      _this.searchData.pageNum = 1
      _this.blackList(Sdata)
      // }
    },
    blackList: function (Sdata) {
      var _this = this
      userblackList(Sdata, (data) => {
        if (data.success) {
          if (data.data.list.length > 0) {
            _this.isFirst = true
            _this.showfirst = false
            _this.listState = false
            _this.userblackdata = data.data
            _this.pages = data.data.pages
            _this.total = data.data.total
            _this.searchData.pageNum = data.data.pageNum
            _this.searchData.pageSize = data.data.pageSize
          } else {
            _this.isFirst = false
            _this.showfirst = false
            _this.listState = true
          }
        }
      })
    },
    pageInit: function (data) {
      var _this = this
      _this.copySearchData.pageNum = data.pageindex
      _this.copySearchData.pageSize = data.pagecount
      _this.searchData = _this.copySearchData
      _this.copySearchData = JSON.parse(JSON.stringify(_this.searchData))
      _this.blackList(_this.copySearchData)
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
    delUpload (formName) { // 导入取消按钮
      this.open = false
      // this.$refs[formName].clearFiles()
    },
    uploadchange (file, fileList) { // 点击上传时验证文件类型以及大小
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt5M = (file.size) / 1024 / 1024 < 100
      if (!extension && !extension2) {
        this.$refs.upload.clearFiles()
        this.$message({
          type: 'info',
          message: '上传模板只能是 xls、xlsx 格式!请重新选择'
        })
        return false
      } else if (!isLt5M) {
        this.$message({
          type: 'info',
          message: '上传模板大小不能超过 100MB!'
        })
        return false
      } else {
        this.fileName = file.name
      }
      return (extension || extension2) && isLt5M
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      this.fileName = response.name
    },
    // 上传错误
    uploadError (response, file, fileList) {
      this.$message({
        type: 'info',
        message: '上传失败，请重试！'
      })
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (response, file, fileList) {
    },
    batchupload (formName) { // 批量导入
      let _this = this
      // this.searchData.id 用户群组id
      var zipFormData = new FormData()
      zipFormData.append('id', '3801')
      zipFormData.append('file', _this.file)
      // let config = { headers: { 'Content-Type': 'multipart/form-data' } }
      // batchuploadList({
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
      this.$http.post(mmsDomain.mms + '/blackUser/saveImportBlackUser.do', zipFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.body.success === true) {
          _this.open = false
          _this.$message({
            message: '导入成功',
            type: 'success'
          })
          _this.blackList(_this.copySearchData)
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
    handadd: function (formName) { // 手动添加
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handaddblackList({'type': this.handaddlayer.type, 'content': this.handaddlayer.content}, (data) => {
            if (data.success === true) {
              this.dialogFormVisible = false
              this.$refs[formName].resetFields()
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.blackList(this.copySearchData)
            } else {
              if (data.code === 109) {
                this.$message({
                  type: 'warning',
                  message: '没有有效记录'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: '添加失败'
                })
              }
            }
          })
        }
      })
    },
    celhandadd: function (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style src="assets/css/usercommon.styl" lang="stylus">
</style>
<style>
.userblack .up-input{ width:60%;}
.userblack .result{ margin-top: 20px; }
.userblack .form-control{ padding: 0 0 0 5px !important; color: #333;}
.userblack .file { display: inline-block;  margin-left: -68px; opacity: 0; width: 72px;}
.ml5{ margin-left: 5px;}
</style>

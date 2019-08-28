<template>
<div class="mainBox">
  <div class="queryHeader">
    <span style="margin-left:15px">美豆记录</span>
    <el-button  @click='goBack'  size='mini' class="goBack">返回</el-button>
 </div>
<div class="mainContent clearfix">
      <div class="mainHead" style="font-size:14px">当前美豆总数：<span style="color:#F56C6C">{{gomedoQuantity}}</span>
      </div>
      <div class="table-block">
              <el-table  style="width: 100%"  :data="gomedoHstList" border >
                 <el-table-column   prop="gomedo"  label="数量"  min-width="33%" align="center"></el-table-column>
                  <el-table-column  prop="createTime"  label="时间"   min-width="33%" align="center">  </el-table-column>
                  <el-table-column  prop="source"  label="来源"  min-width="34%" align="center"></el-table-column>
                </el-table>
        </div>
              <pager  :total="total"  :pageNum="pageNum"  :pageSize="pageSize"  v-on:pageinfo="pageInit" ></pager>
</div>
</div>
</template>
<script>
import pager from '../member_common/pager'
import API from '@/api/api_resume/memberBeanRecord'
export default {
  data(){
      return {
        gomedoHstList:[],
        gomedoQuantity:0,
        total:0,//总条数
        pageNum:1,//当前页
        pageSize:20,//pageSize每页条数
        uid:this.$route.params.memberId
      }
  },
  created(){
    this.getQueryResume();
  },
  deactivated() {
   this.$destroy()
  },
  components:{
    pager
  },
  methods:{
      getQueryResume(){
        var _this=this;
          API.queryResume({
              uid:_this.uid,
              pageNum:_this.pageNum,
              size:_this.pageSize
          }).then(function(data){
              if(data.success==true){
                    if(data.data.gomedoHstList){
                          _this.gomedoHstList=data.data.gomedoHstList;
                          _this.pageNum=data.data.currPageNum;
                          _this.total=data.data.totalRecord;
                          _this.gomedoQuantity=data.data.gomedoQuantity
                    }else{
                      _this.gomedoHstList=[];
                      _this.pageNum=1;
                      _this.total=0;
                      _this.$message({
                                 message: '暂无美豆记录',
                                 type: 'warning',
                                 center:true
                      })
                    }
              }else{
                _this.$message({
                           message: data.errMsg,
                           type: 'warning',
                           center:true
                })
              }
          }).catch(function(data){
              _this.$message.error(data.errMsg);
          })
      },
      pageInit: function (data) {
          this.pageNum = data.pageNum;
          this.getQueryResume();
      },
      goBack: function () {
          this.$router.go(-1);
      }
  }
}
</script>
<style>
.queryHeader {width: 100%;line-height: 36px;background: #409EFF;height: 36px;color: #fff;font-size: 14px;  font-weight: bold;  position: relative;}
.goBack{position: absolute;  top: 4px;  right: 20px;cursor: pointer;}
.mainBox{border:1px solid #E4E7ED }
.mainContent{padding: 20px;}
.mainHead{height: 35px;  line-height: 35px; color: #303133;font-size: 13px;font-weight: 500;margin-bottom: 25px;}
thead.has-gutter th{background:#eef6ff;padding:8px;}
.el-table__body td{ padding:5px 0;font-size:12px;}
</style>

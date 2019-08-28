<template>
      <div class="mainBox">
            <div class="queryHeader">
              <span style="margin-left:15px">会员优惠券记录</span>
              <el-button  @click='goBack'  size='mini'  class="goBack">返回</el-button>
           </div>
           <div class="mainContent clearfix">
                    <div class="mainHead">
                        <span style="font-size:14px">优惠券状态：</span>
                        <el-select  v-model="couponStateCode"  placeholder="全部" style="margin-left:30px" @change="getCouponStateCode" size='mini' >
                                <el-option  v-for="item in queryCouponStateList" :key="item.couponStateCode"  :label="item.couponStateName"  :value="item.couponStateCode" ></el-option>
                        </el-select>
                    </div>
                    <div class="table-block">
                            <el-table  style="width: 100%"  :data="queryCouponlist" border>
                               <el-table-column   prop="invoiceValue"  label="优惠券面值"  min-width="26%" align="center"></el-table-column>
                                <el-table-column  prop="state"  label="状态"   min-width="24%" align="center">  </el-table-column>
                                <el-table-column  prop="useRule"  label="规则"  min-width="24%" align="center"></el-table-column>
                                <el-table-column  prop="expireTime"  label="过期时间"  min-width="26%" align="center">  </el-table-column>
                              </el-table>
                      </div>
                    <pager   :total="total"  :pageNum="pageNum"  :pageSize="pageSize"  v-on:pageinfo="pageInit"></pager>
          </div>
    </div>
</template>
<script>
import API from '@/api/api_resume/memberVoucherRecord'
import pager from '../member_common/pager'
import { mapState } from 'vuex'
export default {
        data () {
            return {
              queryCouponStateList: [],//优惠券状态列表
              couponStateCode:'',
               total:0,//总条数
               pageNum:1,//当前页
               pageSize:20,//pageSize每页条数
               queryCouponlist: [],//优惠券列表
               memberId:this.$route.params.memberId,
               couponState:"-1"//优惠券状态
          }
      },
      created(){
            this.getCouponStateList();
            this.getCouponList();
      },
      deactivated() {
       this.$destroy()
      },
      components: {  pager  },
      methods:{
          getCouponStateList(){
              var _this=this;
              API.queryCouponStateList().then(function(data){
                if(data.success==true ){
                        if(data.response){
                          _this.queryCouponStateList=data.response;
                        }
                }else{
                    _this.$message({
                               message: data.respMsg,
                               type: 'warning',
                               center:true
                    })
                }
              }).catch(function(data){
                    _this.$message.error(data.respMsg);
              })
          },
          getCouponList(){
              var _this=this;
              API.queryCouponList({
                memberId:_this.memberId,
                couponState:_this.couponState,
                currentPage:_this.pageNum,
                pageSize:_this.pageSize
              }).then(function(data){
                    if( data.success==true){
                                if(data.response){
                                    _this.queryCouponlist=data.response.list;
                                    _this.total=data.response.pager.totalSize;
                                    _this.pageNum=data.response.pager.currentPage;
                                }else{
                                  _this.queryCouponlist=[];
                                  _this.pageNum=1;
                                  _this.total=0;
                                  _this.$message({
                                             message: '暂无优惠券信息',
                                             type: 'warning',
                                             center:true
                                  })
                                }
                    }else{
                      _this.$message({
                                 message: data.respMsg,
                                type: 'warning',
                                 center:true
                      })
                    }
              }).catch(function(data){
                    _this.$message.error(data.respMsg);
              })
          },
          goBack: function () {
                this.$router.go(-1)
          },
          getCouponStateCode(val){
                this.couponState=val;
                this.pageNum=1;
                this.getCouponList();
          },
          pageInit(data){
            this.pageNum=data.pageNum;
            this.getCouponList();
          }
      }

}
</script>

<style>
.queryHeader {width: 100%;line-height: 36px;background: #409EFF;height: 36px;color: #fff;font-size: 14px;  font-weight: bold;  position: relative;}
.goBack{position: absolute;  top: 4px;  right: 20px;cursor: pointer;}
.el-icon-d-arrow-right{position: absolute;top:4px;right:20px;cursor:pointer;}
.mainBox{border:1px solid #E4E7ED }
.mainContent{padding: 20px;}
.mainHead{height: 35px;  line-height: 35px; color: #303133;font-size: 14px;font-weight: 500;margin-bottom: 25px;}
.mainHead span{font-size:14px;}
thead.has-gutter th{background:#eef6ff;padding:8px;}
.el-table__body td{ padding:5px 0;font-size:12px;}
</style>

<template>
<div class="mainBox">
    <div class="queryHeader">
              <span style="margin-left:15px">会员订单记录</span>
              <el-button  @click='goBack'  size='mini' class='goBack'>返回</el-button>
   </div>
    <div class="mainContent clearfix">
        <div class="mainHead">
            <span style="font-size:14px">订单状态：</span>
            <el-select  v-model="orderStateCode" placeholder="全部" style="margin-left:30px" @change="getOrderStateCode" size="mini"  >
                    <el-option  v-for="item in queryOrderStateList" :key="item.orderStateCode"  :label="item.orderStateName"  :value="item.orderStateCode"  ></el-option>
            </el-select>
        </div>
        <div class="table-block">
                <el-table  style="width: 100%" border  :data="queryMemberOrderList" >
                   <el-table-column   prop="orderId"  label="订单号"  min-width="26%"  align="center">
                     <template slot-scope="scope">
                          <el-button  type="text" size="small" @click="clickOrderId(scope.row.orderId,scope.row.separateBillFlag,scope.row.storeCode)">{{scope.row.orderId}}</el-button>
                    </template>
                   </el-table-column>
                    <el-table-column  prop="state"  label="状态"   min-width="24%" align="center">  </el-table-column>
                    <el-table-column  prop="amount"  label="订单金额"  min-width="24%" align="center"></el-table-column>
                    <el-table-column  prop="orderTime"  label="订单时间"  min-width="26%" align="center">  </el-table-column>
                  </el-table>
        </div>
        <pager  :total="total"  :pageNum="pageNum"  :pageSize="pageSize"  v-on:pageinfo="pageInit" ></pager>
      </div>
  </div>
</template>
<script>
import API from '@/api/api_resume/memberOrderRecord'
import pager from '../member_common/pager'
import { mapState } from 'vuex'
import Env from '@/api/env'
export default {
    data(){
      return {
        queryOrderStateList:[
          {"orderStateCode":"0","orderStateName":"全部"},
          {"orderStateCode":"1","orderStateName":"未支付"},
          {"orderStateCode":"2","orderStateName":"已支付"}
        ],
        orderStateCode:'',//优惠券状态
        queryMemberOrderList:[],
        total:0,//总条数
        pageNum:1,//当前页
        pageSize:20,//pageSize每页条数
        orderState:0,//订单状态
        memberId:this.$route.params.memberId
      }
    },
    created(){
        this.getMemberOrderList();
    },
    deactivated() {
 this.$destroy()
},
    components:{ pager },
    methods:{
        getMemberOrderList(){
            var _this=this;
            API.queryMemberOrderList({
                memberId:_this.memberId,
                orderState:_this.orderState,
                currentPage:_this.pageNum,
                pageSize:_this.pageSize
            }).then(data=>{
                    if(data.success == true ){
                        if(data.response){
                            _this.queryMemberOrderList=data.response.list;
                            _this.total=data.response.pager.totalSize;
                            _this.pageNum=data.response.pager.currentPage;
                        }else{

                        _this.queryMemberOrderList=[];
                        _this.pageNum=1;
                        _this.total=0;
                          _this.$message({
                                     message: '暂无订单信息',
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
            }).catch(data=>{
                  _this.$message.error(data.respMsg);
            })
        },
        goBack: function () {
              this.$router.go(-1)
            },
        getOrderStateCode(val){
            this.orderState=val;
            this.pageNum=1;
            this.getMemberOrderList();
        },
        pageInit(data){
          this.pageNum=data.pageNum;
          this.getMemberOrderList();
        },
        clickOrderId(orderId,separateBillFlag,storeCode){
            if(separateBillFlag==0){
                window.open(window.location.origin + '/order/orderdetails?orderId='+orderId+'&storeCode='+storeCode)
            }else if(separateBillFlag==1){
                window.open(window.location.origin + '/order/orderdetailsbeforesplit?orderId='+orderId+'&storeCode='+storeCode)
            }else{
                this.$message({
                           message: '订单异常',
                           type: 'warning',
                           center:true
                })
            }
        }
    }
}
</script>
<style>
.queryHeader {width: 100%;line-height: 36px;background: #409EFF;height: 36px;color: #fff;font-size: 14px;  font-weight: bold;  position: relative;}
.goBack{position: absolute;  top: 4px;  right: 20px;cursor: pointer;}
.mainBox{border:1px solid #E4E7ED }
.mainContent{padding: 20px;}
.mainHead{height: 35px;color: #303133;font:500 14px/35px;margin-bottom: 25px;}
thead.has-gutter th{background:#eef6ff;padding:8px;}
.el-table__body td{ padding:5px 0;font-size:12px;}
.table-block a{text-decoration: underline;color: #409EFF}
</style>

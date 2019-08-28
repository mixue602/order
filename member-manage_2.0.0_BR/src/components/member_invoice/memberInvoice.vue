<template>
<div class="mainBox">
    <div class="queryHeader">
      <span style="margin-left:15px">发票管理</span>
   </div>
    <div class="mainContent clearfix">
      <div class="mainHead">
        <div class="queryInvoice"><span style="font-size:14px">  订单号：</span>  <el-input   placeholder="请输入订单号"   v-model="orderNum"  size="mini" style="width:70%"  ></el-input></div>
          <el-button  @click="searchNum()"  style="margin-left:15px" type="primary"   size="mini" v-if="LOGINDATA.membermanage_memberInvoice_search">查询</el-button>
        </div>
        <div class="invoiceContent">
          <div class="invoiceList" v-show="orderShow"  v-for="(item,index) in queryInvoiceList"  :orderId='item.orderId'   :class="item.state==6?'grayBg':'' " >
            <div class="invoiceNum"><span>发票号:{{item.invoiceNum}}</span>
              <el-button type="danger" style="margin-left:10px" disabled v-if="item.state==6" size="mini">已冲红</el-button>
            </div>
            <div class="invoiceBox">
                  <el-row class="invoiceRow">
                    <el-col :span="5" v-if='item.invoiceHeadType=="0"'> 发票抬头：个人</el-col>
                    <el-col :span="5" v-else>发票抬头：公司</el-col>
                    <el-col :span="8" class='clearfix'><span class='fl '>抬头内容：</span><a href='javascript:;' :title="item.invoiceHead" class="txtOverflow fl "> {{item.invoiceHead}}</a></el-col>
                    <el-col :span="6"  v-if='item.invoiceHeadType=="1"' class='clearfix'> <span class='fl '>识别号:</span> <a href='javascript:;' :title='item.taxpayerNo' class="txtOverflow fl ">{{item.taxpayerNo}}</a></el-col>
                    <el-col :span="6" v-else>识别号： ----------</el-col>
                    <el-col :span="4">  开票时间：{{item.issueInvoiceTime}}</el-col>
                  </el-row>
                  <el-row class="invoiceRow">
                    <el-col :span="5"> 用户手机：  {{item.elecMobile}}</el-col>
                    <el-col  :span="8" class="clearfix"><span class="fl">用户邮箱：</span>
                        <div class='fl' style="width:80%;">
                            <a  v-if="item.emailSpanShow=='true'" class="txtOverflow" :title='item.elecMail'  href='javascript:;' style="width:100%;"> {{item.elecMail}}</a>
                            <el-input  v-model="item.elecMail" v-else  size='mini' style="width:100%;"  maxLength='40'></el-input>
                        </div>
                    </el-col>
                    <el-col :span="6"  v-show="item.state==6 && item.elecinvoiceUrl"> <a :href="item.elecinvoiceUrl" v-if="item.elecinvoiceUrl" style="margin-left:10px;color:#409EFF" target="_blank">发票预览</a></el-col>
                    <el-col :span="6"  v-show='item.state==2?true:false'>
                          <div v-show="item.send==0">
                              <el-button type="text" class="btnText"  @click="editEmail(index,item.elecMail)" >编辑邮箱</el-button>
                              <el-button type="text" @click="sendEmail(index,item.elecMail,item.orderId,item.shippingGroupId,item.invoiceNum)" v-if="LOGINDATA.membermanage_memberInvoice_send">重新发送</el-button>
                              <a :href="item.elecinvoiceUrl" v-if="item.elecinvoiceUrl" style="margin-left:10px;color:#409EFF" target="_blank">发票预览</a>
                        </div>
                        <div v-show="item.send==1">
                          <el-button type="text" class="btnText"  @click="confirmEmail(index,item.orderId,item.shippingGroupId,item.invoiceId,item.elecMail )" v-if="LOGINDATA.membermanage_memberInvoice_confirm">确认</el-button>
                          <el-button type="text" @click="cancelEmail(index)">取消</el-button>
                        </div>
                    </el-col>
                  </el-row>
              </div>
          </div>
        </div>
        <pager  :total="total"  :pageNum="pageNum"  :pageSize="pageSize"  v-on:pageinfo="pageInit" ></pager>
    </div>
    <div v-show="!orderShow" class="noSearchOrder">
          请输入订单ID查询发票信息
    </div>
</div>
</template>
<script>
import API from '@/api/api_invoice/memberInvoice'
import pager from '../member_common/pager'
import { mapState } from 'vuex'
export default {
    data(){
      return {
              initheader:{ //
                  "showclose":"",  //右面的关闭
                  "content":"发票管理"
              },
              orderNum:null,
              orderShow:false,
              queryInvoiceList:[],
              pageNum:1,
              pageSize:4,
              total:0,
              eEmail:''
      }
    },
    computed:mapState({
      LOGINDATA:"LOGINDATA"
    }),
    components:{
      pager
    },
    methods:{
        searchNum(){
            var _this=this;
            var val=_this.orderNum.trim();
                if(val==''){
                   _this.$message({
                              message: '请输入订单号查询',
                               type: 'warning',
                              center:true
                   });
                   return ;
               }
                if(!_this.getOrderValue(val)){
                        _this.$message({
                                   message: '请输入正确的订单号',
                                    type: 'warning',
                                   center:true
                        });
                        return;
                  }
                  _this.pageNum=1;
                  _this.getQueryInvoiceList();
        },
        getQueryInvoiceList(){
            var _this=this;
              API.queryInvoiceList({
                  orderId:_this.orderNum,//订单ID
                  currentPage:_this.pageNum,//当前页
                  pageSize:_this.pageSize//每页显示条数
              }).then(data=>{
                  if(data.success==true){
                        if(data.response){
                            _this.orderShow=true;
                            var response=data.response;
                            for(var i=0;i<response.list.length;i++){
                                response.list[i].emailSpanShow="true";
                                response.list[i].send=0;
                            }
                            _this.queryInvoiceList=response.list;
                            _this.pageNum=response.pager.currentPage;
                            _this.total=response.pager.totalSize;
                          }else{
                              _this.queryInvoiceList=[];
                              _this.pageNum=1;
                              _this.total=0;
                              _this.$message({
                                         message: '暂无发票信息',
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
                    _this.$message.error(data.errMsg);
              })
        },
        getOrderValue(value){
          var  reg= /^\d+$/;
            return   reg.test(value)
        },
        editEmail(index,email){
              this.eEmail=email;
              this.queryInvoiceList[index].emailSpanShow="false";
              this.queryInvoiceList[index].send=1;
        },
       regEmail(value){
          	// var reg=new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,})+$');
              // var reg=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
              var reg=new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$')
              return !reg.test(value)
        },
        cancelEmail(index){
          this.queryInvoiceList[index].send=0;
          this.queryInvoiceList[index].emailSpanShow="true";
          this.queryInvoiceList[index].elecMail=this.eEmail;
        },
        confirmEmail(index,orderId,shippingGroupId,invoiceId,elecMail){
            var _this=this;
                  if(elecMail==' '||elecMail==null){
                     _this.$message({
                                message: '请输入邮箱号',
                                type: 'warning',
                                center:true
                     });
                     return ;
                 }
                 var elecMail=elecMail.trim();
                  if(_this.regEmail(elecMail)){
                          _this.$message({
                                     message: '请输入正确的邮箱号',
                                     type: 'warning',
                                     center:true
                          });
                          return;
                    }

                  if(elecMail.length>40){
                      _this.$message({
                                 message: '邮箱最多允许输入40个字符',
                                 type: 'warning',
                                 center:true
                      });
                      return;
                  }

                API.updateInvoiceMail({
                  orderId:orderId,
                  invoiceId:invoiceId,
                  shippingGroupId:shippingGroupId,
                  elecMail:elecMail
                }).then(data=>{
                      if(data.success==true){
                          _this.queryInvoiceList[index].emailSpanShow="true";
                          this.queryInvoiceList[index].send=0;
                          _this.$message({
                                     message: '邮箱修改成功',
                                     center:true,
                                     type: 'success'
                          });
                      }else{
                      _this.$message.error(data.respMsg);
                      }
                }).catch(function(data){
                      _this.$message.error(data.errMsg);
                })
        },
        sendEmail(index,elecMail,orderId,shippingGroupId,invoiceNum){
              var _this=this;
                    if(elecMail==' '||elecMail==null){
                       _this.$message({
                                  message: '请输入邮箱号',
                                  type: 'warning',
                                  center:true
                       });
                       return ;
                   }
                     var elecMail=elecMail.trim();
                    if(_this.regEmail(elecMail)){
                            _this.$message({
                                       message: '请输入正确的邮箱号',
                                       type: 'warning',
                                       center:true
                            });
                            return;
                      }
                      if(elecMail.length>40){
                        _this.$message({
                                   message: '邮箱最多允许输入40个字符',
                                   type: 'warning',
                                   center:true
                        });
                        return;
                      }
                API.resendInvioceMail({
                  orderId:orderId,
                  shippingGroupId:shippingGroupId ,
                  invoiceNum:invoiceNum,
                  elecMail:elecMail
                }).then(data=>{
                      if(data.success==true){
                        _this.$message({
                                   message: '已成功发送电子发票',
                                   center:true,
                                   type: 'success'
                        });
                      }else{
                        _this.$message.error(data.respMsg);
                      }
                }).catch(data=>{
                        _this.$message.error(data.respMsg);
                })
        },
        pageInit(data){
          this.pageNum=data.pageNum;
          this.getQueryInvoiceList();
        }
  }
}
</script>
<style>
.fl{float: left;}
.clearfix:after,.clearfix:before{content:".";display:block;height:0;clear:both;visibility:hidden;overflow:hidden}
.clearfix{display:block;*display:inline-block;_zoom:1}
.queryHeader {width: 100%;line-height: 36px;background: #409EFF;height: 36px;color: #fff;font-size: 14px;  font-weight: bold;  position: relative;}
.invoiceContent{width: 100%; margin-right: 50px; overflow-x: auto;}
.mainContent{padding: 20px;border:1px solid #E4E7ED;}
.mainHead{height: 35px;  line-height: 35px; color: #303133;font-size: 13px;font-weight: 500;margin-bottom: 25px}
thead.has-gutter th{background:#eef6ff;padding:8px;}
.el-table__body td{ padding:5px 0;font-size:12px;}
.informationService {  height: 68px;  border-bottom: 1px solid #cccccc;  line-height: 68px;}
.invoiceList{border:1px solid #E4E7ED;margin:30px 0; min-width: 930px;}
.txtOverflow{ overflow:hidden;  text-overflow:ellipsis;white-space:nowrap;-o-text-overflow:ellipsis;width:80%;display: block;text-decoration: none;font-size: 12px;color:#303133}
.invoiceNum{height: 35px;  line-height: 35px;  padding-left: 15px;background: #eef6ff;border-bottom: 1px solid #E4E7ED;
color: #303133;  font:500 14px/35px "Microsoft Yahei"  }
.invoiceBox{padding:10px;}
 .invoiceRow{height: 35px;line-height:35px;font-size: 13px;}
 .queryInvoice{width: 350px; float: left;}
.noSearchOrder{text-align: center; font-size: 14px;  padding: 40px 0;}
.grayBg,.grayBg .invoiceNum{background-color:#E4E7ED}
</style>

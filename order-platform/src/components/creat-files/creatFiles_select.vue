<template>
 <!--  <div  @click.stop="changename">{{LOGINDATA.loginName}}</div> -->
 <div class="container">
  <g-header  @clickClose="clickClose" v-model="initheader">
  </g-header>
  <el-form :inline="true" :model="labelSearch" class="search" width="990px">
    <el-form-item label="订单号">
      <el-input v-model="labelSearch.orderId" placeholder="订单号"></el-input>
    </el-form-item>
    <el-form-item label="会员卡号">
      <el-input v-model="labelSearch.vipId" placeholder="会员卡号"></el-input>
    </el-form-item>

    <el-form-item label="配送单号">
      <el-input v-model="labelSearch.deliveryId" placeholder="配送单号"></el-input>
    </el-form-item>

    <el-form-item label="收货人姓名">
      <el-input v-model="labelSearch.name" placeholder="收货人姓名"></el-input>
    </el-form-item>
    <el-form-item label="收货人手机号">
      <el-input v-model="labelSearch.tel" placeholder="收货人手机号"></el-input>
    </el-form-item>
    <el-form-item label="下单时间">
     <el-date-picker class="timebox" type="date" placeholder="选择开始日期" v-model="labelSearch.startDate" ></el-date-picker><span class="data-span">-</span><el-date-picker class="timebox" type="date" placeholder="选择结束日期" v-model="labelSearch.endDate" ></el-date-picker>
   </el-form-item>
  </el-form>
   <div class="button-box">
    <el-button type="primary" size="mini" class="button">查询</el-button>
    <el-button type="primary" size="mini" class="button right">重置</el-button>
  </div>
  <div class="table-box">
    <el-table
    :data="serachData"
    stripe
    border
    style="width: 100%">
    <el-table-column
    prop="orderId"
    fixed
    label="订单号"
    width="180">
    </el-table-column>
    <el-table-column
    prop="vipId"
    label="会员卡号"
    width="180">
    </el-table-column>
    <el-table-column
    prop="deliveryId"
    label="配送单号">
    </el-table-column>
    <el-table-column
    prop="name"
    label="收货人姓名">
    </el-table-column>
    <el-table-column
    prop="tel"
    label="收货人手机号">
    </el-table-column>
    <el-table-column
    prop="prodId"
    label="商品代码">
    </el-table-column>
    <el-table-column
    prop="product"
    label="商品名称">
    </el-table-column>
    <el-table-column
    prop="num"
    label="数量">
    </el-table-column>
    <el-table-column
    prop="price"
    label="单价">
    </el-table-column>
    <el-table-column
    prop="orderTime"
    label="下单时间">
    </el-table-column>
    <el-table-column
    prop="deliveryType"
    label="送货方式">
    </el-table-column>
    <el-table-column
    prop="installType"
    label="安装方式">
    </el-table-column>
    <el-table-column  fixed="right"
    prop="status" label="操作">
      <template slot-scope="scope">
        <el-button
        @click="handleLook(scope.$index, scope.row)" type="text" size="small">查看</el-button>
        <el-button
        @click="handleEdit(scope.$index, scope.row)"  type="text" size="small">修改</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</div>
</template>
<style>
 /* .container{
    font-weight: 500;
    font-family: "Mircosoft YaHei";
  }*/
  .timebox{
    width: 200px;
  }
  .el-form-item__label{
    width: 100px;
    text-align: center;
  }
  .data-span{
    padding: 0 10px;
  }
  .button-box{
    width: 100%;
    padding: 20px 0;
    text-align: center;
  }
  .button{
    display: inline-block;
/*    width: 100px;*/
    font-weight: 500;
  }
  .button.right{
    margin-left: 100px;
    background: #fff;
    color: #606266;
    border-color:#eee;
  }
  .el-input__inner{
    font-size: 14px;
    color: #606266;
  }
  .table-box{
    width: 100%;
    border:1px solid #eee;
    text-align: center;
    margin-top: 50px;
  }
  .el-table th, .el-table tr{
    color: #606266;
    font-size: 12px;
  }
  .el-table th.is-leaf{
    background: #eef6ff;
    color: #909399;
    font-size: 14px;
  }
  .table-box .el-table th>.cell{
    text-align: center;
    color: #606266;
    font-size: 12px;
  }

</style>
<script>
  import {mapState,mapActions} from  'vuex';
  export  default {
    data() {
      return {
        labelSearch:{
          orderId:"10077887650",
          vipId:"",
          deliveryId:"",
          name:'',
          tel:''
        },
        serachData: [{
          orderId:'10077887650',
          vipId:'211146',
          deliveryId:'334899987611',
          name:'小红猫',
          tel:'150****3338',
          product:'1044444',
          prodId:' iphone 7 128G 亮黑色',
          num:'2',
          price:'120.00',
          orderTime: '2016-05-02 13:00',
          deliveryType: '集中配送',
          installType: '安装'
        }, {
          orderId:'10077887650',
          vipId:'2111467654',
          deliveryId:'334899987611',
          name:'狼外婆',
          tel:'150****3338',
          product:'1044444',
          prodId:' iphone 7 128G 亮黑色',
          num:'2',
          price:'120.00',
          orderTime: '2016-05-02 13:00',
          deliveryType: '集中配送',
          installType: '售后带货安装'
        }],
        initheader:{ 
            "curstyle":{              //头数据
              "margin-bottom":"30px"
            },
            "content":"查询条件"
          }
        }

      },
      computed:mapState({
        LOGINDATA:"LOGINDATA"
      }),
      methods:{
        ...mapActions([
          "setLogin"
          ]),
        clickClose(){

        },
        changename(){
          this.setLogin({
            "loginName":"小仙女"
          })
        },
        handleEdit(index, row) {
          console.log(index, row);
        },
        handleLook(index, row) {
          console.log(index, row);
        }

      }

    }
  </script>


<template>
  <div class="bg_time" v-if="isshow">
      <div class="queryDeliveryAbility" v-if="isshow">
          <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
         <div class="dayselect" v-if="!errmessage">
             <ul class="dayselectbtn">
                 <li :class="{cur:index == num}" v-for="(val,index) in dayselect.option" v-bind:key="val.abilityDate" @click.stop="clickdaysel(val.abilityDate,index)">{{val.abilityDate | formatDate}}</li>
             </ul>
         </div>
         <div class="showtime" v-if="!errmessage">
             <ul class="showtimebtn">
                  <li  :class="[{disable:val.able == 0},{pccartcur:val.isSelected == 1} ]" v-for="val in showtimeoption" v-bind:key="val.segmentCode" @click.stop="showtimefn(val.segmentDescBegin,val.segmentDescEnd,val.segmentCode,val.able,val.installSegmentCode)">{{val.segmentDescBegin}}-{{val.segmentDescEnd}}
                  <p v-if="val.able==0">
                    约满
                  </p>
                  <p  v-else-if="val.able==1">可选</p>
                  <p  v-else-if="val.able==2">紧张</p>
                  <p  v-else-if="val.able==3">可选</p>
                  </li>
             </ul>
         </div>
         <div class="errmes" v-if="errmessage">
           {{errmessage}}
         </div>
         <span class="close" @click="showtimefn('close')"></span>
      </div>
  </div>
</template>
<script>
import axios from 'axios'
import util from './util.js';
export default {
 name: 'g-delivery',//queryDeliveryAbility
 data(){
     return{
         "url":"https://easy-mock.com/mock",
         "pccartviewurl":"//mpf.atguat.com.cn/pccartview",
         "dayselect":{
             val:"",
             option:[]
         },
         "showtime":{
             val:"",
             code:"",
             option:[]
         },
         "num":0,
         "isshow":false,
         "installSite":"", //安装能需要回传的参数
         "installArea":"",
         "installCompanyCode":"",
         "sayt":"",
         "errmessage":""
     }
 },
  props: {
      value:{
           type: Object,
          default:function(){
              return {
                  "val":{
                    "storeCode":"",
                    "storageCode":"",
                    "deliveryCount":"",
                    "deliveryDate":""
                  },
                  "type":"installAbility", //一种是送货能delivery  一种是安装能installAbility
                  "limittime":{
                      "star":"",
                      "end":"",
                      "datatime":""
                  },
                  "typereq":"",//openBill 导购单页调用   otherpage其他是建档页调用
              }
          }
      }
  }, 
 filters: {
      formatDate(time) {
          //console.log(this.num)
            var date = new Date(time);
            return util.formatDate.format(date, 'yyyy-MM-dd');
        }
 },
 created(){
     // 配置环境变量
     var  curhost = location.host;
     this.url = "//"+curhost+"/pcorderview";
     this.pccartviewurl = "//"+curhost+"/pccartview";
 },
 computed:{
     showtimeoption(){
        if(this.value && this.value.limittime && this.value.limittime.star){
         let startime= this.value.limittime.star.split(":")[0]*60*60*1000+this.value.limittime.star.split(":")[1]*60*1000;//开始时间;

         let endtime=this.value.limittime.end.split(":")[0]*60*60*1000+this.value.limittime.end.split(":")[1]*60*1000;//开始时间
         let optin = this.showtime.option;
         for(let i=0; i<optin.length; i++){
             let opstart=optin[i].segmentDescBegin.split(":")[0]*60*60*1000+optin[i].segmentDescBegin.split(":")[1]*60*1000;//每个时间段的开始时间戳
             let opend=optin[i].segmentDescEnd.split(":")[0]*60*60*1000+optin[i].segmentDescEnd.split(":")[1]*60*1000;//每个时间段的结束时间戳
              //console.log(optin[i].segmentDescBegin+"-"+optin[i].segmentDescEnd)
              //安装能得开始时间 必须大于送货能的结束时间
            if(opstart>=endtime){
              
            }else{
                if(this.dayselect.val==this.value.limittime.datatime){
                    optin[i].able=0;
                }  
            }
         
         }
         return optin;
        }else{
           return this.showtime.option; 
        }
      
     }
 },
 watch: {
     'value':{
         handler(a){
             //console.log(a)
             this.num=0;
             this.initdelivue();
         },
         deep: true 
     }
     
 },
 methods:{ 
  showtimefn(st,et,code,able,installSegmentCode){
      if(able==0){
          return false;
      }
      let  that=this;
        //选完时间段之后做的操作
        let change={
          st:st,  //开始时间 8：00  //点击关闭之后返回close
          et:et,  //结束时间 10：00
          code:code,//该时段对应的代码
          installSegmentCode:installSegmentCode,// 送能对应的安能的code
          sayt:that.sayt,//是否区域支持
          able:able,// 0  约满  1 可送 2 紧张 3送按一体
          time:that.dayselect.val,//选中的日期
          type:that.value.type,//类型 送货能（运能）delivery  安装能 installAbility 区分后续操作
          installSite:that.installSite,//type 为 installAbility时  返回安装网点
          installArea:that.installArea,//type 为 installAbility时  返回安装区域
          installCompanyCode:that.installCompanyCode//type 为 installAbility时返回售后公司代码
        }
        this.$emit('changed',change)
      
     // console.log(st,et,code)
      that.isshow=false;
  },
   doThis() {
        this.$emit('input', this.$refs.input.value);
    },
  clickdaysel(time,index){
      let  that=this;
    that.num = index;
    that.dayselect.val=that.dayselect.option[that.num].abilityDate;
    that.showtime.option= that.dayselect.option[that.num].abilityTimeList;
  },
  initdelivue(){ //初始化运能信息
       let that=this;
       if(that.value.typereq == "openBill"){
          if(that.value.type=="delivery"){
           axios.post(that.pccartviewurl+'/queryTransportCapability',that.value.val).then(function(val){
           let  data=val.data;
            if(data && data.success && data.response){
            that.errmessage="";
            that.dayselect.option=data.response;
            that.isshow=true;
            that.dayselect.val=that.dayselect.option[that.num].abilityDate;
            that.showtime.option= that.dayselect.option[that.num].abilityTimeList;
            }else{
                that.isshow=true;
                that.errmessage=data.respMsg;
            }
           
        })
       }else{
           //https://easy-mock.com/mock/5aceb8caea0ca732e6dc1edf/platform/queryInstallAbility
           axios.post(that.pccartviewurl+'/queryInstallCapability',that.value.val).then(function(val){
               let  data=val.data;
               //console.log(data)
               if(data && data.success && data.response){
               that.errmessage="";
               that.dayselect.option=data.response;
               that.isshow=true;
               that.dayselect.val=that.dayselect.option[that.num].abilityDate;
               that.showtime.option= that.dayselect.option[that.num].abilityTimeList;
               //console.log(that.dayselect.option)
               //console.log(data)
               }else{
                   that.isshow=true;
                   that.errmessage=data.respMsg;
               }
            
           })
       
       }

      }else{


          if(that.value.type=="delivery"){
             axios.post(that.url+'/queryDeliveryAbility',that.value.val).then(function(val){
             let  data=val.data;
              if(data && data.success && data.response){

              if(that.value.val.isBD==1){  //建党送按一体单独处理
                that.dayselect.option = data.response.dtoAbility;
                that.dayselect.val = that.dayselect.option[that.num].abilityDate;
                that.showtime.option = that.dayselect.option[that.num].abilityTimeList;
                that.installSite = data.response.installSite;
                that.installArea = data.response.installArea;
                that.installCompanyCode = data.response.installCompanyCode;
                that.sayt = data.response.sayt;

              }else{
                that.dayselect.option=data.response;
                that.dayselect.val=that.dayselect.option[that.num].abilityDate;
                that.showtime.option= that.dayselect.option[that.num].abilityTimeList;
              }
              that.isshow=true;
              that.errmessage="";
             
              }else{
                  that.isshow=true;
                  that.errmessage=data.respMsg;
              }
             
             //console.log(that.dayselect.option)
             //console.log(data)
          })
         }else{
             //https://easy-mock.com/mock/5aceb8caea0ca732e6dc1edf/platform/queryInstallAbility
            axios.post(that.url+'/queryInstallAbility',that.value.val).then(function(val){
                 let  data=val.data;
                 //console.log(data)
                 if(data && data.success && data.response && data.response.installInfo){
                 that.errmessage="";
                 that.dayselect.option=data.response.installInfo.abilityList;
                 that.installSite=data.response.installInfo.installSite; //安装能所需的参数后续要用
                 that.installArea=data.response.installInfo.installArea;
                 that.installCompanyCode=data.response.installInfo.installCompanyCode;
                 that.isshow=true;
                 that.dayselect.val=that.dayselect.option[that.num].abilityDate;
                 that.showtime.option= that.dayselect.option[that.num].abilityTimeList;
                 //console.log(that.dayselect.option)
                 //console.log(data)
                 }else{
                     that.isshow=true;
                     that.errmessage=data.respMsg;
                 }
              
            })
         
         }
    }
      

       
        
  }
 }
}
</script>



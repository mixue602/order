<template>
<div class="cityinput" @click.stop="showBox" :class="cityShow" v-bind:style="curstyle">
    <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
    <i class="el-icon-arrow-down cityinputarrow"></i>
    <div class="citybox">
       <a href="javascript:;" v-bind:style="curstyle">{{inputshowcitynames}}</a>
    </div>
    <div class="gCity gCity-wrapper clearfix" v-if="isShowcity">
            <div class="gctSelect clearfix">
                <a href="javascript:;" :class="{'cur':val.titleclass,'disable':val.disable}"  v-for="(val,key, index)  in cityshowlist" v-bind:key="val.code" @click.stop=clicktit(index+1,val.disable)  v-if="val.placeshow" ><b>{{ val.label }}</b><i class="el-icon-arrow-down"></i></a>
                <a href="javascript:;"  class="el-icon-close" @click.stop="closecity"></a>
            </div>
            <div class="cityMBox clearfix">
                    <div class="gctBox clearfix" v-for="(val,key, index)  in cityshowlist" v-bind:key="val.isshow"  v-if = "val.isshow" >
                        <span v-for= "city in val.option" v-bind:key="city.label" @click.stop="clickcity(index+1,city.code,city.label)" :class="city.citycolor"> {{city.label}}</span>   
                    </div>   
            </div>
    </div>
</div>
</template>
<script>
import axios from 'axios'
export default {
 name: 'g-city',
 data () {
            return {
            curstyle:this.value.curstyle,
            cityShow:"",
            url:"",
            inputinfo:[],
            commerceItemId:"",//商品唯一号请求接口用
            shippingGroupId:"",//配送单号
            isShowcity:false,
            firstaera:false ,// 记录初始化没有地址
            inputshowcitynames:"",
            pleaseselect:this.value.aeracode1.label?"":"请选择",
            cityshowlist:{
                "isShowcity1":{
                    "isshow":false,
                    "placeshow":true,
                    "label":this.value.aeracode1.label?this.value.aeracode1.label:"北京",
                    "code":this.value.aeracode1.code?this.value.aeracode1.code:11000000,
                    "titleclass":"",
                    "disable":this.value.aeracode1.disable?this.value.aeracode1.disable:false,
                     option:[]
                    },
                "isShowcity2":{
                    "isshow":false,
                    "placeshow":true,
                    "label":this.value.aeracode2.label?this.value.aeracode2.label:"北京市",
                    "code":this.value.aeracode2.code?this.value.aeracode2.code:11010000,
                    "titleclass":"",
                    "disable":this.value.aeracode2.disable?this.value.aeracode2.disable:false,
                     option:[
                               
                            ]
                    },
                "isShowcity3":{
                    "isshow":false,
                    "placeshow":true,
                    "label":this.value.aeracode3.label?this.value.aeracode3.label:"朝阳区",
                    "code":this.value.aeracode3.code?this.value.aeracode3.code:11010200,
                    "titleclass":"",
                    "disable":this.value.aeracode3.disable?this.value.aeracode3.disable:false,
                     option:[
                               
                            ]
                    },
                "isShowcity4":{
                    "isshow":true,
                    "placeshow":true,
                    "label":this.value.aeracode4.label?this.value.aeracode4.label:"朝外街道",
                    "code":this.value.aeracode4.code?this.value.aeracode4.code:110102002,
                    "titleclass":"cur",
                    "disable":this.value.aeracode4.disable?this.value.aeracode4.disable:false,
                     option:[
                               
                            ]
                    }
            }
            
         }
     },
  created(){
      let that=this;
       document.addEventListener('click', (e) => {
             if (!this.$el.contains(e.target)){
              that.isShowcity = false;
              that.cityShow="";
             } 
         })
      // 配置环境变量
     var  curhost = location.host;
     this.url = "//"+curhost+"/pcorderview";
      //console.log(this.code)
    that.showfourcity();
    
  },
  watch: {
      'value':{
          handler(a){
             let that=this;
            // console.log(a)
             let  isShowcity='isShowcity';
             let  num=0;
             for ( let i in a){
                 if(i!='curstyle'){
                     num++;
                 let isShowcitycur=isShowcity+num;
                     if(a[i].label && a[i].code){
                       that.pleaseselect="";
                       that.cityshowlist[isShowcitycur].label=a[i].label;
                       that.cityshowlist[isShowcitycur].code=a[i].code;
                     } 
                     that.cityshowlist[isShowcitycur].disable=a[i].disable;
                 }else{
                     that.curstyle=a[i];
                 };
                 
                // console.log(a[i].label)
             };
             // 记录初始化没有地址
             if(a.aeracode4.firstaera){
              that.firstaera = a.aeracode4.firstaera;
              that.commerceItemId = a.aeracode4.commerceItemId;
              that.shippingGroupId = a.aeracode4.shippingGroupId;
             }

             this.inputshowcitynames="";
             this.showfourcity();
             
          },
        deep: true 
      } 
  },
  methods:{

      showfourcity(){ //展示四级地址
        let that=this;
        that.inputinfo=[];
        for ( let i in that.cityshowlist){
          
         let curcityobj={};

         if(i=="isShowcity1"){
             that.inputshowcitynames+=that.cityshowlist[i].label;
         }else if(i=="isShowcity2"){
            that.inputshowcitynames+=that.cityshowlist[i].label.replace(that.cityshowlist.isShowcity1.label,"");
         }else{
            that.inputshowcitynames+=that.cityshowlist[i].label.replace(that.cityshowlist.isShowcity2.label,""); 
         }
         curcityobj.label=that.cityshowlist[i].label;
         curcityobj.code=that.cityshowlist[i].code;
         that.inputinfo.push(curcityobj); // 回传值
         }
         if(that.pleaseselect){
          that.inputshowcitynames=that.pleaseselect;
         }
      },
      doThis() {
        this.$emit('input', this.$refs.input.value);
      },
      clickcity(val,code,label){
          let that=this;
          let citycode='isShowcity'+val;

            //处理点击完1 2 3 级之后的数据
            let  isShowcity="isShowcity"+(val+1); //上一级
            that.cityshowlist[citycode].code = code;
            that.cityshowlist[citycode].label=label

            if(val==4){
                if(!that.firstaera){ // 初始化没地址 直接请求

                  that.clickfour();

                }else{
                  // 请求是否能修改地址
                  
                  that.checkCityChange();
                 
                }
            }else{
               that.clickcitycode(val+1); //处理点击完1 2 3 级之后
               that.randerCity(that.cityshowlist[citycode].code,that.cityshowlist[isShowcity].code,isShowcity);
            }
                 
      },
      checkCityChange(){ //校验是否可以修改地址
          var that = this;
           
          axios.post(that.url+"/queryAddressSellResult",{
            "commerceItemId":that.commerceItemId,
            "shippingGroupId":that.shippingGroupId,
            "countyCode":that.cityshowlist.isShowcity3.code,
            "townCode":that.cityshowlist.isShowcity4.code
          }).then((res)=>{
           
            var res = res.data; 
            if(res && res.success && res.resultObj){  //resultObj 这个字段是陈建改的 之前是response
                var resData = res.resultObj;
                if(resData.queryResult==1){
                  that.clickfour();
                }else{
                  that.isShowcity=false;
                  that.$message.error(resData.queryMessage);

                }
            }else{
              that.$message.error(res.respMsg);
            }
          })
      },
      clickfour(){
        let that=this;
        that.pleaseselect="";
        that.isShowcity=false;
        that.cityShow="";
        that.inputshowcitynames="";
        that.showfourcity();
        //处理点击完四级回转值

        this.$emit('changeend', that.inputinfo)

      },
      clickcitycode(val){ //点击对应的box里面的城市的操作
        var  that=this;
       // console.log(val)    //2 3 4
        let isShowcitys='isShowcity'+val;
        for( let i=1; i<5; i++){
            let isShowcity='isShowcity'+i;
            that.cityshowlist[isShowcity].isshow=false;
            that.cityshowlist[isShowcity].titleclass="";
            if(i>=val){
               //console.log(val)
               that.cityshowlist[isShowcity].placeshow=false;
               that.cityshowlist[isShowcity].option=[];
            }
        }
         that.cityshowlist[isShowcitys].placeshow=true;
         that.cityshowlist[isShowcitys].label="请选择";
         that.cityshowlist[isShowcitys].isshow=true;
         that.cityshowlist[isShowcitys].code="";
         that.cityshowlist[isShowcitys].titleclass='cur';
        
      },
      clicktit(val,disable){//点击tit展示对应的city
        if (disable){
            return false;
        }
         var  that=this;
         let isShowcitys='isShowcity'+val;   
         let citycode='isShowcity'+(val-1);
        for( let i=1; i<5; i++){
            let isShowcity='isShowcity'+i;
            that.cityshowlist[isShowcity].isshow=false;
            that.cityshowlist[isShowcity].titleclass="";

        }
        
        that.cityshowlist[isShowcitys].isshow=true;
        that.cityshowlist[isShowcitys].titleclass='cur';
        if(isShowcitys!="isShowcity1"){
            that.randerCity(that.cityshowlist[citycode].code,that.cityshowlist[isShowcitys].code,isShowcitys); 
        }else{
            that.randerCity("",that.cityshowlist[isShowcitys].code,isShowcitys); 
        };
      },
      showBox(){//展示城市
          let that=this;
          if(that.cityshowlist.isShowcity1.disable && that.cityshowlist.isShowcity2.disable && that.cityshowlist.isShowcity3.disable && that.cityshowlist.isShowcity4.disable){
              return false;
          }
          this.isShowcity=true;
          this.cityShow="cityShow";
          let cur=0;
          for ( let i in that.cityshowlist){
              cur+=1;
              if(i!="isShowcity1" && that.cityshowlist[i].isshow){
                  let  isShowcity="isShowcity"+(cur-1);
                   //console.log(that.cityshowlist[isShowcity].code)
                  that.randerCity(that.cityshowlist[isShowcity].code,that.cityshowlist[i].code,i)
              }
          }
      },
      closecity(){//关闭城市
          this.isShowcity=false;
          this.cityShow="";
         // console.log(this.isShowcity);
          
      },
      randerCity(code,curcode,isShowcity){ // 渲染二三四级城市
          let that=this;
          /*http://pcorderview.atguat.com.cn/queryCityInfoList*/
          if(that.cityshowlist[isShowcity].option.length==0){
              axios.post(that.url+"/queryCityInfoList",{"cityCode":code}).then(function(arrdata){

              let data=arrdata.data;
              if(data && data.success && data.response && data.response.length>0){
                   let citydata=data.response;
                    that.cityshowlist[isShowcity].option=citydata;
                    that.citycolorClass(citydata,isShowcity,curcode);
              }
          })
          }else{
              that.citycolorClass(that.cityshowlist[isShowcity].option,isShowcity,curcode);
          }
          
      },
      citycolorClass(citydata,isShowcity,curcode){ //citydata 所有城市 //isShowcity 哪级城市  // curcode 当前城市吗  如果为0 就没有
          let that=this;
          for(let i=0; i<citydata.length; i++){
            that.cityshowlist[isShowcity].option[i].citycolor="";
            if(curcode && citydata[i].code==curcode){
                that.cityshowlist[isShowcity].option[i].citycolor="citycolor";
            }
          }
      }
  },
  props: {
      value:{
          type: Object,
          default:function(){
              return {
                  "curstyle":{
                       type: Object,
                       default:function(){
                           return {}
                       }
                  },
                  "aeracode1":{
                    type: Object,
                    default:function(){
                        return {
                            "label":{
                                type:"String",
                                default:"北京"
                            },
                            "code":{
                                type:"Number",
                                default:11000000
                            },
                            "disable":{
                                 type:"Boolean",
                                default:true
                            }
                        }
                    }
                    
                  },
                 "aeracode2":{
                    type: Object,
                    default:function(){
                        return {
                            "label":{
                                type:"String",
                                default:"北京市"
                            },
                            "code":{
                                type:"Number",
                                default:11010000
                            },
                            "disable":{
                                 type:"Boolean",
                                default:true
                            }
                        }
                    }
                    
                  },
                  "aeracode3":{
                    type: Object,
                    default:function(){
                        return {
                            "label":{
                                type:"String",
                                default:"朝阳区"
                            },
                            "code":{
                                type:"Number",
                                default:11010200
                            },
                            "disable":{
                                 type:"Boolean",
                                default:true
                            }
                        }
                    }
                    
                  },
                  "aeracode4":{
                    type: Object,
                    default:function(){
                        return {
                             "label":{
                                type:"String",
                                default:"朝外街道"
                            },
                            "code":{
                                type:"Number",
                                default:110102002
                            },
                            "disable":{
                                type:"Boolean",
                                default:true
                            }
                        }
                    }
                    
                  }
              }
          }
      }
      
  }
}
</script>
  


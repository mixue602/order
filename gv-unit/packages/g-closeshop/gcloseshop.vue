<template>
<div class="gcloseshop">

  <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>

  <div class="gcs-input"  @click.stop="showBox">
    <input  type="text" autocomplete="off" :value="storeName" :placeholder="placeholder" readonly="readonly" class="gcs-input-txt">
    <i class="gcs-arrow" :class="{'gcs-arrow1':arrowup,'gcs-arrow2':arrowbottom}"></i>
  </div>
  <transition name="fade">
    <ul class="gcs-body" v-if="isShow">
      <li v-if="options.length>0" :class="storeVal == val.storeCode? 'select':''" v-for="(val,key, index)  in options" v-bind:key="val.storeCode" @click.stop="clicklist(val.storeName,val.storeCode)">{{val.storeName}}</li>
      <li  class="nodata" v-if="options.length==0" @click.stop="nodata">暂无数据</li>
    </ul>
  </transition>
</div>
</template>
<script>
import axios from 'axios'
export default {
 name: 'g-closeshop',
  data () {
    return {
          isShow:0,
          arrowup:"",
          arrowbottom:"",
          options: [

          ],
           storeVal:"",
           storeName:"",
           defaultVal:"",
           defaultName:"",
           defauleshow:1
         }
     },
  created(){
    let that=this;
    // 配置环境变量
    var  curhost = location.host;
    this.url = "//"+curhost+"/pcorderview";
     document.addEventListener('click', (e) => {
           if (!this.$el.contains(e.target)){
            this.isShow = false;
            this.arrowup="gcs-arrow1";
            this.arrowbottom="";
           } 
       })
    this.initData();//初始化数据
  },
  watch: {
      'value':{
          handler(a){
             let that=this;
             if(!a.value &&  that.defauleshow == 1){
               that.storeName=that.defaultName;
               that.storeVal=that.defaultVal;
               that.doThis();
             }
          },
        deep: true 
      } 
  },
  methods:{
   initData(){
     //请求初始化数据
     var that = this;
     if(that.value.options){
      that.options = that.value.options;
     }else{
        axios.post(that.url+'/searchCloseStore').then(function(val){
          let data = val.data;
           if(data && data.success && data.response){
              that.options = data.response;
              if(data.response && data.response.length==0){
                that.defauleshow = 0;
              };
              //选取默认
              for( var i = 0,j = that.options.length; i<j; i++){
                if(that.options[i].defaultFlag == 1){ 
                  that.storeName = that.options[i].storeName;
                  that.storeVal = that.options[i].storeCode;
                  //默认值存起来
                  that.defaultName = that.options[i].storeName;
                  that.defaultVal = that.options[i].storeCode;
                }
              }
              
           }else{
              that.options = []; 
               that.defauleshow = 0;
           }
            //当前选中项推给父组件
           that.$emit('changeend',that.storeName,that.storeVal,that.defauleshow); //推父组件方法
           that.doThis(); //推给父组件

        })
     }
    
   },
   showBox(){
     this.isShow = !this.isShow;
     if(this.isShow ){ //展开
        this.arrowup="";
        this.arrowbottom="gcs-arrow2"
     }else{//关闭
        this.arrowup="gcs-arrow1";
        this.arrowbottom="";
     }
  
   },
   clicklist(storeName,storeCode){
     var that = this;
     this.storeName = storeName;
     this.storeVal =  storeCode;
     this.isShow = !this.isShow;
     this.arrowup="gcs-arrow1";
     this.arrowbottom="";
     this.$emit('changeend',this.storeName,this.storeVal); //推父组件方法
     this.doThis(); //推给父组件
   },
   nodata(){
     this.isShow = !this.isShow;
     this.arrowup="gcs-arrow1";
     this.arrowbottom="";
   },
   doThis() {
        let  that = this;
        this.$emit('input', {value:this.storeVal,isdata:this.defauleshow});
    }
  },
  props: {
       placeholder: {
        type: String,
        default() {
          return t('el.gcs-input-txt.placeholder');
        }
      },
      value: {
        required: true
      }
  }
}
</script>
  


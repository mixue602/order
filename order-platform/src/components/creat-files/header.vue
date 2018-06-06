<template>
    <div class="globel-d-header" v-bind:style="curstyle">
      <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
      <span class="globeltit" v-if="content">{{ content }}</span>
      <slot name="child-nav" ></slot>
      <span class="closebtn" v-if="showclose" @click.stop="clickClose">{{ showclose }}</span>
    </div>
</template>
<style>
.globel-d-header{
    width:100%;
    line-height: 36px;
    background:#409EFF;
    height: 36px;
   
    color: #fff;
    font-size: 14px;
    font-weight: bold;
}
.globel-d-header span.globeltit{
    margin-left: 15px;
}
.globel-d-header span.closebtn{
    float: right;
    margin-right:15px; 
    cursor: pointer;
}
</style>

<script>
  export  default {
    name: 'g-header',
    data() {
      return {
          curstyle:this.value.curstyle,
          showclose:this.value.showclose,
          content:this.value.content
      };
    },
    
    methods:{
     clickClose(){
            this.$emit('clickClose');
     },
     doThis() {
        this.$emit('input', this.$refs.input.value);
    }
      
    },
    props: {
         value:{
          type: Object,
          default:function(){
              return {
                  "curstyle":{
                      
                  },
                  "showclose":"X",
                  "content":"自己取名字"
              }
          }
      },
    }

  }
</script>


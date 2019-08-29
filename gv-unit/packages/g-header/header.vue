<template>
    <div class="globel-d-header" v-bind:style="curstyle">
      <input type="text" ref="input" :value="value" @input="doThis" style="display:none"/>
      <span class="globeltit" v-if="content">{{ content }}</span>
      <slot name="child-nav" ></slot>
      <span class="closebtn" v-if="showclose" @click.stop="clickClose">{{ showclose }}</span>
    </div>
</template>
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
    watch: {
      'value':{
          handler(a){
             let that=this;
             //console.log(a)
           that.showclose=a.showclose;
           that.content=a.content;
             
          },
        deep: true 
      } 
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
                  "showclose":"返回",
                  "content":"自己取名字"
              }
          }
      },
    }

  }
</script>


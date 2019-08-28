<template>
  <el-dialog
        title="订金购买意向"
        :visible.sync="dialogVisible" 
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
        center
        :clearable="true"
        class="deposit-dialog"
        width="600px"
        :before-close="bindCancel"
      >
        <div class="cotent">
          <h3 class="title"><em>*</em>订金分类</h3>
          <div class="deposit-tab">
            <el-radio-group v-model="orderUsage">
              <el-radio :label="1">订金充值</el-radio>
              <el-radio :label="2">订金翻倍</el-radio>
            </el-radio-group>
          </div>

          <h3 class="title"><em>*</em>订金意向品类</h3>


          <div class="follow-select-box follow-select__inner"  v-clickoutside="bindSelectClose" :class="{'show-follow-select':showFollowSelect}">
            <div class="follow-input" style="position: relative"  @click="bindisShowSelCategory">
              <el-input
                placeholder="请选择"
                readonly
                v-model="categorys"
                >
              </el-input>
              <span class="el-input__suffix">
                  <i class="el-icon-arrow-down icon" :class="{'is-reverse': showFollowSelect}"></i>
              </span>
            </div>
            <div class="el-select-dropdown el-popper" >
              <el-scrollbar style="height: 200px;overflow-x: hidden;">
              <div class="check-all-box">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全品类</el-checkbox>
              </div>
              <ul class="el-select-dropdown__list">
                <template  v-for="item in categoryData"> 
                  <li class="el-select-dropdown__item" :key="item.code" :class="{selected: item.select}" @click="bindSelCategory($event,item)">
                    <span>{{item.name}}</span>
                  </li>
                </template>
              </ul>
              </el-scrollbar>
              <div x-arrow="" class="popper__arrow" style=""></div>
            </div>

          </div>

          <h3 class="title">备注文字</h3>

          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model.trim="remark"
            @keyup.native="bindRemark"
            >
          </el-input> 

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindCancel">取 消</el-button>
          <el-button type="primary" :disabled="intentionDisabled" @click="bindConfirm">保 存</el-button>
        </span>
      </el-dialog>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import API from '@/api/billing/billing';
  import APID from '@/api/depositDouble/depositDouble';
  import ENV from '@/api/env';
  export default {
    props: {
      dialogVisible: Boolean
    },
    components: {
    },
    created: function() {
      
      //十大品类 是否每次 切换 手机号都重新请求？？
        APID.getAllDeptInfo({
        }).then((data) => {

          if(data.success) {
            if (data.response != null) {
              data.response.forEach((item) => {
                this.$set(item, 'select', false)
              })
              this.categoryData =  data.response;
              this.storeCategoryData = JSON.parse(JSON.stringify(this.categoryData));
            }else {
             
            }
          }else {
            this.ajaxMessageTip(data.respMsg);
          }

        })
    },
    data() {
      return {
        orderUsage: 0,//订金分类，1表示订金充值，2表示订金翻倍
        storeOrderUsage: 0,//缓存订金分类用
        categoryData: [],//品类数据 
        storeCategoryData: [],//缓存品类数据 
        categorys: '',
        storeCategorys: '',//缓存品类
        showFollowSelect: false,
        isIndeterminate: false,
        storeIsIndeterminate: false,
        checkAll: false,
        storeCheckAll: false,
        remark: '',//备注
        storeRemark: ''//缓存备注
      };
    },
    computed: {
        ...mapState([
        'LOGINDATA',
        'billingUsedParam',
      ]),
      //购买意向弹窗确定按钮是否可点击
      intentionDisabled() {
        if(!this.orderUsage) {
          return true;
        }
        return this.categorys.length ? false : true;
      },
    },

    watch: {
      categoryData: {
        handler: function () {
          let str = '';
          
          this.categoryData.forEach((item) => {
            if(item.select) {
              str += item.name + '、'
            }
          })
          if(str.length) {
            str = str.slice(0,-1);
          }
          this.categorys = str;
        },
        deep: true
      }
    },
    methods: {
     
      bindRemark() {
        let value = this.remark;
         value=value.replace(/<(.+?)>/gi,"$1").replace(/^\s+|\s+$/g,'');
        if(this.remark.length>100) {
          value = value.substring(0,100);
        }
        this.remark = value;
      },

      bindSelectClose(e) {
        this.showFollowSelect = false;
      },

      bindConfirm() {
        
        let usage = (this.orderUsage == 1 ? '订金充值' : '订金翻倍');
        let categoryList = [];
        if(this.categorys.length) {
            this.buyIntention = usage + '    ' + this.categorys;
        }
        this.storeOrderUsage = this.orderUsage;
        this.storeCategorys = this.categorys;
        this.storeRemark = this.remark;
        this.storeCheckAll = this.checkAll;
        this.storeIsIndeterminate = this.isIndeterminate;
        this.storeCategoryData = JSON.parse(JSON.stringify(this.categoryData));
        
        this.categoryData.forEach( item => {
          if(item.select) {
            categoryList.push({
              name: item.name,
              code: item.code
            }) 
          }
        })
        this.$emit('bindDialogVisible',
          {
            buyIntention: this.buyIntention,
            categoryList: categoryList,
            orderUsage: this.orderUsage,
            remark: this.remark
        })
      },
      bindCancel() {
        if(this.storeOrderUsage != this.orderUsage || this.storeCategorys != this.categorys || this.storeRemark != this.remark) {
          this.$confirm('确定要放弃此次编辑？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'deal-billing-message-box',
          }).then(() => {
            this.orderUsage = this.storeOrderUsage;
            this.categorys = this.storeCategorys;
            this.remark = this.storeRemark;
             this.isIndeterminate = this.storeIsIndeterminate;
            this.categoryData = JSON.parse(JSON.stringify(this.storeCategoryData));
            this.checkAll = this.storeCheckAll;
            this.$emit('bindDialogVisible')
          }).catch(() => {
          });
        }else {
          this.$emit('bindDialogVisible')
        }
      },


      bindisShowSelCategory() {
        this.showFollowSelect = !this.showFollowSelect;
      },
      bindSelCategory(ev,item) {
        let selCategory = [], len = 0, cLen =  this.categoryData.length;
        this.categoryData.forEach((val) => {
          if(item.code == val.code ) {
            val.select = !item.select;
          }
          if(val.select) {
            selCategory.push(true)
          }
        })

        len = selCategory.length;
        if(!len) {
          this.isIndeterminate = false;
          this.checkAll = false;
        }else if(len < cLen) {
          this.checkAll = false;
          this.isIndeterminate = true;
        }else if(len == cLen) {
          this.isIndeterminate = false;
          this.checkAll = true;
        }
        

      },
      handleCheckAllChange() {
        let _this = this;
        this.categoryData.forEach((val) => {
          val.select = this.checkAll;
        })
        this.isIndeterminate = false
      },
      //接口错误提示
      ajaxMessageTip(respMsg) {
        this.$message({
          showClose: true,
          message: respMsg,
          type: 'warning'
        });
      }

    },
    directives:{
      clickoutside:{
        // 点击空白下拉列表消失事件
        bind(el, binding, vnode) {
          function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
          }
          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = documentHandler;
          document.addEventListener('click', documentHandler);
        },
        update() {},
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__);
          delete el.__vueClickOutside__;
        }
      },
      onfocus:{
        inserted:function(el){
          el.focus()
        }
      }
    },
  };
</script>

<style lang="stylus"  scoped>
.deposit-dialog {
  .title{
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 5px;
    em {
      display: inline-block;
      line-height: 24px;
      vertical-align: top;
      color: rgb(255, 0, 0);
      padding-right: 5px;
    }
  }
  .deposit-tab, .follow-select-box {
    margin-bottom: 15px;
  }
  
}

.follow-select-box {
  width: 215px;
  position: relative;
  box-sizing: border-box;
  .el-input__suffix {
    z-index: 1000;
    line-height: 32px;
    cursor: pointer;
    width: 25px;
    pointer-events: initial;
  }
  .icon {
    color: #c0c4cc;
    font-size: 14px;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    line-height: 16px;
    cursor: pointer;
    -webkit-transform: rotateZ(0);
    transform: rotateZ(0);
  }
  .icon.is-reverse {
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
  }
  .el-select-dropdown {
    position: absolute;
    transform-origin: center top;
    left: 0; 
    top: 40px;
    width: 215px;
    display:none;
    overflow-x: hidden;
    .check-all-box {
      padding-left: 20px;
      padding-top: 10px;
    }
    .el-select-dropdown__list {
      transition: 0.3s;
      height: 0;
    }
  }

  .el-select-dropdown__item.selected::after {
    position: absolute;
    right: 20px;
    font-family: element-icons;
    content: "\E611";
    font-size: 12px;
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .popper__arrow {
    left: 40px;    
    top: -6px;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #ebeef5;
  }
  .popper__arrow::after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
  }
}
.follow-select-box.follow-select__inner{
  border-color: #409EFF;
}

.show-follow-select {
  .el-select-dropdown {
    display: block;
    .el-select-dropdown__list {
      height: auto;
    }
  }
}



</style>


<template>
  <div class="categorys_box" 
    id="categorys" 
    ref="categorys"
    v-show="categoryIsShow"
    @mouseenter="bindNavMouseenter($event)"
    @mouseleave="bindNavMouseleave($event)"
    >
      <ul  class="lisnav-ul" id="lisnav">
        <li 
          :data-id="item.moduleId" 
          v-for="item in allCategoryLists" 
          :key="item.moduleId"
          class="edit-mode nav-item"
          :class="{active: item.active}"
          @mouseenter="bindCurNavMouseenter($event,item)"
        >
          <h3>
            <a>
              {{item.secondCategoryName}}
            </a>
          </h3>
        </li>
      </ul>

      <div 
        id="subCategorys" 
        ref="subCategorys"  
        class="sub_categorys_box"
        v-show="subMenuIsShow"
        @mouseenter="bindSubNavMouseenter"
        @mouseleave="bindSubNavMouseleave"
      >
        <div 
          :data-id="item.moduleId" 
          class="fullcategory" 
          :class="{none: !item.isShow}"
          v-for="item in subMenulistData" 
          :key="item.moduleId"
        >
          <div class="fullcategory-left">
            <div class="fullcategory-content-box">
              <div 
                class="fullcategory-content"  
                v-for="sub in item.groupCategoryList" 
                :key="sub.groupCategoryId"
              >
                <div class="fullcategory-list">
                  <h4 class="title">
                    {{sub.groupCategoryName}}
                  </h4>
                  <div class="list">
                    <a 
                      :title="threeCategory.threeCategoryName" 
                      v-for="threeCategory in sub.threeCategoryList" 
                      :key="threeCategory.laiGomeCategoryId"
                      @click="bindGoSearchAllCategory({categoryId:threeCategory.laiGomeCategoryId, keyWord: threeCategory.keyWord})"
                    >{{threeCategory.threeCategoryName}}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fullcategory-right" v-if="item.brandCategoryList && item.brandCategoryList.length">
            <ul class="brand-box" 
              v-for="sub in item.brandCategoryList" 
              :key="sub.groupCategoryId"
            >
              <li
                v-for="threeCategory in sub.threeCategoryList" 
                :key="threeCategory.laiGomeCategoryId"
              >
                <img 
                  :src="threeCategory.imageUrl"
                  :title="threeCategory.threeCategoryName"
                  @click="bindGoSearchAllCategory({categoryId:threeCategory.laiGomeCategoryId, keyWord: threeCategory.keyWord})"
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from  'vuex'
import API from '@/api/pushed_list/pushed_list'
import util from  "@/common/util";
export default {
  props: {
    categoryIsShow: Boolean
  },
  created() {
    API.getHomeClassify().then(data => {
      if(!data.code){
        this.allCategoryLists = data.secondCategoryList;
        this._dealAllCategoryList()
      }else {
        this.$message({
          message:data.msg,
          type: 'warning'
        })
      }
    })
    
  },

  data(){
    return {
      allCategoryLists:[],
      subMenulistData: [],

      subMenuIsShow: false,//二级导航是否显示
      mouseInsub: false,//当前鼠标是否在二级菜单里
      mouseTrack: [],
      activeRow: null,//一级菜单对应的行
      timer: null,

    }
  },

  methods: {
    //鼠标移动到一级菜单
    bindNavMouseenter(ev,item) {
      this.subMenuIsShow = true;
      document.addEventListener('mousemove', this.bindDocumentmouseHandler);
    },
    //鼠标离开一级菜单
    bindNavMouseleave(ev,item) {
      this.subMenuIsShow = false;
      if(this.activeRow) {
				this._dealAllCategoryList();
				this.activeRow = null
			}
      this._dealSubData();

      document.removeEventListener('mousemove', this.bindDocumentmouseHandler);
    },

    //具体移入到每个一级菜单
    bindCurNavMouseenter(e) {
      let target = e.target,
          menuId = e.target.dataset.id,
          _this = this;
      if(!this.activeRow) {//第一次移入
        this.activeRow = menuId;
        this._dealAllCategoryList(menuId);
        this._dealSubData(menuId);
				return false;
      }
      this.activeRow = menuId;
      //debounce去抖技术：在事情被频繁触发时，只执行最后一次处理
      if(this.timer) {
				clearTimeout(this.timer)
      }
      
      let currMousePos = this.mouseTrack[this.mouseTrack.length - 1]
			let leftCorner = this.mouseTrack[this.mouseTrack.length - 2]

      let delay = util.needDelay(this.$refs.subCategorys, leftCorner, currMousePos);
      //切换子菜单时，用setTimeout设置延迟
      
      if(delay) {//在三角形内需要延迟
				this.timer = setTimeout(function(){
					if(_this.mouseInsub) {//如果鼠标移入二级菜单里，则不触发下面函数
						return
					}

          _this._dealAllCategoryList(menuId);
          _this._dealSubData(menuId);
          
					_this.timer = null
			  },300)
			}else{//不在三角形内则不需要延迟
				this._dealAllCategoryList(menuId);
        this._dealSubData(menuId);
			}
    },

    bindSubNavMouseenter() {
       this.mouseInsub = true;
    },

    bindSubNavMouseleave() {
      this.mouseInsub = false;
    },

    bindDocumentmouseHandler(e) {
      //跟踪鼠标的移动
      //用鼠标当前位置，和鼠标上一次位置与子菜单上下边缘形成的三角形区域进行比较
      this.mouseTrack.push({
        x: e.pageX,
        y: e.pageY
      })

      if(this.mouseTrack.length > 3) {
        this.mouseTrack.shift()
      }
    },
    
    //全品类搜索
    bindGoSearchAllCategory(data) {
      this.$store.state.skuNoSearchKeyWord = (data.keyWord ? data.keyWord : '');
      this.$emit("allCategorySearch",{categoryId:data.categoryId, keyWord: data.keyWord})
    },
    /* 
     * 如果不传data则需要设置值
     */
    _dealAllCategoryList(id) {
      var subMenulistData = [];
      this.allCategoryLists.forEach(item => {
        if(typeof item.active === 'undefined') {
          this.$set(item, 'active', false);
          var groupCategoryList = [],
              brandCategoryList = [];
          item.groupCategoryList.forEach(list => {
            if(list.brandCategorys == 2) {
              brandCategoryList.push(list);
            }else {
              groupCategoryList.push(list);
            }
          })
          subMenulistData.push({
            moduleId: item.moduleId,
            isShow: false,
            groupCategoryList: groupCategoryList,
            brandCategoryList: brandCategoryList,
          });
        }else {
          item.active = false;
          item.active = (id && id == item.moduleId ? true : false);
        }
      });
      

      if(subMenulistData.length) {
        this.subMenulistData = subMenulistData;
      }

    },
    
    _dealSubData(id) {
      this.subMenulistData.forEach(item => {
        item.isShow = (id && id == item.moduleId ? true : false);
      })
    }

  }
  
}
</script>

<style scoped>
.categorys_box {
  width:200px;
  position:absolute;
  top:32px;
  left:0px;
  z-index:9999;
  min-height: 450px;
  background:rgba(51,51,51,0.7);
}
.categorys_box .lisnav-ul{
    position:relative;
    z-index:9999;
  }
.categorys_box .lisnav-ul li{
  _height:30px;
  _position:relative;
  _overflow:hidden;
}
.categorys_box .lisnav-ul h3{
  position:relative;
  padding-left:15px;
  height:30px;
  line-height:30px;
  width:170px;
  white-space:nowrap;
  overflow:hidden;
  margin-left:1px;
}
.categorys_box .lisnav-ul h3 a{
  color:#fff;
  font-size:14px;
  font-family:'Microsoft YaHei',arial;
  font-weight:200;
  display:inline-block;
  *margin-right:0;
  margin-right:3px
}
.categorys_box .lisnav-ul li.active {
  background: #fbfbfb; 
  margin-left: 1px; 
  width:200px;
  
}
.categorys_box .lisnav-ul li.active h3 a{
  color:#333;
  /* cursor: pointer; */
}
/* .categorys_box .lisnav-ul li.active h3 a:hover{
  color:#f5004b
} */

.categorys_box .lisnav-ul li:first-child,.categorys_box .lisnav-ul li:last-child{
  height:29px;
  line-height:29px;
  overflow: hidden;
}
.categorys_box .lisnav-ul li:first-child{
  margin-top:1px;
}

.sub_categorys_box{
  background-color:#fff;
  min-height :450px;
  border-left:none;
  position:absolute;
  top:0px;
  left:199px;
  z-index:99;
  width:640px;
  background: #fff;
  border: 1px solid #818181;
  box-sizing: border-box;
}

.fullcategory{
  overflow:hidden;
  display: flex;
}
.fullcategory-left{
  flex: 12;
  overflow: hidden;
  padding: 15px 0 15px 15px;
  min-height: 448px;
  background: #fbfbfb;
  box-sizing: border-box;
}
.fullcategory-right{
  background:#fff;
  position:relative;
  flex: 4;
  overflow: hidden;
  min-height: 448px;
  padding: 15px 0 15px 15px;
  box-sizing: border-box;
}
.fullcategory-content-box{
  overflow:hidden;
}
.fullcategory-content-box a:hover,.recommend a:hover{
  color:#f5004b
}



.fullcategory-content{
  overflow:hidden;
}
.fullcategory-list{
  display:-webkit-flex;
  display:flex; 
  margin-bottom: 5px;
  
}

.fullcategory-list a{
  cursor: pointer;
  color:#5e5e5e;
  font-size:12px;
  font-family:Arial,"Microsoft YaHei";
  float:left;
  padding:0 7px;
  height:14px;
  line-height:14px;
  border-left:1px solid #e0e0e0;
  white-space:nowrap;
  display:inline-block;
  margin: 7px 0;
}

.fullcategory-list .title{
  width: 60px;
	-webkit-flex: 0 0 60px;
	flex: 0 0 60px;
  font-family:Arial,"Microsoft YaHei";
  text-align:left;
  margin-top: 2px;
  font-weight:bold;
  font-size:12px;
  color:#5e5e5e;
  height:14px;
  line-height:14px;
  margin: 7px 0;
  }
.fullcategory-list .list{
  -webkit-flex: 1;
  flex: 1;
  border-bottom: solid 1px #f3f3f3;
  padding-bottom: 2px;
}


.brand-box{
  overflow: hidden;
}
.brand-box li {
  float:left;
  margin-bottom: 15px;
  margin-right: 15px;
  width: 60px;
}
.brand-box img{
  display:block;
  width:100%;
  height:35px;
  cursor: pointer;
}

.none {
    display: none;
}


</style>






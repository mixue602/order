<template>
    <div>
		<input type="text" ref="input" :value="value" @input="doThis"  style="display:none"/>
		<el-button class="gcategory-btn" type="text" @click="showDialogTree()">{{selectTip}}&nbsp;></el-button>
		<div class="departmentLists" v-if="checkedTreeItems && checkedTreeItems.length > 0 && checkedTreeItems !='仅查看自己开的单'">
			<b>已选：</b>
			<span v-for="(item, index) in checkedTreeItems" :key="index" :class="index==0 ? 'first' :''">
				，{{item}}
			</span>
		</div>
		<div class="departmentLists" v-else-if="checkedTreeItems =='仅查看自己开的单'">
			<span>已选：仅查看自己开的单</span>
		</div>
		<!--选择品类弹窗 start-->
		<el-dialog class="gcategory-dialog" :title="isDirector ? '查找方式' : '品类'" :visible.sync="dialogTree" @close="closeDialog">
			<el-radio-group v-model="radio1" v-if="isDirector" @change="changeCategory">
				<el-radio :label="3">按品类查单</el-radio>
				<el-radio :label="6">仅查自己开的单</el-radio>
			</el-radio-group>
			<div class="el-dialog__tree">
				<el-tree
				ref="tree"
				class="tree-group__item"
				:data="treeItems"
				show-checkbox
				:props="defaultProps"
				node-key="id"
				disabled="true"
				:default-expanded-keys="[1, 2]"
				:default-checked-keys="checkedTreeKeys"
				>
				</el-tree>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="hideDialogTree">确 定</el-button>
			</span>
		</el-dialog>
    <!--选择品类弹窗 end-->
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-category',
    props:{
	  value: {
        required: true,
      }
    },
    data () {
      return {
		isDirector:this.value.isDirector,//是否是主任 true:是 ；false：否
		categoryCode:this.value.categoryCode,//一级品类id
		selectTip:"请选择(默认全选)",
        radio1:3,
        form: {
		  childStoreCodes: null,
		  isCheckMyself:false,
        },
        treeItems: [],
		checkedTreeItems: [],
        checkedTreeKeys: [1],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        dialogTree: false,
		brandList:[],
		defaultCode:[],
		defaultName:'',		
      }
    },
    created(){
      // 配置环境变量
      var  curhost = location.host;
      this.url = "//"+curhost+"/pcorderview";
	  
  },
    mounted () {
		//初始化数据查询品类
      	this.__queryHierarchy();
    },
    watch: {
		'value':{
			handler(a){
				let that=this;
				if(a.categoryCode=="reset" && this.isDirector){
					that.categoryCode=that.defaultCode;
					that.checkedTreeItems=that.defaultName;					
					this.selectTip = "请选择(默认全选)";
					this.radio1 =3;
					//this.changeCategory();
					this.treeItems[0].disabled = false;
					this.treeItems[0].children.map( (item) => {
						item.disabled = false;
					});
					this.setCheckedKeys();//树形结构恢复默认全选
					this.form.isCheckMyself = false;
					that.doThis();
				}else if(a.categoryCode =="reset"){
					that.categoryCode=null;
					that.checkedTreeItems=[];
					this.setCheckedKeys();//树形结构恢复默认全选
					that.doThis();
					
				};
           		
			},
			deep: true 
      	} 
    },
    methods: {
		closeDialog(){
			if(this.isDirector && this.form.childStoreCodes.length== 0 && this.radio1 == 3){
				this.setCheckedKeys();//树形结构恢复默认全选
				this._quertDirectorCategory();
			}
		},
		doThis(){
			let  that = this;
        	this.$emit('input', {
				categoryCode:this.categoryCode,isCheckMyself:this.form.isCheckMyself});
		},
	  // 主任角色登录时，搜索条件默认加上品类
	  _quertDirectorCategory(){
		this.form.childStoreCodes = [];
		//this.form.category2Code = [];
		let nodes = [];
		let halfNode =[];
		let newnode =[];

		//如果存在只选一个二级品类的时候，将对应的一级品类也返回
		let checkedNodes = [];
	
		this.brandList.forEach((v) => {
			if (v.id && v.id != null) {
				this.form.childStoreCodes.push(v.id);
			}
			if (v.name && v.name != undefined) {
				checkedNodes.push(v.name)
			}
		});
		//将重复的部门过滤
		this.checkedTreeItems = checkedNodes.filter(function(element,index,self){
			return self.indexOf(element) === index;
		});
		if(checkedNodes.length== 0){//什么都不选
			this.selectTip = "请选择";
		}else{
			this.selectTip = "请选择(默认全选)";
		};
		var defaultCode = this.form.childStoreCodes;
		var defaultName = this.checkedTreeItems;
		
		this.defaultCode = defaultCode;
		this.defaultName = defaultName;

		//将获取到的id传给父组件，给查询时使用
		let data = {
			mainCategoryCode: this.form.childStoreCodes.length ? this.form.childStoreCodes : null,
			isCheckMyself:this.form.isCheckMyself
		//	category2Code:this.form.category2Code.join(',')
		};
		this.$emit('changeend',data);
		this.$emit('input', {categoryCode:data.mainCategoryCode,isCheckMyself:this.form.isCheckMyself});
	  },
      //查询品类
      __queryHierarchy() {
        let _this = this;
        //点击弹窗发送请求获取销售部门数据，发送一次请求即可
        //axios.post(_this.url+'/queryUserMultiCateList').then(response => {
        axios.post(_this.url+'/searchBrandOrCategory').then(response => {
          if (response.data.success) {
            const _res = response.data.response;
            _res.forEach( (item) =>{//将一级标记出来
			  item.level="1";
			  item.disabled=false;
            });
            this.brandList =_res;
			if(this.brandList.length >0){
				this.treeItems = [{
					name: '全部选择',
					id: 1,
					children: this.brandList
				}];
			};
			if(this.isDirector){
				this._quertDirectorCategory();
			};
          }
        });
      },
      //获取选择的部门
      getCheckedNodes() {
        //每次打开弹窗先将门店数组置空，选择了门店信息再赋值，避免选择了门店会重复向childStoreCodes添加id的问题
        this.form.childStoreCodes = [];
      //  this.form.category2Code = [];
        let nodes = [];
        let halfNode =[];
        let newnode =[];

        //如果存在只选一个二级品类的时候，将对应的一级品类也返回
        
        if (this.$refs.tree !== undefined) {
          nodes = this.$refs.tree.getCheckedNodes();
	
		  halfNode = this.$refs.tree.getHalfCheckedNodes();
          if(halfNode.length != 0){
            newnode=nodes.concat(halfNode);
          }else{
            newnode=nodes;
          };
        }
        let oThis = this;
        let checkedNodes = [];
       
        newnode.forEach((v) => {
          if(v.level && v.level =='1'){
            if (v.id && v.id != null) {
              oThis.form.childStoreCodes.push(v.id);
            }
		  }
		//   else{
        //     if (v.id && v.id != null && v.name !="全部选择") {
        //       oThis.form.category2Code.push(v.id);
        //     }
        //   };
          if (v.name && v.name != undefined && v.name !="全部选择" && v.level && v.level =='1') {
            checkedNodes.push(v.name)
          }
        });
        //将重复的部门过滤
        this.checkedTreeItems = checkedNodes.filter(function(element,index,self){
          return self.indexOf(element) === index;
		});
      },

      //显示销售部门树型菜单
      showDialogTree () {
        this.dialogTree = true;
      },

      //关闭销售属性树形菜单
      hideDialogTree () {
		this.getCheckedNodes();
		if(this.isDirector && this.form.childStoreCodes.length== 0 && this.radio1 == 3){
			this.$message({
				message: "必须选择一个品类",
				type: 'warning'
			});
			this.dialogTree = true;
		}else if(this.form.childStoreCodes.length== 0){//什么都不选
			this.selectTip = "请选择";
			this.dialogTree = false;
		}else{
			this.selectTip = "请选择(默认全选)";
			this.dialogTree = false;
		};  
        
        
        //将获取到的id传给父组件，给查询时使用
        let data = {
          mainCategoryCode: this.form.childStoreCodes.length ? this.form.childStoreCodes : null,
         // category2Code:this.form.category2Code.join(',')
		};
		if(this.radio1 == 6){
			this.checkedTreeItems ="仅查看自己开的单";
		}
		this.$emit('changeend',data);
		this.$emit('input', {categoryCode:data.mainCategoryCode,isCheckMyself:this.form.isCheckMyself});
      },
      //重置操作之后，通过key设置默认选中项
      setCheckedKeys() {
        let _this = this;
        this.$nextTick(() => {
          _this.$refs.tree && _this.$refs.tree.setCheckedKeys([1]);
        });
	  },
	  //主任仅查自己开的单
		changeCategory(val){
			if(val == 6){
				 this.$refs.tree.setCheckedKeys([]);
				this.treeItems[0].disabled = true;
				this.treeItems[0].children.map( (item) => {
					item.disabled = true;
				});
				
				this.form.isCheckMyself = true;
			}else{
				this.treeItems[0].disabled = false;
				this.treeItems[0].children.map( (item) => {
					item.disabled = false;
				});
				this.form.isCheckMyself = false;
				this.$refs.tree.setCheckedNodes(this.treeItems);
			}
		}
    }
  }
</script>

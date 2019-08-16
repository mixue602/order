<template>
    <div>
		<!-- 区分当前登录账户的类型（总部，大区或者分部还是门店）；门店不展示这个筛选项，总部，大区或者分部要展示，而且还要区分是不是总部的，总部全选要给个标示，不能全部传给后端 ； positionLevel：0是总部，1是大区，2是一级分部，3是二级分部，4门店，5仓库，6售后-->
		<input type="text" ref="input" :value="value" @input="doThis"  style="display:none"/>
		<el-button class="gcategory-btn" type="text" @click="showDialogTree()">{{selectTip}}&nbsp;></el-button>
		<div class="departmentLists" v-if="checkedTreeItems && checkedTreeItems.length > 0">
			<b>已选：</b>
			<span v-for="(item, index) in checkedTreeItems" :key="index" :class="index==0 ? 'first' :''">
				，{{item}}
			</span>
		</div>
		
		<!--选择销售部门弹窗 start-->
		<el-dialog class="gcategory-dialog" title="销售部门" :visible.sync="dialogTree" @close="closeDialog">
			<div class="el-dialog__tree">
				<el-tree
					ref="tree"
					class="tree-group__item"
					:data="treeItems"
					:props="defaultProps"
					node-key="id"
					disabled="true"
					:default-expanded-keys="[1, 2]"
					:default-checked-keys="checkedTreeKeys"	
                    accordion
                    :render-after-expand="true"
                    :highlight-current="true"
                    @node-expand="nodeExpand"	
                    @node-collapse="nodeCollapse"	
                    :render-content="renderfunction"
                    @node-click="nodeClick"
				>
				</el-tree>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" type="primary" @click="hideDialogTree">确 定</el-button>
			</span>
		</el-dialog>
    <!--选择销售部门弹窗 end-->
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-branch',
    props:{
	  value: {
        required: true,
      }
    },
    data () {
      	return {
			//isDirector:this.value.isDirector,//是否是主任 true:是 ；false：否
			storeCodes:this.value.storeCodes,//一级品类id
			selectTip:"请选择",
			radio1:3,
			form: {
				childStoreCodes: null,
			},
			treeItems: [],
			checkedTreeItems: [],
			checkedTreeKeys: [],
			defaultProps: {
                label: 'name',
                children: 'organizations'
			},
			dialogTree: false,
			dialogTreehide: false,
			branchList:[],	
			isall:true,//是否全选
			defauleshow:1,//是否展示插件，根据账户角色看， positionLevel：0是总部，1是大区，2是一级分部，3是二级分部，4门店，5仓库，6售后；4，5，6不展示
			istotal:false,//是否是总部,
            radio:"",
			radioName:"",
			defaultName:[],
      	}
    },
    created(){
		// 配置环境变量
		var  curhost = location.host;
		this.url = "//"+curhost+"/pcorderview";
		this.__queryHierarchy();
  	},
    // mounted () {
	// 	//初始化数据查询品类
    //   	this.__queryHierarchy();
    // },
    watch: {
		'value':{
			handler(a){
				let that=this;
				if(a.storeCodes =="reset"){
					that.isall=true;
					that.checkedTreeItems=that.defaultName;	
					that.form.childStoreCodes=that.defaultCode;
					//this.setCheckedKeys();//树形结构恢复默认全选
					let radioArr = document.getElementsByName("storeId");
					radioArr.forEach((item)=>{//取消单选框的选择
						item.checked = false;
					});
					this.radioName ="";
					this.radio = "";
					that.doThis();					
				};
			},
			deep: true 
      	} 
    },
    methods: {
		doThis(){
			let  that = this;
        	that.$emit('input', {storeCodes:this.form.childStoreCodes,isdata:this.defauleshow,isall:this.isall,istotal:this.istotal});
		},
      	//查询销售部门
      	__queryHierarchy() {
			let _this = this;
			//点击弹窗发送请求获取销售部门数据，发送一次请求即可
			//axios.post(_this.url+'/queryUserMultiCateList').then(response => {
			axios.post(_this.url+'/SearchOrganizationStructure').then(response => {
				if (response.data.success) {
					const _res = response.data.response;
					if((_res.positionLevel && _res.positionLevel==4) || (_res.positionLevel && _res.positionLevel==5) ||(_res.positionLevel && _res.positionLevel==6) ||(_res.positionLevel==null)){//0总部,1大区,2一级分部，3二级分部;4门店，5仓库，6售后
						_this.defauleshow = 0;//没权限
					};
					if((_res.positionLevel && _res.positionLevel==0)){//总部账户
						this.istotal = true;
					}
					_res.organizations.forEach( (item) =>{//将一级标记出来
						item.level="1";
						item.disabled=false;
					});
					this.branchList =_res.organizations;
					if(this.branchList.length>0){
						this.treeItems = this.branchList;
						
					};
					
					_this.doThis(); //推给父组件
				}
			});
		},

      //获取选择的部门
      	getCheckedNodes() {
			this.form.childStoreCodes = this.radio;
			if(this.radioName){
				this.checkedTreeItems = [this.radioName]
			} 
		},

		//显示销售部门树型菜单
		showDialogTree () {
			this.dialogTree = true;
		},

		//关闭销售属性树形菜单
		hideDialogTree () {
			this.dialogTree = false;
			this.getCheckedNodes();

			if(this.form.childStoreCodes.length== 0){
				this.$message({
					message: "请至少选择一个门店",
					type: 'warning'
				});
				this.dialogTree = true;
				return false;
			}
			
			//将获取到的id传给父组件，给查询时使用
			let data = {
				storeCodes: this.form.childStoreCodes,
			};
			this.$emit('changeend',data);
			this.doThis();	
		},
		//重置操作之后，通过key设置默认选中项
		setCheckedKeys() {
			let _this = this;
			this.$nextTick(() => {
				_this.$refs.tree && _this.$refs.tree.setCheckedKeys([1]);
			});
		},
		closeDialog(){
			if(this.form.childStoreCodes && this.form.childStoreCodes.length== 0){
				this.setCheckedKeys();//树形结构恢复默认全选
				this._quertdefaultBranch();
			}
        },
        nodeClick(data,node,ev){

            let classParent = ev.$el.className;
            classParent +='current_expande_node';
            ev.$el.className = classParent;
        },
        nodeExpand(data,node,ev){
            console.log(ev)
            this.$nextTick(() => {
                // let anodeExpand = document.querySelectorAll('.k_tree_nodeExpande_active');
                // console.log(anodeExpand.length)

                // anodeExpand.forEach((item)=>{
                //     let cs = item.className.replace(/k_tree_nodeExpande_active/g,'');
                //     console.log(cs)
                //     item.className = cs;
                // })
                let classChild =  ev.$el.firstChild.className;
                classChild += ' k_tree_nodeExpande_active';
                ev.$el.firstChild.className = classChild;
            })   
        },
        nodeCollapse(data,node,ev){
            let classS =  ev.$el.firstChild.className;
            classS = ev.$el.firstChild.className.replace(/k_tree_nodeExpande_active/g,'');
            ev.$el.firstChild.className = 'el-tree-node__content';
        },
        renderfunction(h, { node, data, store }){
            if(data.lastStage){
                return (
                <span class="custom-tree-node">
                    <label><input on-click={ () => this.getRadioVal(node,data)} class="treeRadio" type="radio" name="storeId" value="{data.id}" id="{data.id}" />{data.name}</label>
                </span>
                );
            }else{
                return (<span>{node.label}</span>);
            } 
        },
        getRadioVal(node,data){
             this.radio = data.id;
             this.radioName = data.name;
        }
    }
  }
</script>
<style>
    .k_tree_last_node_active{
        color:#409EFF;
    }
    .is-current > .k_tree_nodeExpande_active,.is-expanded > .k_tree_nodeExpande_active{
        color:#409EFF
    }
    .treeRadio{
        vertical-align: -2px;
        margin-right:5px;
    }
</style>

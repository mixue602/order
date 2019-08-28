<template>
    <div>

			<input type="text" ref="input" :value="value" @input="doThis"  style="display:none"/>
			<el-button class="gcategory-btn" type="text" @click="showDialogTree()">{{selectTip}}&nbsp;></el-button>
			<div class="departmentLists" v-if="checkedTreeItems && checkedTreeItems.length > 0">
				<b>已选：</b>
				<em v-for="(item, index) in checkedTreeItems" :key="index" :class="index==0 ? 'first' :''">
					，{{item}}
				</em>
			</div>
			<!--选择销售部门弹窗 start-->
			<el-dialog class="gcategory-dialog" title="销售部门" :visible.sync="dialogTree">
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
						:render-content="renderContent"
						:default-checked-keys="checkedTreeKeys"
						@check-change="bindCheckChange"
						@check="bindCheck"
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
    name: 'g-stores',
    props:{
			value: {
				required: true,
			},
			isMutex: {
				type: Boolean,
				default: false,
			},
			partUrl: String
    },
    data () {
      	return {
					// storeCodes:this.value.storeCodes,//一级品类id
					selectTip:"请选择",
					form: {
						childStoreCodes: [],
					},
					treeItems: [],
					checkedTreeItems: [],
					defaultProps: {
						label: 'name',
						children: 'children'
					},
					dialogTree: false,
					branchList:[],
					checkedAll: false,//如果是isMutex为true，且全部选中则为true,否则为false
					curTopLevelId: 0,//当前已选择的1级
      	}
		},
		computed: {
			checkedTreeKeys() {
				return this.isMutex ? null : [1];
			}
		},
    created(){
			// 配置环境变量
			var  curhost = location.host;
			this.url = "//"+curhost+"/laigoaccess";
			this.__queryHierarchy();
  	},
    
    watch: {
			'value':{
				handler(a){
					let that=this;
					if(a.storeCodes =="reset"){
						that.checkedTreeItems=[];
						that.checkedAll = false;
						that.form.childStoreCodes = [];
						this.curTopLevelId = 0;
						that.setCheckedKeys();//树形结构恢复默认全选
					};
           		
				},
				deep: true 
    	} 
    },
    methods: {
			doThis(){
				let  that = this;
				that.$emit('input', {storeCodes:this.form.childStoreCodes,checkedAll: this.checkedAll});
			},

			//查询销售部门
			__queryHierarchy() {
				let _this = this;
				//点击弹窗发送请求获取销售部门数据，发送一次请求即可
				axios.post(_this.url+this.partUrl).then(data => {
					let res = data.data;
					if (res.success) {
						const response = res.response;
						this.branchList = response;
						this.treeItems = [{
							name: '全部选择',
							id: 1,
							all:1,
							children: this.branchList
						}];
				
						_this.doThis(); //推给父组件
					}else {
						this.$message({
						message: res.respMsg,
						type: 'warning'
					})
					}

				});
			},
      //获取选择的部门
			getCheckedNodes() {
				//每次打开弹窗先将门店数组置空，选择了门店信息再赋值，避免选择了门店会重复向childStoreCodes添加id的问题
				this.form.childStoreCodes = [];
				let nodes = [];

				//如果存在只选一个二级品类的时候，将对应的一级品类也返回
		
				if (this.$refs.tree !== undefined) {
					nodes = this.$refs.tree.getCheckedNodes();
				};

				let oThis = this;
				let checkedNodes = [];
				oThis.checkedAll = false;
				nodes.forEach((v) => {
					if(v.all == 1 && oThis.isMutex) {
						oThis.checkedAll = true;
					}
					if(v.level == 4) {
						if (v.id && v.id != null) {
							oThis.form.childStoreCodes.push(v.id);
						}
						if (v.name && v.name != undefined) {
							checkedNodes.push(v.name)
						}
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
				this.dialogTree = false;
				this.getCheckedNodes();
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
					let keys = this.isMutex ? [] : [1];
					_this.$refs.tree && _this.$refs.tree.setCheckedKeys(keys);
					_this.doThis();	
				});
			},
				getTopLevelId(node) {//获取1级id
					const data = node.data;
					if(!node.data.level) {
						return '';
					}
					if(node.data.level == 1) {
						return node.data.id;
					}
					if(node.data.topLevelId) {
						return node.data.topLevelId;
					}
			},
			renderContent(h, { node, data, store }) {
				var topLevelId = this.getTopLevelId(node);
				this.$set(data, 'topLevelId', topLevelId);
				if(data.children) {
					data.children.forEach((item) => {
						this.$set(item, 'topLevelId', topLevelId);
					})
				}
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>);
      },
			//bindCheckChange,bindCheck函数是为了实现选择一级时互斥
			bindCheckChange(data,checked) {
				
			},
			bindCheck(data1,data2) {
				
				if(!this.isMutex) {return false;}
				const topLevelId = data1.topLevelId;
				if(data1.level == 1 && topLevelId != this.curTopLevelId) {
					this.$refs.tree.setCheckedNodes([data1]);
				}else {

					if(this.curTopLevelId == topLevelId ) {
					}else {
						this.$refs.tree.setCheckedNodes([data1]);
					}
				}

				
				this.curTopLevelId = topLevelId;
			}
		},

	
	
		
  }
</script>



<style  lang="stylus" scoped>
	.departmentLists {
		color: #606266;
		em {
			font-style: normal;
		}
		.first {
			padding-left: 30px;
		}
	}
</style>

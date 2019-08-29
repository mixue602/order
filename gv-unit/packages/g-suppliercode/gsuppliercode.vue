<template>
    <div>
		<el-input style="width:200px" :class="{iserror:inputisError}" placeholder="请输入供应商编码" @change="doThis()" v-model.trim="form.supplierCode"></el-input>
        <div class="el-form-item__error" v-if="inputisError">请输入数字或字母</div>
		<el-button type="text" @click="showDialog()">查看供应商编码</el-button>	
		<!--查询品牌编码弹窗 start-->
		<el-dialog title="查询供应商编码" :visible.sync="dialogsupplierCode" class="gbrandcode-dialog">
			<el-form :inline="true" :model="formBrand" ref="formBrand" :rules="rulesFormBrand" size="mini" @submit.native.prevent>
				<el-form-item label="供应商编码或名称" prop="supplierCodeOrName">
					<el-input v-model="formBrand.supplierCodeOrName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" native-type="submit"
							:loading="formBrand.loading"
							@click="getSupplierCodeLists('formBrand')">查询
					</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="SupplierCodeLists" v-loading="formBrand.loading" @row-click="checkedFormSupplier">
				<el-table-column property="supplierCode" label="供应商编码" width="200"></el-table-column>
				<el-table-column property="supplierName" label="供应商" width="200"></el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChangeByBrandCode"
				background
				:current-page="formBrand.page.currentPage"
				:page-size="formBrand.page.pageSize"
				v-if="formBrand.page.totalPage>1"
				layout="total, prev, pager, next"
				:total="formBrand.page.totalPage">
			</el-pagination>
		</el-dialog>
      <!--查询品牌编码弹窗 end-->
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'g-suppliercode',
    props:{
		value: {
			required: true,
		}
    },
    data () {
		return {
			inputisError:false,
			formBrand: {
				page: {
				currentPage: 1,
				pageSize: 10,
				totalPage: 1
				}
			},
			rulesFormBrand: {
			supplierCodeOrName: [
				{required: true, message: "请输入", trigger: "blur"}
			]
			},
			form:{
				supplierCode: this.value.value, //品牌
			},
			dialogsupplierCode:false,
			SupplierCodeLists:[],
		}
    },
    created(){
		// 配置环境变量
		var  curhost = location.host;
		this.url = "//"+curhost+"/pcatpview";
	  
  },
    mounted () {
    },
    watch: {
		'value':{
			handler(val){
				let that=this;
				if(val.value =="reset"){
					that.form.supplierCode = '';
					that.doThis();
				}
			},
			deep: true 
      	} 
    },
    methods: {
		_initFormBrand() {
			this.SupplierCodeLists = [];
			this.formBrand.supplierCodeOrName = "";
			this.formBrand.loading = false;
			this.formBrand.page = {
				currentPage: 1,
				pageSize: 10,
				totalPage: 1
			};
		},
		showDialog(type) {
			this._initFormBrand();
			this.dialogsupplierCode = true;
		},
		//查询品牌编码列表
		getSupplierCodeLists(formBrand) {
			this.$refs[formBrand].validate(valid => {
				if (valid) {
					this.formBrand.page.currentPage = 1;
					this.__getSupplierCodeLists();
				}
			});
		},

		//查询品牌编码列表
		__getSupplierCodeLists() {
			this.formBrand.loading = true;
			const _this = this;
			let	requestPara = {
					supplierCodeOrName: this.formBrand.supplierCodeOrName,
					currentPage: this.formBrand.page.currentPage,
					pageSize: this.formBrand.page.pageSize
				};
			axios.post(_this.url+'/querySupplierList',requestPara).then(response => {
				_this.formBrand.loading = false;
				if (response.data.success) {
					if (response.data.response) {
						const _res = response.data.response;
						_this.formBrand.page = {
							currentPage: _res.pager.currentPage,
							pageSize: _res.pager.pageSize,
							totalPage: _res.pager.totalSize
						};
						_this.SupplierCodeLists = _res.list || [];
					}
				} else {
					_this.formBrand.loading = false;
					_this.SupplierCodeLists = [];
				}
			});
      	},
		
		//品牌弹窗的页面点击事件
		handleCurrentChangeByBrandCode(val) {
			this.formBrand.page.currentPage = val;
			this.__getSupplierCodeLists();
		},
		//关闭品牌弹窗
		checkedFormSupplier(row) {
			this.dialogsupplierCode = false;
			this.form.supplierCode = row.supplierCode;
			this.doThis(); //推给父组件

		},
		doThis() {//推给父组件
			var newRegex = /^[0-9a-zA-Z]*$/g;
			if (!newRegex.test(this.form.supplierCode)) {
				this.inputisError = true;
				this.$emit('input', {value:'',isError:true});
				this.$emit("changeend",{supplierCode:''});
				return false;	
			}else{
				this.inputisError = false;
				this.$emit('input', {value:this.form.supplierCode,});
				this.$emit("changeend",{supplierCode:this.form.supplierCode});
			}
		},
    }
  }
</script>

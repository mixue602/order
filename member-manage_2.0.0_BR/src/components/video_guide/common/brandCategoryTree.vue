<template>
  <el-row class="input-group">
    <el-form-item label="品牌品类：">
      <el-button type="text" @click="showDialogTree()">请选择(默认全选)&nbsp;></el-button>
      <div class="departmentLists" v-if="checkedTreeItems && checkedTreeItems.length > 0">
          <span v-for="(item, index) in checkedTreeItems" :key="index">
            <span v-if="index>0">，</span>{{item}}
          </span>
      </div>
    </el-form-item>
    
    <el-dialog title="品类" :visible.sync="dialogTree">
      <div class="el-dialog__tree">
        <el-tree
          ref="tree"
          class="tree-group__item"
          :data="treeItems"
          show-checkbox
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[1, 2]"
          :default-checked-keys="checkedTreeKeys"
          >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="hideDialogTree">确 定</el-button>
        </span>
    </el-dialog>

  </el-row>
</template>

<script>
  import API from '@/api/api_videoGuide/videoGuide'
  export default {
    data () {
      return {
        form: {
          salesOrgCode: '',
          storeCode: '',
          childStoreCodes: [],
          childRegioneIds: [],
          childBranchId1s: [],
          childBranchId2s: [],
          category2Code:[]
        },
        filterText: '',
        treeItems: [],
        checkedTreeItems: [],
        checkedTreeKeys: [1],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        dialogTree: false,
        positionLevel: 5,
        hasFilterText: false,
        brandList:[],
        childrenLen:0
      }
    },
    created() {
      this.__queryBrandCategory();
      this.hideDialogTree();
    },
    mounted () {
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
        this.$refs.tree.setCheckedKeys([0])
      }
    },
    methods: {
      //查询品牌品类
      __queryBrandCategory() {
        let _this = this;
        //点击弹窗发送请求获取品牌品类数据，发送一次请求即可
        API.getBrandCategory().then(response => {
          if (response) {
            const _res = response.response;
            let num =0;
            _res.forEach( (item) =>{//将一级标记出来
              item.level="1";
              if(item['children'].length){
                item['children'].forEach(v =>{
                  v.parentId = item.id
                })
              }
            });

            this.brandList =_res;
            this.treeItems = [{
              name: '全部选择',
              id: 1,
              children: this.brandList
            }];
          }
        });
      },
      //获取选择的部门
      getCheckedNodes() {
        //每次打开弹窗先将数组置空，选择了再赋值，避免选择了会重复向childStoreCodes添加id的问题
        this.form.childStoreCodes = [];
        this.form.category2Code = [];
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
          }else{
            if (v.id && v.id != null && v.name !="全部选择") {
              oThis.form.category2Code.push(v.parentId + '_' + v.id);
            }
          }; 
          if (v.name && v.name != undefined && v.name !="全部选择" && v.level && v.level =='1') {
            checkedNodes.push(v.name)
          }
        });
        //将重复的过滤
        this.checkedTreeItems = checkedNodes.filter(function(element,index,self){
          return self.indexOf(element) === index;
        });
      },

      //显示树型菜单
      showDialogTree () {
        this.dialogTree = true;
      },

      //关闭树形菜单
      hideDialogTree () {
        this.dialogTree = false;
        this.getCheckedNodes();
        //将获取到的id传给父组件，给查询时使用
        let data = {
          mainCategoryCode: this.form.childStoreCodes.join(','),
          category2Code:this.form.category2Code.join(',')
        };
        if( this.childrenLen == this.form.category2Code.length){
          data = {
            mainCategoryCode:'',
            category2Code:''
          }
        }
        // console.log(data);
        // console.log('111111111111111')
        this.$emit('getBrandId',data);
      },
      //重置操作之后，通过key设置默认选中项
      setCheckedKeys() {
        let _this = this;
        this.$nextTick(() => {
          _this.$refs.tree && _this.$refs.tree.setCheckedKeys([1]);
        });
      },
    }
  }
</script>
<style>
  .el-form-item{
    margin-bottom: 0;
  }
</style>
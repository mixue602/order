import gBranch from './gbranch.vue'  
gBranch.install = function(Vue) {
  Vue.component(gBranch.name, gBranch);
};

export default gBranch;
import gCategory from './gcategory.vue'  
gCategory.install = function(Vue) {
  Vue.component(gCategory.name, gCategory);
};

export default gCategory;
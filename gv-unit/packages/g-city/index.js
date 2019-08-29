import gCity from './gcity.vue'  
gCity.install = function(Vue) {
  Vue.component(gCity.name, gCity);
};

export default gCity;
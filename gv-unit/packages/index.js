/*
* @author chenhaiyong
* Date: 18/12/25
*/
import Vue from 'vue'
import Gdelivery from './g-delivery/index'
import Gcity from './g-city/index'
import Gheader from './g-header/index'
import Gcloseshop from './g-closeshop/index'
import Gcategory from './g-category/index'
import Gbrandcode from './g-brandcode/index'
import Gsuppliercode from './g-suppliercode/index'
import Gbranch from './g-branch/index'
import gCardnumber from './g-cardnumber/index'
import gSellerno from './g-sellerno/index'

const components = [
  Gdelivery,
  Gcity,
  Gheader,
  Gcloseshop,
  Gcategory,
  Gbrandcode,
  Gsuppliercode,
  Gbranch,
  gCardnumber,
  gSellerno
]


const install = function(Vue) {
  if(install.installed) return
  components.map(component => Vue.component(component.name, component))
}


export default {
  install,
  Gdelivery,
  Gcity,
  Gheader,
  Gcloseshop,
  Gcategory,
  Gbrandcode,
  Gsuppliercode,
  Gbranch,
  gCardnumber,
  gSellerno
}
<template>
	<div>
		<ul class="citylist">
			<li v-for="item in cityList" :key="item.id" class="itemWarp" @click="handelChangeCity(item.name)">
				<div class="button">{{item.name}}</div>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	data(){
		return {
			cityList:[
				{
					name: '北京',
					id: '001'
				},{
					name: '上海',
					id: '002'
				},{
					name: '成都',
					id: '003'
				},{
					name: '河北',
					id: '004'
				}
			]
		}
	},
	methods:{
		handelChangeCity(city){
			this.$store.dispatch('changecity',city)
			//this.$store.commit('changecity',city)
		}
	}
}
</script>
<style lang="stylus" scoped>
	.citylist
		padding:.625rem
		line-height:1.5rem
		margin-top:.9375rem
		overflow:hidden
		.itemWarp
			float:left
			width:33.33%
			.button
				margin:.3125rem
				padding:.3125rem 0
				text-align: center
				border:.0625rem solid #cccccc
				border-radius:.1875rem
</style>


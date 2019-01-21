<template>
  <div class="icons">
		<swiper :options="swiperOption" ref="mySwiper">
			<swiper-slide v-for="(page, index) of pages" :key="index">
				<div class="icon" v-for="item of page" :key="item.id">
					<div class="icon-img">
						<img class="icon-imgcontent" :src="item.imgUrl">
					</div>
					<p class="icon-desc">{{item.desc}}</p>
				</div>
			</swiper-slide>
		</swiper>
  </div>
</template>
<script>
export default {
	name: 'homeicons',
	data () {
		return {
			swiperOption: {
        		autoplay: false
    		},
			iconList:[
				{
					id: '001',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/94/69fc1e0519b438.png',
					desc: '景点名片'
				}, {
					id: '002',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/e8/4cd2c0ed60852c.png',
					desc: '价格趋势'
				}, {
					id: '003',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/a9/d56922c19382d2.png',
					desc: '降价提醒'
				}, {
					id: '004',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/f3/974b4f7d853373.png',
					desc: '航班动态'
				}, {
					id: '005',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/94/69fc1e0519b438.png',
					desc: '景点名片'
				}, {
					id: '006',
					imgUrl: '//imgs.qunarzz.com/ftejia/1808/9f/7dee8ce27990a3.png',
					desc: '景点名片'
				}, {
					id: '007',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/94/69fc1e0519b438.png',
					desc: '值机选座'
				}, {
					id: '008',
					imgUrl: '//imgs.qunarzz.com/p/p50/1807/90/3a666bd399ef1702.png',
					desc: '景点名片'
				}, {
					id: '009',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/94/69fc1e0519b438.png',
					desc: '景点名片'
				}, {
					id: '010',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/e8/4cd2c0ed60852c.png',
					desc: '价格趋势'
				}, {
					id: '011',
					imgUrl: '//imgs.qunarzz.com/ftejia/1806/a9/d56922c19382d2.png',
					desc: '降价提醒'
				}, {
					id: '012',
					imgUrl: '//imgs.qunarzz.com/p/p43/1809/6c/3e234ee3d0e4d202.png',
					desc: '航班动态'
				}, {
					id: '005',
					imgUrl: '//imgs.qunarzz.com/p/p38/1808/97/9712cb6de73ab002.png',
					desc: '景点名片'
				}, {
					id: '013',
					imgUrl: '//imgs.qunarzz.com/p/p72/1807/d1/af2b13f722102102.png',
					desc: '景点名片'
				}, {
					id: '014',
					imgUrl: '//imgs.qunarzz.com/p/p76/1807/d3/deed21920118002.png',
					desc: '值机选座'
				}, {
					id: '015',
					imgUrl: '//imgs.qunarzz.com/p/p63/1808/60/ba0c87b2fe884102.png',
					desc: '景点名片'
				}
			]
    	}
  	},
	computed: {
		pages () {
			const pages = []
			this.iconList.forEach((item, index) => {
				const page = Math.floor(index / 8)
				if (!pages[page]) {
					pages[page] = []
				}
				pages[page].push(item)
			})
			return pages
		}
	}
}
</script>
<style lang="stylus" scoped>
	@import '../../../assets/styles/varibles.styl'
	@import '../../../assets/styles/mixins.styl'
	.icons >>> .swiper-container
		height: 0
		padding-bottom: 50%
	.icon
		position: relative
		overflow:hidden
		float: left
		width: 25%
		height: 0
		padding-bottom: 25.6%
		.icon-img
			position: absolute
			top: 0
			left: 0
			right: 0
			bottom: 1.375rem
			box-sizing: border-box
			padding: .3125rem
			.icon-imgcontent
				display: block
				margin: 0 auto
				height: 100%
		.icon-desc
			position: absolute
			left: 0
			right: 0
			bottom: 0
			line-height: 1.375rem
			color: $darkTextvolor
			text-align: center
      ellipsis()
</style>

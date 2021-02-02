<template>
	<swiper v-if="imgs.length" class="swiper" indicator-dots autoplay :interval="interval" circular>
		<swiper-item v-for="(item,index) in imgs" :key="index">
				<u-image width="100%" height="320"lazy-load mode="scaleToFill" :src="item"></u-image>
		</swiper-item>
	</swiper>
</template>

<script>
	export default{
		props:{
			interval:{
				type:Number,
				default:3000
			},
			imgs:{
				type:[Array],
				default:()=>[]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 320rpx;
		.img {
			height: 320rpx;
			width: 100%;
		}
	}
</style>

<template>
	<view class="sub-menus" :style="{ height: height }">
		<template v-for="(item, $index) in menu">
			<view class="sub-menus-list" :key="$index" @click="goToPage(item.url)">
				<jd-avatar :src="item[objKeys.img]" size="80"></jd-avatar>
				<view class="text1" :style="{fontSize:titleSize+'rpx'}">{{ item[objKeys.title]}}</view>
				<view class="text2" :style="{fontSize:subTitleSize+'rpx'}">{{ item[objKeys.des] }}</view>
			</view>
		</template>
	</view>
</template>

<script>
	import JdAvatar from '@/customComponents/jd-avatar/index.vue';
	export default {
		name: 'home-sub-menus',
		components:{
			JdAvatar
		},
		props: {
			menu: {
				type: Array,
				default: () => []
			},
			objKeys:{
				type: Object,
				default: () =>{
					return{
						img:'img',
						title:'title',
						des:'des',
						url:'url'
					}
				}
			},
			titleSize:{
				type: String,
				default:'28'
			},
			subTitleSize:{
				type: String,
				default:'24'
			},
			height: {
				type: String,
				default: '100%'
			}
		},
		methods:{
			goToPage(url){
				this.$emit('click',url)
			}
		}
	};
</script>
<style lang="scss" scoped>
	.sub-menus {
		display: flex;
		.sub-menus-list {
			flex: 1;
			text-align: center;
			.text1 {
				color: $text-color;
				margin-top:6rpx;
			}
			.text2{
				margin-top:6rpx;
				color: $text-color-grey;
			}
		}
	}
</style>

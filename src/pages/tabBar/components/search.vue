<template>
	<view class="search" @click="search" :style="{backgroundColor:backgroundColor,borderRadius:borderRadius+'rpx',height:height+'rpx'}">
		<uni-icons :color="color" :iconSize="iconSize" type="search" />
		<view class="placeholder" :style="{color:color}">搜索科室/医生/疾病/症状</view>
	</view>
</template>
<script>
export default {
	name: 'home-search',
	props: {
		placeholder: {
			type: String,
			default: '搜索科室/医生/疾病/症状'
		},
		color:{
			type: String,
			default: '#fff'
		},
		backgroundColor:{
			type: String,
			default:'#F4F4F4'
		},
		borderRadius:{
			type: String,
			default: '30'
		},
		height:{
			type: String,
			default: '60'
		},
		iconSize:{
			type: String,
			default:'24'
		}
	},
	methods:{
		search(){
			this.$emit('click')
		}
	}
};
</script>

<style scoped lang="scss">
.search {
	flex: 1;display: flex;box-sizing: border-box;align-items: center;padding: 0 20rpx;
	.placeholder{
		display: flex;
		align-items: center;
		margin-left: 10rpx;
		font-size: $font-s-sm;
		height:100%;
	}
}
</style>

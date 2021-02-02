<template>
	<view class="card" @click="clickCard" :style="{height:cardHeight+'rpx',borderBottom:cardBorder}">
		<view class="title" :class="titleClass">
			<slot name="prefix"></slot>
			<view v-if="title" :style="{fontSize:titleSize+'rpx',color:titleColor}">{{ title }}</view>
		</view>
		<view class="des" @click="clickView" :class="viewClass">
			<view v-if="view">{{ view }}</view>
			<slot name="suffix"></slot>
			<u-icon v-if="iconType" :name="iconType" :color="iconColor" :size="iconSize"></u-icon>
		</view>
	</view>
</template>

<script>
export default {
	name: 'card',
	props: {
		title: {
			type:String,
			default: ''
		},
		view: {
			type: String,
			default: ''
		},
		iconType: {
			type: String,
			default: 'arrow-right'
		},
		iconSize: {
			type: String,
			default: '20'
		},
		iconColor: {
			type: String,
			default: '#999999'
		},
		titleClass: {
			type: String,
			default: ''
		},
		viewClass: {
			type: String,
			default: ''
		},
		titleSize:{
			type: String,
			default:'32'
		},
		titleColor:{
			type: String,
			default:'#333'
		},
		cardHeight:{
			type: String|Number,
			default:'90'
		},
		cardBorder:{
			type: String,
			default:'none'
		}
	},
	methods: {
		clickView() {
			this.$emit('clickCard');
		},
		clickCard(){
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss" scoped>
.card {
	width: 100%;display: flex;justify-content: space-between;
	align-items:center;//line-height: 90rpx;
	.title {
		display: flex;
		font-size:$font-s-lg;
	}
	.des {
		display: flex;
		font-size:$font-s-base;
		color: #999;
	}
}
</style>

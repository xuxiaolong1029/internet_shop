<template>
    <view class="jd-cell-item" @click="clickItem" :style="itemStyle">
		<slot name="icon"></slot>
        <view class="ci-title" :style="titleStyle" v-if="title">{{title}}</view>
        <view class="ci-value" :style="valueStyle">{{value}}</view>
        <view class="ci-arrow" v-if="showArrow">
        	<u-icon name="arrow-right" :color="arrowColor" size="28"></u-icon>
        </view>
		<slot name="option"></slot>
    </view>
</template>

<script>
    export default {
        name: "jdCellItem",
        props:{
			showArrow:{	//是否显示箭头
				type: Boolean,
				default: true
			},
			arrowColor:{	//箭头颜色
				type: String,
				default: '#D9D9D9'
			},
			title:{
				type: String,
				default: ''
			},
			value:{
				type: String,
				default: ''
			},
			index:{
				type: String,
				default: ''
			},
			titleStyle:{
				type: Object,
				default: () => {}
			},
			valueStyle:{
				type: Object,
				default: () => {}
			},
			itemStyle:{
				type: Object,
				default: () => {}
			}
        },
		methods: {
			clickItem(){
				this.$emit('clickItem',this.index)
			}
		}
    }
</script>

<style lang="scss" scoped>
    .jd-cell-item{
		display: flex;
		padding: 30rpx;
		height: 88rpx;
		align-items: center;
		box-sizing: border-box;
		overflow: hidden;
		/* & + .jd-cell-item{
			border-top: 1rpx solid $line;
		} */
		.ci-title{
			font-size: $font-s-base;
			color: $text-color-grey;
			width: 190rpx;
			flex-wrap: 0;
			flex-shrink: 0;
			padding-right: 20rpx;
		}
		.ci-value{
			font-size: $font-s-base;
			color: $text-color;
			flex: 1;
			text-align: right;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.ci-arrow{
			height: 28rpx;
			margin-left: 2rpx;
			margin-right: -8rpx;
			width: 30rpx;
			flex-wrap: 0;
			flex-shrink: 0;
		}
	}
</style>

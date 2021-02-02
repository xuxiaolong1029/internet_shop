<template>
    <view class="cell-item" @click="clickItem" :style="itemStyle">
        <view class="ci-label">
			<view class="ci-title" :style="titleStyle" v-if="title">{{title}}</view>
			<slot name="label"></slot>
		</view>
        <view class="ci-right" >
        	<view class="ci-value" :style="valueStyle">{{value}}</view>
			<view class="ci-arrow" v-if="arrow">
				<u-icon name="arrow-right" :color="arrowColor" size="28"></u-icon>
			</view>
        </view>

    </view>
</template>

<script>
    export default {
        name: "jdCellItem",
        props:{
			arrow:{	//是否显示右箭头
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
    .cell-item{
		display: flex;
		padding: 30rpx;
		height: 88rpx;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
		.ci-label{
			flex: 1;
			display: flex;
			align-items: center;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-text-overflow: ellipsis;
			-moz-text-overflow: ellipsis;
			white-space: nowrap;
		}
		.ci-title{
			max-width: calc(100% - 110rpx);
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-text-overflow: ellipsis;
			-moz-text-overflow: ellipsis;
			white-space: nowrap;
			font-size: $font-s-base;
			color: $text-color;
			margin-right: 10rpx;
		}
		.ci-right{
			width: 186rpx;
			flex-grow: 0;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.ci-value{
				font-size: $font-s-base;
				color: $text-color-money;
				text-align: right;
				white-space: nowrap;
			}
		}
		.ci-arrow{
			height: 28rpx;
			line-height: 28rpx;
			margin-left: 2rpx;
			margin-right: -8rpx;
			width: 30rpx;
			flex-wrap: 0;
			flex-shrink: 0;
		}
	}
</style>

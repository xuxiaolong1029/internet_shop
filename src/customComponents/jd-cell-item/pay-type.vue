<template>
    <view class="jd-cell-item" @click="clickItem" :style="itemStyle">
		<view class="icon-box"><slot name="icon"></slot></view>
        <view class="ci-label">
			<view class="ci-title" :style="titleStyle" v-if="title">{{title}}</view>
			<slot name="label"></slot>
		</view>
        <view class="ci-right" >
        	<slot name="button"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        name: "jdCellItem",
        props:{
			showIcon:{	//是否显示图标
				type: Boolean,
				default: true
			},
			title:{
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
		width: 100%;
		/* & + .jd-cell-item{
			border-top: 1rpx solid $line;
		} */
		.icon-box{
			width: 44rpx;
			height: 44rpx;
			margin-right: 20rpx;
		}
		.ci-label{
			flex: 1;
			display: flex;
			align-items: center;
		}
		.ci-title{
			font-size: $font-s-base;
			line-height: 28rpx;
			color: $text-color;
		}
		.ci-right{
			width: 36rpx;
			flex-grow: 0;
			flex-shrink: 0;
		}
	}
</style>

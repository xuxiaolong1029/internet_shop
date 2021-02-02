<template>
	<view class="info-row">
		<view class="ir-label" :style="{width:labelWidth}">
			<view class="ir-def-label" :style="labelStyle">{{label||''}}</view>
			<slot name="label"></slot>
		</view>
		<view class="ir-val">
			<view class="ir-def-val" :style="valStyle">{{val||''}}</view>
			<slot name="val"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'infoRow',
	props:{
		label:{
			type:String,
			default:''
		},
		labelWidth:{
			type: String,
			default:'112rpx'
		},
		labelStyle:{
			type:Object,
			default:() => {}
		},
		val:{
			type:String,
			default:''
		},
		valStyle:{
			type:Object,
			default:() => {}
		}
	}
};
</script>

<style lang="scss" scoped>
	.info-row {
		display: flex;height: 50rpx;line-height: 50rpx;align-items: center;
		.ir-label {
			width: 112rpx;
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			white-space: nowrap;
			.ir-def-label {
				font-size: $font-s-base;
				color: $text-color-grey;
			}
		}
		.ir-val {
			flex: 1;
			display: flex;
			align-items: center;
			white-space: nowrap;
			overflow: hidden;
			.ir-def-val {
				font-size: $font-s-base;
				color: $text-color;
				margin-right:6rpx;
			}
		}
	}
</style>

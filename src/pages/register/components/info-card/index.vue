<template>
	<view class="info-card">
		<view class="hospital-info">
			<view class="hi-left">
				<view class="title-row">
					<text class="title">{{title}}</text>
					<text v-if="tag" class="tag">{{tag}}</text>
				</view>
				<slot></slot>
			</view>
			<view class="hi-right" v-if="telephone">
				<view class="tel-btn" @click="toCall"></view>
			</view>
		</view>
		<view class="tips-box" v-if="tips" @click="clickTips">
			<view class="tips">{{tips}}</view>
			<view class="right-box">
				<u-icon name="arrow-right" color="#999999" size="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
		name: "infoCard",
        props:{
			title: {
				type: String,
				default: ''
			},
			tag: {
				type: String,
				default: ''
			},
            tips: {
				type: String,
				default: ''
			},
			telephone: {
			    type: String,
			    default: ''
			},
        },
        data(){
            return{

            }
        },
        methods: {
            toCall(val) {
                this.$emit('toCall',this.telephone)
            },
			clickTips(){
				this.$emit('clickTips',this.tips)
			}
        }
    }
</script>

<style lang="scss" scoped>
    .info-card{
		background-color: #FFFFFF;
		padding: 30rpx;

		.hospital-info{
			display: flex;
			align-items: center;
		}
		.hi-left{
			flex: 1;
			overflow: hidden;
			.title-row{
				line-height: $font-s-lg;
			}
			.title{
				color: $text-color;
				font-size: $font-s-lg;
				line-height: $font-s-lg;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.tag{
				font-size:$font-s-sm;
				line-height: 24rpx;
				padding: 4rpx 8rpx;
				border: 1rpx solid $primary;
				color: $primary;
				margin-left: 12rpx;
				border-radius: 4rpx;
				box-sizing: border-box;
				display: inline-block;
			}
		}
		.hi-right{
			width: 48rpx;
			flex-shrink: 0;
			.tel-btn{
				width: 48rpx;
				height: 48rpx;
				@include bg-image('img/icon-phone');
			}
		}
		.tips-box{
			display: flex;
			margin-top: 18rpx;
			overflow: hidden;
		}
		.tips{
			flex: 1;
			font-size: $font-s-base;
			line-height: 30rpx;
			color: $text-color-grey;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.right-box{
			width: 48rpx;
			display: flex;
			justify-content: center;
			flex-grow: 0;
			flex-shrink: 0;
		}
	}
</style>

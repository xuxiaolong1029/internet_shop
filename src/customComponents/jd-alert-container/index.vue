<template>
    <view class="jd-alert-container">
        <u-mask :show="show" @click="close" :mask-click-able="maskClickAble" :custom-style="{background:'rgba(0, 0, 0, 0.5)'}">
			<view class="warp">
				<view class="rect" @tap.stop :class="{'show-close':showClose}" :style="{'width':width+'rpx','bottom':bottom+'rpx','left':(750-width)/2+'rpx','right':(750-width)/2+'rpx','height':height,'border-radius':borderRadius,'background-color':backgroundColor}">
					<slot></slot>
					<view class="close-btn" v-if="showClose" @click="close"></view>
				</view>
			</view>
		</u-mask>
    </view>
</template>

<script>
    export default {
        name: "jdAlertContainer",
        props:{
			show:{	//弹窗显示
				type: Boolean,
				default: false
			},
			showClose:{	//是否显示默认的关闭按钮
				type: Boolean,
				default: true
			},
			width:{
				type: String|Number,
				default: '640'
			},
			height:{
				type: String,
				default: '720rpx'
			},
			borderRadius:{
				type: String,
				default: '20rpx'
			},
			backgroundColor:{
				type: String,
				default: '#FFFFFF'
			},
			maskClickAble:{	//点击模态框是否关闭
				type: Boolean,
				default: false
			},
			bottom:{
				type: Number|String,
				default:280
			}
        },
		methods: {
			close(){
				this.$emit('close')
			}
		}
    }
</script>

<style lang="scss" scoped>
    .jd-alert-container{
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100vh;
			.rect {
				position: absolute;
				.close-btn{
					width: 60rpx;
					height: 60rpx;
					@include bg-image('img/x');
					margin:60rpx auto 0;
				}
			}
		}
    }
</style>

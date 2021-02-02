<template>
	<view class="doctor-info" :style="wrapperStyle">
		<view class="container">
			<view class="doctor-img">
				<image v-if="doctor.doctorImgUrl" :src="doctor.doctorImgUrl" mode="scaleToFill" alt=""></image>
			</view>
			<view class="di-content">
				<view class="di-header">
					<text class="doctor-name">{{doctor.doctorName}}</text>
					<text class="doctor-ncms">{{doctor.titleName}}</text>
				</view>
				<view class="di-body">
					<view class="org-name" v-if="showOrg">{{doctor.orgName}}</view>
					<view class="depart-name" :class="{'border-left':showOrg}">{{doctor.deptName}}</view>
				</view>
			</view>
			<view class="option" v-if="showFollow">
				<u-button type="primary" shape="circle" size="mini" plain @click="follow">{{followText}}</u-button>
			</view>
			<view class="status" v-if="showStatus">
				<slot name="status"></slot>
			</view>
		</view>
		<view v-if="showIntrod" @click="moreInfo">
			<view class="doctor-introd">{{(doctor.specialSkill || '') + (doctor.doctorntroduce || '')}}</view>
			<view class="more">
				<text>更多</text>
				<u-icon name="arrow-right" color="#3071EA" size="28"></u-icon>
			</view>
		</view>
		<slot name="content"></slot>
	</view>
</template>

<script>
    export default {
		name: "registerDoctor",
        props:{
			showFollow: {
			    type: Boolean,
			    default: true
			},
			showOrg: {
			    type: Boolean,
			    default: true
			},
			showIntrod: {
			    type: Boolean,
			    default: true
			},
			isfollow: {
			    type: Boolean,
			    default: false
			},
			showStatus: {
			    type: Boolean,
			    default: false
			},
			doctor: {
			    type: Object,
			    default: {}
			},
			wrapperStyle:{
				type: Object,
				default: () => {}
			}
        },
        data(){
            return{
            }
        },
		computed:{
			followText(){
				return this.isfollow?'已关注':'关注'
			}
		},
        methods: {
			follow() {
			    this.$emit('follow',this.isfollow)
			},
            moreInfo() {
                this.$emit('moreInfo',this.doctorObj)
            }
        }
    }
</script>

<style lang="scss" scoped>
	.doctor-info{
		background-color: #FFFFFF;
		padding: 30rpx;
		.container{
			display: flex;
			align-items: center;
		}
		.doctor-img{
			width: 80rpx;
			height: 80rpx;
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 20rpx;
			box-sizing: border-box;
			border-radius: 50%;
			@include bg-image('img/doctor-def');
			border: 1rpx solid $line;
			image{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.di-content{
			flex: 1;
			align-self: stretch;
			.di-header{
				line-height: 34rpx;
				color: $text-color;
				.doctor-name{
					font-size: $font-s-lg;
				}
				.doctor-ncms{
					margin-left: 20rpx;
					font-size: $font-s-base;
				}
			}
			.di-body{
				display: flex;
				margin-top: 11rpx;
				line-height: 28rpx;
				color: $text-color-grey;
				font-size: $font-s-base;
				.depart-name{
					color: $text-color-grey;
					&.border-left{
						margin-left: 20rpx;
						padding-left: 20rpx;
						border-left: 1rpx solid $line;
					}
				}
			}
		}
		.option{
			margin-left: 20rpx;
			width: 126rpx;
			flex-grow: 0;
			flex-shrink: 0;
			/deep/ .u-btn{
				border: 1rpx solid $primary;
				background-color: #FFFFFF !important;
				width: 100%;
				font-size: $font-s-base !important;
				border-color: $primary !important;
			}
		}
		.status{
			margin-left: 20rpx;
			height: 100%;
			display: flex;
			align-self: stretch;
		}
		.doctor-introd{
			margin-top: 20rpx;
			line-height: 42rpx;
			font-size: $font-s-base;
			color: $text-color;
			@include morelineEllipsis(2);
		}
		.more{
			display: flex;
			justify-content: center;
			margin-top: 20rpx;
			line-height: 28rpx;
			color: $primary;
		}
	}
</style>

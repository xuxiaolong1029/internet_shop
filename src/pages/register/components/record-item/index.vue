<template>
	<view class="record-item" :key="item.time">
		<view class="record-item-top">
			<view class="doctor-info">
				<jd-avatar src="/static/img/doctor-def_3x.png" size="80"></jd-avatar>
				<view class="info-name">
					<view>{{ item.doctorName }}<text class="name">{{ item.titleName }}</text></view>
					<view class="dept-name">{{ item.deptName }}</view>
				</view>
			</view>
			<view class="status">
				<u-loading v-if="item.productStatus.code.includes('PROCESSING')||item.productStatus.value.includes('中')" style="margin-right: 6rpx;" color="#3071EA" size="24"></u-loading>
				<text :class="item.productStatus.code">{{item.productStatus.value}}</text>
			</view>
		</view>
		<view class="record-item-middle">
			<slot name="item"></slot>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	import JdAvatar from '@/customComponents/jd-avatar/index.vue';
	export default {
		name: 'record-item',
		components:{JdAvatar},
		props:{
			item:{
				type:Object,
				default:()=>{}
			}
		},
		methods:{

		}

	};
</script>

<style lang="scss" scoped>
	.record-item {
		background-color: $white;
		border-radius: 20rpx;
		padding: 30rpx;
		.record-item-top {
			position: relative;font-size: $font-s-lg;height: 80rpx;
			.doctor-info{
				display: flex;height: 100%;
				.info-name{
					margin-left: 20rpx;
					.name{
						font-size:$font-s-base;
						margin-left:20rpx;
					}
					.dept-name{
						font-size:$font-s-base;
						color:$text-color-grey;
						margin-top:10rpx;
					}
				}
			}
			.status{
				position: absolute;right: 0rpx;top: 0;font-size: $font-s-base;
				text{
					margin-left: 6rpx;
				}
				.PAY_INIT,.PAY_SUCCEED,.PAY_PROCESSING,.REGIST_PROCESSING,.REFUND_PROCESSING,.REFUND_SUCCEED{
					color:$primary;
				}
				.REGIST_SUCCEED,.CANCEL_SUCCEED{
					color:$success;
				}
				.CANCEL_PROCESSING{
					color:$text-color;
				}
				.CANCEL_FAILED,.REGIST_FAILED,.PAY_FAILED,.REFUND_FAILED{
					color:$danger;
				}
				.REGIST_UNKNOWN,.PAY_UNKNOWN,.CANCEL_UNKNOWN,.REFUND_UNKNOWN{
					color:$warning;
				}
			}
		}
		.record-item-middle {
			margin-top:30rpx;
			background: #f3f7ff;
			border-radius: 10rpx;
			padding:30rpx 20rpx;
			font-size: $font-s-base;
			.item-list{
				display: flex;
				height: 50rpx;
				line-height: 50rpx;
				color:#333;
				text{
					color: $text-color-grey;
					margin-right: 20rpx;
				}
			}
		}
	}
</style>

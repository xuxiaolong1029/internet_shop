<template>
	<view class="page-set">
		<u-gap height="20" bg-color="#E5E5E5"></u-gap>
		<view class="card-item">
			<jd-card title="头像" titleSize="28rpx">
				<view slot="suffix" class="img">
					<jd-avatar :src="userInfo.headImgUrl||'../../../static/img/avatar-default.png'"></jd-avatar>
				</view>
			</jd-card>
		</view>
		<u-gap height="2" bg-color="#E5E5E5"></u-gap>
		<view class="card-item"><jd-card titleSize="28rpx" title="手机号" :view="userInfo.mobileNo"></jd-card></view>
		<u-gap height="20" bg-color="#E5E5E5"></u-gap>
		<view class="card-item"><jd-card titleSize="28rpx" title="我有话说" view="反馈使用意见"></jd-card></view>
		<u-gap height="20" bg-color="#E5E5E5"></u-gap>
		<view class="card-item logout" @click="logout">退出登录</view>
	</view>
</template>

<script>
import JdCard from '@/customComponents/jd-card/index.vue';
import JdAvatar from '@/customComponents/jd-avatar/index.vue';
export default {
	name: 'user-set',
	components: {
		JdCard,JdAvatar
	},
	methods: {
		logout(){
			uni.showModal({
				title: '温馨提示',
				content: '是否退出登录?',
				cancelColor: '#eeeeee',
				confirmColor: '#FF0000',
				success(res) {
					if(res.confirm){
						uni.clearStorageSync();
						uni.reLaunch({
							url: '/pages/tabBar/home/index'
						});
					}
				}
			})
		}
	}
};
</script>
<style scoped lang="scss">
	.page-set{
		width: 100%;
		.card-item{
			padding: 0 30rpx;background-color:$white;
			.img{
				margin-top: 20rpx;
			}
		}
		.logout{
			height: 88rpx;line-height: 88rpx;text-align: center;
		}
	}
</style>

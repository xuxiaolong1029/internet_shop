<template>
	<view class="page-user">
		<view class="page-user-top">
			<view class="user-info">
				<view class="user_img" v-if="Object.keys(userInfo).length>0">
					<jd-avatar :src="userInfo.headImgUrl" size="120" @click="goUser()"></jd-avatar>
				</view>
				<view v-else class="user_img" @click="onGetAuthorize()">
					<jd-avatar src="../../../static/img/avatar-default.png" size="120"></jd-avatar>
				</view>
				<view class="name">{{ userInfo.nickName }}</view>
				<view class="certificate" @click="goAliapy">
					查看医保电子凭证
					<u-icon style="margin-left:8rpx;" name="arrow-right" color="#fff" size="18"></u-icon>
				</view>
			</view>
<!--
			<view class="user-info-set" @click="goSet">
				<image src="../../../static/img/user/set.png" mode="scaleToFill"></image>
			</view>-->
		</view>
		<view class="person">
			<view class="top"><jd-card title="我的" icon-type="''"></jd-card></view>
			<sub-menu :menu="subMenus" title-size="28" height="160rpx" @click="goTarget"></sub-menu>
		</view>
		<view class="my-doctor modules" v-if="doctorsList.length>0">
			<view style="padding: 0 30rpx;"><jd-card title="我的医生" icon-type="''" ></jd-card></view>
			<my-doctor :doctorsList="doctorsList" :orgCode="orgCode"></my-doctor>
		</view>
		<jd-login :isLogin="isLogin" :fromUrl="fromUrl" @close="isLogin=false"></jd-login>
	</view>
</template>

<script>
	import JdAvatar from '@/customComponents/jd-avatar/index.vue';
	import JdCard from '@/customComponents/jd-card/index.vue';
	import SubMenu from '../components/sub-menus.vue'
	import MyDoctor from '../components/my-doctor'
	import JdLogin from '../../../customComponents/jd-login/index'
	import { mapState } from 'vuex';
	import {goAuthAndTarget} from '@/utils'
	export default {
		name: 'user-index',
		components: {
			JdCard,SubMenu,MyDoctor,JdLogin,JdAvatar
		},
		data() {
			return {
				isLogin:false,
				fromUrl:'',
				subMenus: [
					{ img: '../../../static/img/user/drgh.png', title: '挂号',url:'/pages/register/record/index' },
					{ img: '../../../static/img/home/icon-jf.png', title: '交费',url:'/pages/pay/record/index'},
					{ img: '../../../static/img/user/bgcx.png', title: '报告',url:'/pages/report/query/index' },
					{ img: '../../../static/img/user/gerzx.png', title: '就诊人',url:'/pages/archives/patients/index' }
				],
				doctorsList: [],
				userInfo:{}
			};
		},
		computed: {
			...mapState({
				orgCode:state =>state.orgCode,
			}),
		},
		onShow(){
			this.userInfo = uni.getStorageSync('userInfo')||{};
			if(Object.keys(this.userInfo).length>0){
				this.getMyDoctor()
			}
		},
		methods:{
			goSet(){
				uni.navigateTo({
					url: '/pages/tabBar/user/setting'
				});
			},
			goAliapy(){
				uni.navigateToMiniProgram({
					appId: '2021001123625885',
					path: 'pages/index/index?cityCode=&chInfo=XSyyxcxzheyi'
				})
			},
			async getMyDoctor(){
				const {orgEmpList} = await this.$api.ihosp_my_doctor({
					orgCode:this.orgCode,
					userId:this.userInfo.userId
				})
				if(orgEmpList&&Array.isArray(orgEmpList)){
					this.doctorsList=orgEmpList;
				}
			},
			// 授权成功回调
			onGetAuthorize() {
				uni.navigateTo({
					url: '/pages/auth/index?from='+encodeURIComponent('/pages/tabBar/user/index')
				});
			},
			goTarget(url){
				uni.getSetting({
					success:res=>{
						console.log("authSetting:")
						console.log(res.authSetting)
						if(res.authSetting.userInfo) {
							if(Object.keys(this.userInfo).length>0){
								uni.navigateTo({url: url});
							}else{
								this.isLogin = true;
								this.fromUrl = url;
							}
						}else{
							goAuthAndTarget(url)
						}
					},
					fail:err=>{
						console.log("err")
						goAuthAndTarget(url)
					}
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.page-user {
		width: 100%;
		position: relative;
		.page-user-top {
			position: relative;
			width: 100%;
			height: 500rpx;
			background: url(../../../static/img/user/bg1.png);
			background-size: 100% 500rpx;
			.user-info {
				width: 100%;text-align: center;padding-top: 60rpx;
				.user_img {
					width:120rpx;height:120rpx;border-radius: 50%;margin: auto;
				}
				.name {
					font-size:$font-s-lg;
					color:$white;
					padding-top: 10rpx;
				}
				.certificate {
					display: inline-block;
					padding: 10rpx 30rpx;
					border-radius: 30rpx;
					font-size:$font-s-base;
					color:$white;
					letter-spacing: 2rpx;
					margin-top: 16rpx;
					border: 1rpx solid rgba($color: #ffffff, $alpha: 0.4);
				}
			}
			.user-info-set{
				position: absolute;top:50rpx;right: 30rpx;
				image{
					width: 40rpx;height: 40rpx;
				}
			}
		}
		.card-content {
			background-color: $white;
			width: calc(100% - 60rpx);
			border-radius: 20rpx;
		}
		.person {
			@extend .card-content;
			position: absolute;z-index: 2;top: 340rpx;
			left: 30rpx;right: 39rpx;margin-top: 20rpx;height: 248rpx;
			.top{
				padding: 0 30rpx;
			}
		}
		.my-doctor {
			@extend .card-content;height: 300rpx;margin: 130rpx 30rpx 0;
		}
	}
</style>

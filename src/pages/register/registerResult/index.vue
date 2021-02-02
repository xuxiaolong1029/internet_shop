<template>
	<!-- 确认挂号 -->
	<view class="register-result">
		<u-line color="#D9D9D9"></u-line>
		<!-- 挂号状态 -->
		<view class="register-status">
			<view class="rs-left">
				<view class="rs-icon">
					<u-icon :name="registerStatus.iconName" :color="registerStatus.iconColor" size="36" top="0"></u-icon>
				</view>
			</view>
			<view class="rs-info">
				<view class="rs-title">{{registerStatus.title}}</view>
				<view class="rs-tips">{{registerStatus.tips}}</view>
			</view>
		</view>

		<!-- 挂号信息 -->
		<view class="register-info">
			<view class="ri-content">
				<info-row label="预约医生" :val="registResult.doctorName + titleName">
				</info-row>
				<info-row label="就诊科室" :val="registResult.deptName + ' - ' + registResult.orgName"></info-row>
				<info-row label="就诊时间" :val="registResult.consultationTime">
					<template v-slot:val>
						<view class="val-status grey">({{ transformWhen }})</view>
					</template>
				</info-row>
				<info-row label="就诊号序" :val="registResult.numNo"></info-row>
				<info-row label="预约单号" :val="registResult.registId"></info-row>
				<!-- <info-row label="取号密码" val="" ></info-row> -->
				<info-row label="挂号诊金" :val="'￥'+registResult.payableAmt"></info-row>
				<info-row label="医保支付" v-if="registResult.insuOption != null" :val="'￥'+registResult.insuAmt">
					<template v-if="insuStatus">
						<view slot="val" class="val-status grey" >(<text class="vs-text" :class="[insuStatus.cls]">{{insuStatus.text}}</text>{{insuStatus.label || ''}})</view>
					</template>
				</info-row>
				<info-row label="自费支付" :val="'￥'+registResult.selfAmt">
					<template v-if="selfStatus">
						<view slot="val" class="val-status grey" >(<text class="vs-text" :class="[selfStatus.cls]">{{selfStatus.text}}</text>)</view>
					</template>
				</info-row>
			</view>
			<view class="ri-tips" v-if="registStatus == 'REGIST_SUCCEED' && registType=='预约'">
				<view class="ri-tips-icon">
					<u-icon name="error-circle-fill" color="#bbbbbb" size="36" top="0"></u-icon>
				</view>
				<view class="ri-tips-content">如需取消预约，请至少提前1天取消</view>
			</view>
		</view>

		<!-- 就诊须知 -->
		<view class="register-notice" v-if="registStatus == 'REGIST_SUCCEED' && registResult.notice">
			<view class="notice-title">就诊须知</view>
			<view class="notice-content">
				<view class="paragraph">{{ registResult.notice }}</view>
			</view>
		</view>

		<!-- 操作 -->
		<view class="bottom-options flex-r-center">
			<template v-if="registStatus == 'PAY_UNKNOWN'">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="retryQuery">重试查询支付结果</jd-button>
			</template>
			<template v-if="(registStatus == 'REGIST_FAILED' || registStatus == 'PAY_FAILED') && !refundSuccess">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'96rpx',borderRadius: 0,color:'#333333'}" @submit="retry">重试退款</jd-button>
			</template>
			<template v-if="registStatus == 'REGIST_UNKNOWN'">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary"  @submit="retryConfirm">重试确认预约结果</jd-button>
			</template>
			<template v-if="registStatus == 'REGIST_SUCCEED' || ((registStatus == 'REGIST_FAILED' || registStatus == 'PAY_FAILED') && refundSuccess)">
				<jd-button size="lg" style="width:39%;" :btn-style="returnHomeBtnStyle" @submit="toHome">返回首页</jd-button>
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" v-if="registStatus == 'REGIST_SUCCEED'" @submit="toRegistDetails">查看{{ registType }}详情</jd-button>
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" v-if="(registStatus == 'REGIST_FAILED' || registStatus == 'PAY_FAILED') && refundSuccess" @submit="toRegist">重新{{ registType }}</jd-button>
			</template>
		</view>
		<u-mask :show="showLoading" :mask-click-able="false">
			<view class="mask-warp">
				<view class="regist-loading">
					<view class="loading-box">
						<u-loading mode="circle" size="80"></u-loading>
					</view>
					<view class="rl-title">正在确认支付结果，请稍候...</view>
				</view>
			</view>
		</u-mask>

		<jd-modal ref="jdModal"></jd-modal>
	</view>
</template>

<script>
	import jdButton from '@/customComponents/jd-button/index';
	import infoRow from '../../../customComponents/jd-info-row/index.vue'
	import { timeDifference } from '@/utils/util'
	import registStatusMixin from '@/mixins/registStatus.js'
	import jdModal from '@/customComponents/jd-modal'
	import config from '@/config';
	const {DEPT_LAST} = config.common

	export default {
		name: 'registerResult',
		mixins:[registStatusMixin],
		components: {
			jdButton,infoRow,jdModal
		},
		data() {
			return {
				DEPT_LAST,
				// registId: '',	//挂号单订单号
				// userInfo: {},
				showLoading: false,
				returnHomeBtnStyle:{
					flex:1,
					height:'96rpx',
					borderRadius: 0,
					'flex-basis':'auto',
					'flex-grow': 0,
					color:'#3071EA'
				},
				// registResult:{},
			};
		},
		created(){
			//#ifdef MP-ALIPAY
			this.returnHomeBtnStyle['width']='39%'
			//#endif
		},
		async onLoad(option){
			this.registId = option.registId
			this.userInfo = uni.getStorageSync('userInfo')
			this.findRegistResult()
		},
		computed:{
			titleName(){
				return (this.registResult.titleName!=null && this.registResult.titleName != '')?' (' + this.registResult.titleName + ')': ''
			},
			transformWhen(){
				let when = ''
				if(this.registResult.registDate){
					let dt = new Date(this.registResult.registDate)
					let tdf = timeDifference(dt)
					switch (tdf){
						case 0:
							when = '今天'
							break;
						case 1:
							when = '明天'
							break;
						default :
							when = tdf+'天后'
							break;
					}
				}
				return when
			},
		},
		methods: {
			// 挂号单结果查询
			async findRegistResult(){
				if(this.registId==null || this.registId==''){
					return
				}
				let {page} = await this.$api.ihosp_regist_query({ registId: this.registId, userId: this.userInfo.userId })
				console.log('挂号结果：',page)
				let list = page && page.records || []
				this.registResult = list.length>0 && list[0] || {}
				this.showLoading = false
			},
			// 重试退款
			async retry(){
				this.$refs.jdModal._loading({
					title:`退款申请`,
					content:`正在申请退款，请稍候...`,
					success:async(res)=>{}
				})
				await this.findRegistResult()
				if((this.registStatus == 'REGIST_FAILED' || this.registStatus == 'PAY_FAILED') && !this.refundSuccess){
					this.$refs.jdModal.cancel()
					this.$refs.jdModal._warning({
					    title:`退款异常`,
					    content:`网络异常，暂无法获取退款结果`,
					    confirmText:'稍后再试',
					    success:async(res)=>{}
					})
				}else {
					this.$refs.jdModal._success({
					    title:`退款成功`,
					    content:`退款一般会在48小时内原路退还`,
					    confirmText:'好的',
					    success:async(res)=>{}
					})
				}
			},
			// 重试查询支付结果
			async retryQuery(){
				this.$refs.jdModal._loading({
					title:`支付结果查询`,
					content:`正在查询支付结果，请稍候...`,
					success:async(res)=>{
						if (res.confirm) {
						}
					}
				})
				await this.findRegistResult()
				if(this.registStatus == 'PAY_UNKNOWN'){
					this.$refs.jdModal.cancel()
					this.$refs.jdModal._warning({
					    title:`支付结果查询异常`,
					    content:`网络异常，暂无法获取支付结果`,
					    confirmText:'稍后再试',
					    success:async(res)=>{}
					})
				}else {
					setTimeout(()=>{
						this.$refs.jdModal.cancel()
					},3000)
				}
			},
			async retryConfirm(){
				this.$refs.jdModal._loading({
					title:`${this.registType}结果查询`,
					content:`正在查询${this.registType}结果，请稍候...`,
					success:async(res)=>{
						if (res.confirm) {
						}
					}
				})
				await this.findRegistResult()
				if(this.registStatus == 'REGIST_UNKNOWN'){
					this.$refs.jdModal.cancel()
					this.$refs.jdModal._warning({
					    title:`${this.registType}异常`,
					    content:`网络异常，暂无法获取${this.registType}结果`,
					    confirmText:'稍后再试',
					    success:async(res)=>{}
					})
				}else {
					setTimeout(()=>{
						this.$refs.jdModal.cancel()
					},3000)
				}
			},
			toHome(){
				uni.reLaunch({
					url: '/pages/tabBar/home/index'
				})
			},
			toRegistDetails(){
				uni.navigateTo({
					url: `/pages/register/record/details?registId=${this.registId}&userId=${this.userInfo.userId}`
				})
			},
			toRegist(){
				//跳转到医生主页挂号
				let {orgCode,doctorCode,deptId,deptCode,deptName} = this.registResult
				uni.navigateTo({
					url: `/pages/register/doctorPage/index?orgCode=${orgCode}&doctorCode=${doctorCode}&deptCode=${item.deptCode}&isPrompt=true`
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.mask-warp{
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		.regist-loading{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.loading-box{
			margin-top: calc(50vh - 200rpx);
			display: flex;
			justify-content: center;
		}
		.rl-title{
			color: #999999;
			font-size: 28rpx;
			margin-top: 40rpx;
		}
	}
	.register-result{
		padding-bottom: 118rpx;
	}
	.register-status{
		display: flex;
		background-color: #FFFFFF;
		padding: 30rpx;
		.rs-left{
			width: 32rpx;
			display: flex;
			justify-content: center;
			margin-right: 20rpx;
			flex-grow: 0;
			flex-shrink: 0;
		}
		.rs-icon{
			width: 32rpx;
			height: 32rpx;
			display: flex;
			justify-content: center;
		}
		.rs-info{
			flex: 1;
			.rs-title{
				font-size: $font-s-lg;
				line-height: 32rpx;
				color: $text-color;
			}
			.rs-tips{
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-grey;
				margin-top: 20rpx;
			}
		}
	}

	.register-info{
		margin-top: 20rpx;
		padding: 30rpx;
		background-color: $white;
		.ri-content{
			padding: 30rpx;
			background-color: #F5F8FF;
			border-radius: 10rpx;
		}
		.val-status{
			color: $text-color;
			margin-left: 12rpx;
			font-size: $font-s-base;
			line-height: 28rpx;
			&.grey{
				color: $text-color-grey;
			}
			.vs-text{
				font-size: $font-s-base;
				line-height: 28rpx;
				&.pd-right{
					padding-right: 12rpx;
				}
			}
			.warning{
				color: $warning;
			}
			.danger{
				color: $danger;
			}
			.dark{
				color: $dark;
			}
		}
		.ri-tips{
			display: flex;
			margin-top: 20rpx;
			align-items: center;
			.ri-tips-icon{
				display: flex;
				justify-content: center;
				margin-right: 12rpx;
				flex-grow: 0;
				flex-shrink: 0;
				width: 32rpx;
				height: 32rpx;
			}
			.ri-tips-content{
				flex: 1;
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-grey;
			}
		}
	}

	.register-notice{
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 30rpx;
		.notice-title{
			font-size: $font-s-lg;
			line-height: 32rpx;
			color: $text-color;
		}
		.notice-content{
			font-size: $font-s-base;
			line-height: 40rpx;
			color: $text-color;
			margin-top: 30rpx;
			text-align: justify;
		}
	}

	.bottom-options{
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		height: 98rpx;
		box-shadow: inset 0rpx 1rpx 0rpx $line;
	}

</style>

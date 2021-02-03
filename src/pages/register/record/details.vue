<template>
	<view class="page-record-details">
		<u-line color="#D9D9D9"></u-line>
		<view class="tips-wrapper" v-if="registResult.tradeTypeCode=='REGIST_PRE' && registStatus == 'REGIST_SUCCEED'">
			<view class="ri-tips-icon">
				<u-icon name="error-circle-fill" color="#FF9C00" size="36" top="0"></u-icon>
			</view>
			<view class="ri-tips-content">就诊当天请凭预约单号取号就诊</view>
		</view>
		<view class="tips-wrapper" v-if="registResult.tradeTypeCode=='REGIST_DAY' && registStatus == 'REGIST_SUCCEED'">
			<view class="ri-tips-icon">
				<u-icon name="error-circle-fill" color="#FF9C00" size="36" top="0"></u-icon>
			</view>
			<view class="ri-tips-content">请前往科室分诊台签到候诊</view>
		</view>
		<view class="now-pay" v-if="registStatus == 'PAY_INIT'">
			<view v-if="countdownTime">
				请在 <text>{{countdownTime}}</text>内支付，超时自动取消
			</view>
			<u-button shape="circle" type="primary" size="mini" @click="pay">立即支付</u-button>
		</view>
		<view class="detail-content">
			<jd-doctor-info :doctor="registResult" :showFollow="false" :showIntrod="false" :showOrg="false" :showStatus="true" :wrapperStyle="{'border-radius':'20rpx'}">
				<template v-slot:status>
					<view class="status-consten">
						<u-loading v-if="registStatus == 'PAY_PROCESSING' || registStatus == 'REGIST_PROCESSING'" color="#3071EA" size="24"></u-loading>
						<view class="status-text" :style="{color: detailStatus.color}">{{ detailStatus.title }}</view>
					</view>
				</template>
				<template v-slot:content>
					<view class="cr-content">
						<info-row label="患者姓名" :val="registResult.patientName||''">
							<view v-if="cardText" slot="val">({{cardText}})</view>
						</info-row>
						<info-row label="就诊时间" :val="registResult.consultationTime||''"></info-row>
						<info-row label="就诊号序" :val="registResult.numNo||''"></info-row>
						<info-row label="挂号诊金" :val="'￥'+(registResult.payableAmt||'')">
							<template v-show="paySuccess">
                                <view slot="val" class="val-status grey" >(<text class="vs-text" :class="[paySuccess.cls]">{{paySuccess.text}}</text>)</view>
							</template>
						</info-row>
						<info-row label="下单时间" :val="registResult.createTime||''"></info-row>
						<info-row :label="registType+'单号'" :val="registResult.registId||''" v-if="registStatus !== 'PAY_INIT'"></info-row>
					</view>
				</template>
			</jd-doctor-info>

			<view class="pay-detalis">
				<view class="title">支付信息</view>
				<info-row label="支付类型" :val="registResult.insuOption?'医保支付':'自费支付'"></info-row>
				<info-row label="医保支付" v-if="registResult.insuOption != null" :val="'￥'+(registResult.insuAmt||'')">
					<template v-show="insuStatus">
						<view slot="val" class="val-status grey" >(<text class="vs-text" :class="[insuStatus.cls]">{{insuStatus.text}}</text>{{insuStatus.label || ''}})</view>
					</template>
				</info-row>
				<info-row label="自费支付" :val="'￥'+(registResult.selfAmt||'')">
					<template v-show="selfStatus">
						<view slot="val" class="val-status grey" >(<text class="vs-text" :class="[selfStatus.cls]">{{selfStatus.text}}</text>)</view>
					</template>
				</info-row>
				<info-row label="支付方式" :val="registResult.selfOptionName"></info-row>
				<info-row label="支付单号" :val="registResult.payOrderId" v-if="registStatus !== 'PAY_INIT'"></info-row>
				<info-row label="支付时间" :val="registResult.payTime" v-if="registStatus !== 'PAY_INIT'"></info-row>
			</view>
		</view>

		<!-- 操作  不等于支付中、预约中-->
		<view class="bottom-options flex-r-center" v-if="showOptions">
			<template v-if="showCancelRegist">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'96rpx',borderRadius: 0,color:'#333333'}" @submit="cancelRegist">取消{{ registType }}</jd-button>
			</template>

			<template v-if="showRetryQuery">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="retryQuery">重试查询支付结果</jd-button>
			</template>
			<template v-if="showRetryRefund">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'96rpx',borderRadius: 0,color:'#333333'}" @submit="retry">重试退款</jd-button>
			</template>
			<template v-if="showRetryConfirm">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary"  @submit="retryConfirm">重试确认{{ registType }}结果</jd-button>
			</template>

			<template v-if="showAgainRegist">
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="toRegist()">再次{{ registType }}</jd-button>
			</template>
			<!-- 预约挂号，就诊当天 -->
			<!--<template v-if="registType == '预约' && isSameDay() && registStatus == 'REGIST_SUCCEED'">
				<jd-button size="lg" style="width:39%;" :btn-style="returnHomeBtnStyle" @submit="cancelRegist">取消预约</jd-button>
				<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="">在线取号</jd-button>
			</template>-->
		</view>

		<jd-modal ref="jdModal"></jd-modal>
	</view>
</template>

<script>
	import infoRow from '../../../customComponents/jd-info-row/index.vue'
	import RecordItem from '../components/record-item/index.vue'
	import jdDoctorInfo from '@/viewComponents/jd-doctor-info/index.vue';
	import registStatusMixin from '@/mixins/registStatus.js'
	import jdButton from '@/customComponents/jd-button/index';
	import jdModal from '@/customComponents/jd-modal'
	import { mapState } from 'vuex'
	import config from '@/config';
	const {CARD_TYPE_NAME} = config.common
	export default {
		name: 'record-index',
		mixins:[registStatusMixin],
		components:{
			RecordItem,infoRow,jdDoctorInfo,jdButton,jdModal
		},
		data() {
			return {
				CARD_TYPE_NAME,	//卡类型
				returnHomeBtnStyle:{
					flex:1,
					height:'96rpx',
					borderRadius: 0,
					'flex-basis':'auto',
					'flex-grow': 0,
					color:'#3071EA'
				},
				countdownTime: '',
				userId:""
			};
		},
		created(){
			//#ifdef MP-ALIPAY
			this.returnHomeBtnStyle['width']='39%'
			//#endif
		},
		async onLoad(option){
			this.registId = option.registId
			this.userId = option.userId
			this.findRegistResult()
		},
		computed:{
			...mapState(['paymentProvider']),
			cardText(){
				let cardNum = this.registResult.cardNum
				// cardNum = cardNum!=null?cardNum.substr(-4):''
				return CARD_TYPE_NAME[this.registResult.cardType] + cardNum
			},
		},
		watch:{
			registResult(nVal, oVal){
				if(this.registStatus === 'PAY_INIT'){
					this.countdown()
				}
			}
		},
		methods:{
			/*倒计时*/
			countdown(){
				let val = this.registResult.createTime
				let nowTime = new Date().getTime();
				let currentTime = (new Date(val).getTime())+15*60*1000;
				let totalTimeNum = parseInt((currentTime-nowTime)/1000);
				if(totalTimeNum===0){
					this.countdownTime = '00分00秒'
					this.findRegistResult()
				}else if(totalTimeNum<0){
					this.countdownTime = '00分00秒'
				}else{
					let timer = setInterval(()=>{
						totalTimeNum--;
						let m = parseInt(totalTimeNum/60);
						let s = totalTimeNum%60;
						let time = m+'分'+s+'秒';
						this.countdownTime = time
						if(totalTimeNum===0){
							clearInterval(timer);
							this.findRegistResult()
						}
					},1000);
				}
			},
			// 是否就诊当天
			isSameDay(){
				let bl = false
				// let dt = new Date()
				// dt = this.$u.timeFormat(dt.getTime(), 'yyyy/mm/dd')
				// let rdt = this.registResult.consultationTime.substr(0,10)

				// if(dt == rdt){
				// 	bl = true
				// }
				return bl
			},
			pay(){
				// 挂号单支付
				let _this = this
				uni.requestPayment({
					provider: this.paymentProvider,
					orderInfo: this.registResult.payOrderId,
					success: function (res) {
						_this.$u.toast('支付成功')
						_this.findRegistResult()
					}, fail: function (err) {
						_this.$u.toast('支付异常')
						console.log('Pay fail(支付异常):' + JSON.stringify(err));
					}
				})
			},
			// 挂号单结果查询
			async findRegistResult(){
				if(this.registId==null || this.registId===''){
					return
				}
				let {page} = await this.$api.ihosp_regist_query({ registId: this.registId, userId: this.userId })
				console.log('挂号结果：',page)
				let list = page && page.records || []
				this.registResult = list.length>0 && list[0] || {}
			},
			// 重试
			async retry(){
				this.$refs.jdModal._loading({
					title:`退款申请`,
					content:`正在申请退款，请稍候...`,
					success:async(res)=>{}
				})
				await this.findRegistResult()
				if((this.registStatus === 'REGIST_FAILED' || this.registStatus === 'PAY_FAILED') && !this.refundSuccess){
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
				if(this.registStatus === 'PAY_UNKNOWN'){
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
				if(this.registStatus === 'REGIST_UNKNOWN'){
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
			// 再次预约
			async toRegist(){
				let item = this.registResult;
				let res = await this.$api.ihosp_doctor_sup_num({orgCode:item.orgCode,deptCode:item.deptCode,deptLast:config.common.DEPT_LAST.yes, doctorCode: item.doctorCode});
				if(Number(res.code)===200&&Array.isArray(res.doctorSupDateList)&&res.doctorSupDateList.length>0){
					uni.navigateTo({
						url: `/pages/register/doctorPage/index?orgCode=${item.orgCode}&doctorCode=${item.doctorCode}&deptCode=${item.deptCode}&isPrompt=true`
					})
				}else{
					uni.navigateTo({
						url: `/pages/register/doctorPage/index?orgCode=${item.orgCode}&doctorCode=${item.doctorCode}&deptCode=${item.deptCode}&isPrompt=true`
					})
				}
			},
			// 取消预约
			async cancelRegist(){
				this.$refs.jdModal._warning({
				    title:`取消${this.registType}`,
				    content:`确定取消${this.registType}`,
					showCancel: true,
					cancelText:'否',
				    confirmText:'是',
				    success:async(res)=>{
				        if (res.confirm) {
							let res = await this.$api.ihosp_regist_cancel({
								registId:this.registId,
								tradeType:config.order.REGIST_CANCEL,
								orgCode:this.registResult.orgCode,
							})
							console.log(res)
							if(Number(res.code) === 200){
								uni.showToast({title:`取消${this.registType}成功`})
								this.findRegistResult()
							}else {
								uni.showToast({title:`取消${this.registType}失败`})
							}
				        }
				    }
				})
			},
		}
	};
</script>

<style lang="scss" lang="scss">
	.page-record-details {
		width: 100%;position: relative;height: 100vh;
		.tips-wrapper{
			height: 80rpx;
			display: flex;
			margin-top: 0rpx;
			margin-bottom: 10rpx;
			align-items: center;
			padding: 0 30rpx;
			background-color:$white;
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
		.now-pay{
			display: flex;padding: 0 30rpx;box-sizing: border-box;
			height: 80rpx;line-height: 80rpx;background-color:$white;
			justify-content: space-between;align-items: center;
			margin-bottom: 10rpx;
			text{
				color:$primary;
			}
		}
		.detail-content{
			padding: 20rpx 30rpx;
			.cr-content{
				margin-top: 20rpx;
				background-color: #F5F8FF;
				border-radius: 10rpx;
				padding: 20rpx;
			}
			.status-text{
				line-height: 34rpx;
				color: $primary;
			}
		}
		.status-consten{
			display: flex;
			align-items: center;
			.status-text{
				margin-left: 12rpx;
			}
		}
		.pay-detalis{
			background-color:$white;
			border-radius: 20rpx;
			padding: 30rpx;
			margin-top: 20rpx;
			.title{
				font-size:$font-s-lg;margin-bottom: 20rpx;
			}
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

	}

	.bottom-options{
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		height: 98rpx;
		box-shadow: inset 0rpx 1px 0rpx $line;
	}

</style>

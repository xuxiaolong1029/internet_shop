<template>
	<!-- 交费确认 -->
	<view class="confirm-pay">
		<u-line color="#D9D9D9"></u-line>
		<view class="pay-item-container">
			<view class="p-item-header">
				<view class="p-title">交费项目</view>
			</view>
			<view class="pi-body" v-if="waitPayInfo.waitPayList">
				<template v-for="(item,index) in waitPayInfo.waitPayList">
					<u-line color="#D9D9D9" v-if="index!=0"></u-line>
					<cell-item :key="index" :title="item.feeType" :value="'￥'+item.orderAmt" :arrow="false" :itemStyle="{'padding-left':'0rpx'}">
						<template v-slot:label>
							<jd-tag v-if="item.insured == '1'" text="可医保" mode="light" type="primary" bgColor="#ffffff" border-color="#3071EA"/>
						</template>
					</cell-item>
				</template>

			</view>
		</view>
		<!-- 支付方式 -->
		<view class="pay-method" v-show="activePatient!=''">
			<view class="p-item-header">
				<view class="p-title">支付方式</view>
			</view>
			<view class="pm-body">
				<view class="cell-content">
					<pay-type title="自费支付" :showIcon="true" index="zf" :itemStyle="{'padding-left':'0rpx'}" @clickItem="changePayMethod">
						<template v-slot:icon>
							<view class="pay-icon pay-zf"></view>
						</template>
						<template v-slot:button>
							<view class="option-box">
								<u-icon name="checkmark-circle-fill" color="#2979ff" size="44" v-if="payMethod=='zf'"></u-icon>
							</view>
						</template>
					</pay-type>
					<u-line color="#D9D9D9"></u-line>
					<!--<pay-type title="医保支付" :showIcon="true" index="yb" :itemStyle="{'padding-left':'0rpx'}" @clickItem="changePayMethod">
						<template v-slot:icon>
							<view class="pay-icon pay-yb"></view>
						</template>
						<template v-slot:label>
							<view class="pay-yb-price" v-if="payMethod=='yb'">
								<text class="pay-yb-lab">医保可付</text>
								<text class="pay-price">￥{{ insuAmt }}</text>
							</view>
						</template>
						<template v-slot:button>
							<view class="option-box">
								<u-icon name="checkmark-circle-fill" color="#2979ff" size="40" v-if="payMethod=='yb'"></u-icon>
							</view>
						</template>
					</pay-type>-->
				</view>
			</view>
		</view>

		<!-- 操作 -->
		<view class="bottom-options flex-r-center" v-show="1==1">
			<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'96rpx',borderRadius: 0}">
				<template v-if="payMethod=='yb'">
					<view class="pay-zf-price">
						<text class="pay-zf-lab">还需自费</text>
						<text class="pay-price">￥{{ surplusSelfAmt }}</text>
					</view>
				</template>
				<template v-else>
					<view class="pay-zf-price">
						<text class="pay-zf-lab">支付金额</text>
						<text class="pay-price">￥{{ allAmt }}</text>
					</view>
				</template>
			</jd-button>
			<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="confirmPay" >确认支付</jd-button>
		</view>
		<jd-modal ref="jdModal"></jd-modal>
	</view>
</template>

<script>
	import cellItem from '@/customComponents/jd-cell-item/cell-item.vue';
	import jdButton from '@/customComponents/jd-button/index';
	import payType from '@/customComponents/jd-cell-item/pay-type.vue';
	import jdTag from '@/customComponents/jd-tag/index'
	import jdModal from '@/customComponents/jd-modal'
	import config from '@/config';
	import { mapState } from 'vuex'

	export default {
		name: 'confirmRegister',
		components: {
			cellItem,jdButton,payType,jdTag,jdModal
		},
		data() {
			return {
				waitPayInfo: {},
				userInfo: {},
				paymentItems: [
					{
						orderNo: '5675656756885',	//订单的编号
						feeTypeDesc: '西药处方',	//费用类别描述
						payAmount: '126.00',	//支付金额
						orderInsuFlag: 'Y',	//医保结算标识（Y医保 N非医保）
					},
					{
						orderNo: '5675656756745',	//订单的编号
						feeTypeDesc: '微量元素检验',	//费用类别描述
						payAmount: '316.50',	//支付金额
						orderInsuFlag: 'Y',	//医保结算标识（Y医保 N非医保）
					},
					{
						orderNo: '5675656759998',	//订单的编号
						feeTypeDesc: '多普勒彩色超声检查',	//费用类别描述
						payAmount: '156.50',	//支付金额
						orderInsuFlag: 'N',	//医保结算标识（Y医保 N非医保）
					},
				],
				payMethod: 'zf',
				// allAmt: 0.00, //总金额
				insuAmt: 0.00, //医保支付金额
				surplusSelfAmt: 0.00, //还需支付金额
			};
		},
		async onLoad(option){
			this.waitPayInfo = uni.getStorageSync('wait-pay-info')
			console.log('waitPayInfo:',this.waitPayInfo)
			this.userInfo = uni.getStorageSync('userInfo')
		},
		computed:{
			...mapState(['paymentProvider']),
			//总金额
			allAmt: function () {
				let amt = 0.00
				let waitPayList = this.waitPayInfo.waitPayList || []
				if( waitPayList.length > 1 ){
					amt = waitPayList.reduce((prev,next) => {
						let prevAmt = prev.orderAmt || 0
						let nextAmt = next.orderAmt || 0
						return ((prevAmt * 100) + (nextAmt * 100))/100
					})
				}else if(waitPayList.length == 1){
					amt = waitPayList[0].orderAmt || 0.00
				}
				return amt
			},
			orderNos: function () {
				let nos = []
				let waitPayList = this.waitPayInfo.waitPayList || []
				if( waitPayList.length > 0 ){
					waitPayList.forEach((item) => {
						nos.push(item.orderNo)
					})
				}
				return nos.join(',')
			}
		},
		methods: {
			/* async findMyUsers(){
				const { outpatientList } = await this.$api.outpatient_user_query({userId: this.userInfo.userId, sensitiveEncFlag:0})
				console.log('我的就诊人：',outpatientList)
			}, */
			changePayMethod(val){
				if(val == 'yb'){
					// 医保预结算
				}
				this.payMethod = val
			},
			// 确认支付
			confirmPay22(){
				this.$refs.jdModal._warning({
				    title:`医嘱发生变更`,
				    content:`请刷新费用信息后再重试`,
					showCancel: false,
				    confirmText:'刷新费用信息',
					success:async(res)=>{
						if (res.confirm) {

						}
					}
				})
			},
			// 缴费下单
			async confirmPay(){
				let { outpatientId, cardId } = this.waitPayInfo.patientsInfo
				let param = {
					orgCode: this.waitPayInfo.orgCode,	//机构编码
					tradeType: config.order.FEE_OUTPATIENT,	//交易类型；见《附录》
					orderNos: this.orderNos,	//订单编号串，多个逗号分隔
					patientId: outpatientId,	//就诊人ID
					cardId: cardId,	//卡ID
					userId: this.userInfo.userId,	//用户ID
					openId: this.userInfo.openId,	//用户OPENID
					terminalType: config.pay.TERMINAL_TYPE['ALI_MP'].code,	//终端类型
					terminalId: 'a01'	//终端编号
				}
				const res = await this.$api.ihosp_fee_fee_create(param)
				console.log('缴费下单结果：',res)
				if(res.code == '200'){
					// 下单成功，调用支付下单
					this.feePay(res.feeId)
				}
			},
			// 缴费支付下单
			async feePay(feeId){
				let { outpatientId, cardId } = this.waitPayInfo.patientsInfo
				let param = {
					orgCode: this.waitPayInfo.orgCode,	//机构编码
					tradeType: config.order.PAYMENT_FEE,//交易类型；见《附录》
					feeId: feeId,	//缴费单号
					budgetId: '',	//预结算单号；如果支付方式带医保，必填
					patientId: outpatientId,	//就诊人ID；校验预结算是否是本人
					cardId: cardId,				//卡ID；校验预结算是否是本人
					userId: this.userInfo.userId,	//用户ID
					openId: this.userInfo.openId,	//用户OPENID
					selfType: config.pay.SELF_TYPE['LIVEIDPAY'].code,	//自费支付类型 LIVEIDPAY：生活号支付
					selfOption: config.pay.SELF_OPTION['AliPay'].code,	//自费支付方式
					authCode: '',	//付款码
					insuType: '',	//医保支付类型
					insuOption: '',	//医保支付方式
					terminalType: config.pay.TERMINAL_TYPE['ALI_MP'].code,	//终端类型
					terminalId: config.pay.TERMINAL_ID['A_01'].code			//终端编号
				}
				const res = await this.$api.ihosp_fee_fee_pay(param)
				console.log('缴费下单结果：',res)
				if(res.code == '200'){
					// 下单成功，拉起支付
					let _this = this
					uni.requestPayment({
						provider: _this.paymentProvider,
						orderInfo: res.outThirdNo,
						success: function (res) {
							console.log('Pay success:' + JSON.stringify(res));
							if( res.resultCode == "6001" ){
								//用户取消支付，关闭订单
								console.log('用户取消支付，关闭订单')
								_this.payClose(feeId)
								return
							}
							_this.queryPayResult(feeId)
						}, fail: function (err) {
							_this.$u.toast('支付异常')
							console.log('Pay fail(交费支付异常):' + JSON.stringify(err));
						}
					})
				}
			},
			// 查询支付结果
			queryPayResult(feeId){
				// feeId 缴费单号
				let param = {
					orgCode: this.waitPayInfo.orgCode, //机构编码
					tradeType: config.order.QUERY_PAYMENT, //交易类型
					source: config.pay.SOURCE['FEE'].code, //来源方
					srcOrderId: feeId, //来源方订单号
				}
				this.$refs.jdModal._loading({
					title:`支付结果确认`,
					content:`正在确认支付结果，请稍候...`,
				})
				let count = 0
				const queryResultFn = async()=> {
					try {
						const {paymentStatus} = await this.$api.ihosp_payment_query(param,{isShowLoading:false})
						// 支付中就继续轮询
						if((paymentStatus === 'PAY_PROCESSING' || paymentStatus === 'FEE_PROCESSING') && count < 5){
							count++
							setTimeout(()=>{
								queryResultFn()
							},3000)
						}else {
							this.$refs.jdModal.cancel()
							let { outpatientId,cardNo,cardType,cardId } = this.waitPayInfo.patientsInfo
							uni.navigateTo({
								url: `/pages/pay/payResult/index?feeId=${feeId}&orgCode=${this.waitPayInfo.orgCode}&patientId=${outpatientId}&cardNo=${cardNo}&cardType=${cardType}&cardId=${cardId}`
							})
						}
					}catch (e) {
						console.log(e);
						this.$refs.jdModal.cancel()
					}
				}
				queryResultFn()
			},
			payClose(feeId){
				this.$api.ihosp_fee_fee_close({feeId: feeId, tradeType: config.order.FEE_CLOSE, orgCode: this.waitPayInfo.orgCode})
			}
		}
	};
</script>

<style scoped lang="scss">
	.confirm-pay{
		.p-item-header{
			padding: 30rpx 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.p-title{
				color: $text-color-grey;
				font-size: $font-s-base;
				line-height: 28rpx;
			}
		}
	}
	.pi-body{
		background-color: $white;
		padding-left: 30rpx;
	}
	.cell-content{
		background-color: $white;
		border-radius: 0rpx;
		padding-left: 30rpx;
	}

	.pay-method{
		padding: 0rpx;
		.pay-icon{
			width: 44rpx;
			height: 44rpx;
			margin-right: 20rpx;
			&.pay-zf{
				@include bg-image('img/pay/icon-zf');
			}
			&.pay-yb{
				@include bg-image('img/pay/icon-yb');
			}
		}
		.cell-item-content{
			flex: 1;
			display: flex;
			justify-content: space-between;
		}
		.pay-yb-price{
			margin-left: 20rpx;
			.pay-yb-lab{
				font-size: $font-s-base;
				color: $text-color-grey;
			}
			.pay-price{
				margin-left: 4rpx;
				font-size: $font-s-base;
				color: $text-color-money;
			}
		}
		.option-box{
			width: 36rpx;
			height: 36rpx;
			background: #FFFFFF;
			border: 1rpx solid $line;
			box-sizing: border-box;
			border-radius: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			align-content: center;
			padding-top: 2rpx;
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
		.pay-zf-price{
			margin-left: 0rpx;
			.pay-zf-lab{
				font-size: $font-s-base;
				color: $text-color;
			}
			.pay-price{
				margin-left: 15rpx;
				font-size: $font-s-base;
				color: $text-color-money;
			}
		}
	}
</style>

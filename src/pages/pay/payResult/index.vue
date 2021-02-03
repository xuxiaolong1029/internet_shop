<template>
	<!-- 交费结果 -->
	<view class="pay-result">
		<u-line color="#D9D9D9"></u-line>
		<view class="pay-item-container">
			<view class="p-item-header">
				<view class="p-title">交费项目</view>
			</view>
			<view class="pi-body">
				<jd-collapse :accordion="true" class="collapse" @change="changeCollapse">
					<jd-collapse-item v-for="(item,index) in paymentItems" :key="item.orderNo"
						:showLine="index!=0"
						:iconsName="getStatus(item).iconsName"
						:iconsColor="getStatus(item).color"
						:title="item.feeTypeName"
						:name="item.orderNo"
						:value="'￥'+item.orderAmt"
						:show-animation="true" :valueStyle="{color:'#FF9C00'}"
						:contentStyle="{'padding-left':0}">
						<view class="pi-container">
							<view class="pic-info">
								<template v-if="getStatus(item).success">
									<view class="pic-info-tips" v-if="item.visitGuide">{{item.visitGuide}}</view>
									<jd-info-row label="执行科室" v-if="item.deptName" :val="item.deptName" :customStyle="{'line-height':'48rpx'}"></jd-info-row>
									<jd-info-row label="科室位置" v-if="item.deptAddress" :val="item.deptAddress" :customStyle="{'line-height':'48rpx'}"></jd-info-row>
								</template>
								<template v-else>
									<jd-info-row label="交费结果" v-if="item.feeStatus && item.feeStatus.value" :val="item.feeStatus.value" :customStyle="{'line-height':'48rpx'}" :valStyle="{'color':feeStatus(item).color}"></jd-info-row>
									<jd-info-row label="失败原因" v-if="item.failReason" :val="item.failReason" :customStyle="{'line-height':'48rpx'}" ></jd-info-row>
									<jd-info-row :label="item.insuStatus?'自费退款':'退款状态'" v-if="item.refundStatus" :val="item.refundStatus" :customStyle="{'line-height':'48rpx'}" :valStyle="{'color': refundStatus(item).color}"></jd-info-row>
									<view class="pic-info-tips" v-if="item.refundNotes" style="line-height:48rpx;">{{item.refundNotes}}</view>
								</template>
							</view>
							<view class="pic-options">
								<jd-button shape="circle" v-if="getStatus(item).showRetryingRefund"
										   :btn-style="{height:'48rpx',color:'#333333',border:'1rpx solid #D9D9D9','background-color':'#ffffff','font-size':'24rpx','margin-right':'20rpx'}"
										   type="primary" size="mini" font-size="24" @submit="retryingRefund()">重试退款</jd-button>
								<jd-button shape="circle" v-if="getStatus(item).showReconfirm"
										   :btn-style="{height:'48rpx',color:'#333333',border:'1rpx solid #D9D9D9','background-color':'#ffffff','font-size':'24rpx','margin-right':'20rpx'}"
										   type="primary" size="mini" font-size="24" @submit="reconfirm()">重试确认</jd-button>
								<jd-button shape="circle"
									:btn-style="{height:'48rpx',color:'#3071EA',border:'1rpx solid #3071EA','background-color':'#ffffff','font-size':'24rpx'}"
									type="primary" size="mini" font-size="24" @submit="toPayDetail(item)">查看详情</jd-button>
							</view>
						</view>
					</jd-collapse-item>
				</jd-collapse>
			</view>
			<view style="padding:60rpx 30rpx 30rpx">
				<template v-if="buttonArr[0]">
					<jd-button @submit="handleBtn(buttonArr[0])" type="primary" size="lg" :disabled="false" borderRadius="4rpx">{{buttonArr[0].label}}</jd-button>
				</template>

				<template v-if="buttonArr[1]">
					<jd-button @submit="handleBtn(buttonArr[1])" type="primary" size="lg"
							   :btn-style="{color:'#333333','background-color':'#ffffff','margin-top':'30rpx'}"
							   :disabled="false" borderRadius="4rpx">{{buttonArr[1].label}}</jd-button>
				</template>
			</view>
		</view>
		<!-- 网络异常 -->
		<view class="error-content" v-if="errorStatus">
			<jd-result text="网络异常" :textStyle="{'color':'#333333'}" subtext="暂无法确认支付结果，请稍后重试" src="/static/img/error_2x.png" marginTop="100"></jd-result>
			<view style="padding:0rpx 30rpx 30rpx;margin-top: -40rpx;">
				<jd-button @submit="" type="primary" size="lg" :disabled="false" borderRadius="4rpx" @submit="retryQuery">重试查询支付结果</jd-button>
			</view>
		</view>

		<jd-modal ref="jdModal"></jd-modal>
	</view>
</template>

<script>
	import cellItem from '@/customComponents/jd-cell-item/cell-item.vue';
	import jdButton from '@/customComponents/jd-button/index';
	import jdModal from '@/customComponents/jd-modal'
	import jdCollapse from '@/customComponents/jd-collapse/index'
	import jdCollapseItem from '@/customComponents/jd-collapse-item/index'
	import jdInfoRow from '@/viewComponents/jd-info-row/index'
	import jdResult from '@/customComponents/jd-result/index.vue';
	import config from '@/config';
	import {navigateBack} from '@/utils'

	export default {
		name: 'confirmRegister',
		components: {
			cellItem,jdButton,jdModal,jdCollapse,jdCollapseItem,jdInfoRow,jdResult
		},
		data() {
			return {
				feeId:'',
				orgCode:'',
				patientId:'',
				cardNo:'',
				cardType:'',
				cardId:'',
				activeItem: '',
				paymentItems: [],
				payMethod: 'zf',
				allAmt: 0.00, //总金额
				insuAmt: 0.00, //医保支付金额
				surplusSelfAmt: 0.00, //还需支付金额
				errorStatus: false,
				buttonArr:[]
			};
		},
		async onLoad(option){
			this.feeId = option.feeId
			this.orgCode = option.orgCode
			this.patientId = option.patientId
			this.cardNo = option.cardNo
			this.cardType = option.cardType
			this.cardId = option.cardId
			this.queryPayResult()
			this.getButtonName()
		},
		methods: {
			// 查询交费结果
			async queryPayResult(){
				// let param = {"orgCode":"54452","tradeType":"QUERY_LIST_FEE","feeId":"12088298010934591488","pageNo":1,"pageSize":100}
				let param = {
					orgCode: this.orgCode,
					tradeType: config.order.QUERY_LIST_FEE,
					feeId: this.feeId,
					pageNo: 1,
					pageSize: 100
				}
				await this.$api.fee_query_list(param).then(result=>{
					let list= result.feeSubInfoPage.records || []
					console.log('缴费结果：',list)
					this.paymentItems = list
				}).catch(()=>{
					//联网失败, 结束加载
					this.errorStatus = true
				})
			},
			getStatus(item){
				let s= item.productStatus?item.productStatus.code:''
				// 产品状态
				const status = {
					'FEE_SUCCEED': {iconsName:'checkmark-circle-fill',color:'#3071EA',success:true}, // 成功
					'FEE_UNKNOWN': {iconsName:'error-circle-fill',color:'#FF9C00', showReconfirm:true}, // 交费异常
					'REFUND_UNKNOWN': {iconsName:'error-circle-fill',color:'#FF9C00', showRetryingRefund:true}, // 交费异常

				};
				return status[s] || {iconsName:'error-circle-fill',color:'#FF9C00'}
			},
			feeStatus(item){
				let s= item.feeStatus?item.feeStatus.code:''
				// 缴费状态
				const status = {
					'FEE_SUCCEED': {color:'#333333'}, // 缴费成功
					'FEE_UNKNOWN': {color:'#FF9C00'}, // 缴费异常
					'FEE_FAILED': {color:'#FF4949'}, // 缴费失败
				};
				return status[s] || {color:'#333333'}
			},
			refundStatus(item){
				let s= item.refundStatus || ''
				let rs = {color:'#333333'}
				// 缴费状态
				if(s.includes('成功')){
					rs = {color:'#12CE8A'}
				}else if(s.includes('异常')){
					rs = {color:'#FF9C00'}
				}else if(s.includes('失败')){
					rs = {color:'#FF4949'}
				}
				return rs
			},
			async getButtonName(){
				let list = this.paymentItems || []
				let feeUnknown = 0
				let refundUnknown = 0
				let feeSucceed = 0

				// let res = await this.$api.ihosp_regist_cancel({registId:item.registId,tradeType:item.tradeTypeCode,orgCode:item.orgCode})
				let {dataList} = await this.$api.ihosp_fee_query_list({
					orgCode:this.orgCode,
					tradeType:config.order.QUERY_LIST_WAIT_FEE,
					patientId: this.patientId,
					cardNo: this.cardNo,
					cardType: this.cardType,
					cardId: this.cardId
				});
				let payCount = dataList && dataList.length

				list.forEach((item)=>{
					let productStatus= item.productStatus?item.productStatus.code:''
					switch (productStatus){
						case 'FEE_UNKNOWN':	//缴费异常
							feeUnknown++
							break;
						case 'REFUND_UNKNOWN':	//退款异常
							refundUnknown++
							break;
						case 'FEE_SUCCEED':	//缴费成功
							feeSucceed++
							break;
					}
				})

				let buttons = []
				if(feeUnknown>0 && refundUnknown>0){
					// 同时有退款异常和缴费异常的单
					buttons = [{label:'重试退款+重试确认交费结果',type:'retryingRefundConfirm'}]
				}else if(feeUnknown>0){
					// 有缴费异常
					buttons = [{label:'重试确认交费结果',type:'confirm'}]
				}else if(refundUnknown>0){
					// 有退款异常
					buttons = [{label:'重试退款',type:'retryingRefund'}]
				}else if(feeSucceed == list.length && payCount>0){
					// 所有单交费成功还有待缴费项目
					buttons = [{label:`继续交费(还有${payCount}笔)`,type:'continuePay'},{label:'返回首页',type:'toHome'}]
				}else if(feeSucceed == list.length){
					// 所有单都成功 无待交费项目
					buttons = [{label:'查看交费记录',type:'queryPayRecord'},{label:'返回首页',type:'toHome'}]
				}

				this.buttonArr = buttons||[]
			},
			handleBtn(item){
				let type = item.type;
				const handle={
					// 查看交费记录
					'queryPayRecord': this.queryPayRecord,
					// 重试退款+重试确认交费结果
					'retryingRefundConfirm': this.retryingRefund,
					// 重试确认交费结果
					'confirm': this.reconfirm,
					// 重试退款
					'retryingRefund': this.retryingRefund,
					// 返回首页
					'toHome': this.toHome,
					// 继续缴费
					'continuePay': this.continuePay
				};
				return handle[type]()
			},
			changeCollapse(item){
				this.activeItem = item
			},
			toPayDetail(item){
				//查看详情
				uni.navigateTo({
					url:`/pages/pay/record/details?orderNo=${item.orderNo}&orgCode=${this.orgCode}&feeSubId=${item.feeSubId}&tradeType=${config.order.QUERY_DETAIL_FEE}`
				});
			},
			queryPayRecord(){
				//查看缴费记录
				uni.navigateTo({
					url:`/pages/pay/record/index?patientId=${this.patientId}`
				});
			},
			toHome(){
				uni.reLaunch({
					url: '/pages/tabBar/home/index'
				})
			},
			// 重试确认
			async reconfirm(){
				this.$refs.jdModal._loading({
					title:`重试确认交费结果`,
					content:`正在确认交费结果，请稍候...`,
					success:async(res)=>{
						if (res.confirm) {}
					}
				})
				await this.queryPayResult()
				this.$refs.jdModal.cancel()
			},
			// 重试退款
			async retryingRefund(){
				this.$refs.jdModal._loading({
					title:`退款申请`,
					content:`正在申请退款，请稍候...`,
					success:async(res)=>{
						if (res.confirm) {}
					}
				})
				await this.queryPayResult()
				this.$refs.jdModal.cancel()
			},
			// 重试查询支付结果
			async retryQuery(){
				this.$refs.jdModal._loading({
					title:`支付结果查询`,
					content:`正在查询支付结果，请稍候...`,
					success:async(res)=>{
						if (res.confirm) {}
					}
				})
				await this.queryPayResult()
				this.$refs.jdModal.cancel()
			},
            // 继续交费
			continuePay(){
                navigateBack({
                    delta:2,
                    params:{},
                })
            }

		}
	};
</script>

<style scoped lang="scss">
	.pay-result{
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
	.pi-body{
		background-color: $white;
		padding-left: 30rpx;
	}
	.pi-container{
		padding: 0 30rpx 30rpx 0;
		.pic-info{
			background-color: $bg-color-blue;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			padding: 20rpx;
			.pic-info-tips{
				font: $font-s-base;
				color: $text-color;
				line-height: 1;
			}
		}
		.pic-options{
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
		}
	}
	.cell-content{
		background-color: $white;
		border-radius: 0rpx;
		padding-left: 30rpx;
	}

	.error-content{
		width: 100%;
		height: calc(50vh - 88rpx);
	}
</style>

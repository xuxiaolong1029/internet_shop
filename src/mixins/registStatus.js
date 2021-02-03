
import config from '@/config'
export default {
	data() {
		return {
			registId: '',	//挂号单订单号
			registResult: {},
			userInfo: {},
			REGISTER_STATUS: config.common.REGISTER_STATUS,
			REGIST_PAY_STATUS: config.common.REGIST_PAY_STATUS
		};
	},
	computed:{
		detailStatus(){
			let s = this.registResult.productStatus && this.registResult.productStatus.code
			if(!s){ return {} }
			let val = this.registResult.productStatus && this.registResult.productStatus.value
			let statusArr = {
				[this.REGISTER_STATUS['PAY_INIT'].value]: { title: val, iconName: '', color: '#2979ff' },  		// 待支付
				[this.REGISTER_STATUS['PAY_PROCESSING'].value]: { title: val, iconName: '', color: '#2979ff' },	// 支付中
				[this.REGISTER_STATUS['PAY_SUCCEED'].value]: { title: val, iconName: '', color: '#2979ff' },  	// 预约中
				[this.REGISTER_STATUS['PAY_FAILED'].value]: { title: val, iconName: '', color: '#FF4949' },  		// 挂号、预约失败
				[this.REGISTER_STATUS['PAY_UNKNOWN'].value]: { title: val, iconName: '', color: '#FF9C00' },  	// 支付异常
				[this.REGISTER_STATUS['REGIST_SUCCEED'].value]: { title: val, iconName: '', color: '#12CE8A' },	// 挂号、预约成功
				[this.REGISTER_STATUS['REGIST_PROCESSING'].value]: { title: val, iconName: '', color: '#2979ff' },// 挂号、预约处理中
				[this.REGISTER_STATUS['REGIST_FAILED'].value]: { title: val, iconName: '', color: '#FF4949' },  	// 挂号、预约失败
				[this.REGISTER_STATUS['REGIST_UNKNOWN'].value]: { title: val, iconName: '', color: '#FF9C00' },  	//挂号、预约异常
				[this.REGISTER_STATUS['REFUND_INIT'].value]: { title: val, iconName: '', color: '#2979ff' },  	// 待退款
				[this.REGISTER_STATUS['REFUND_PROCESSING'].value]: { title: val, iconName: '', color: '#2979ff' },// 退款中
				[this.REGISTER_STATUS['REFUND_SUCCEED'].value]: { title: val, iconName: '', color: '#2979ff' },  	// 取消中
				[this.REGISTER_STATUS['REFUND_FAILED'].value]: { title: val, iconName: '', color: '#FF4949' },  	// 取消失败
				[this.REGISTER_STATUS['REFUND_UNKNOWN'].value]: { title: val, iconName: '', color: '#FF9C00' },  	// 退款异常
				[this.REGISTER_STATUS['CANCEL_SUCCEED'].value]: { title: val, iconName: '', color: '#999999' },  	// 取消成功
				[this.REGISTER_STATUS['CANCEL_FAILED'].value]: { title: val, iconName: '', color: '#FF4949' },  	// 取消失败
				[this.REGISTER_STATUS['CANCEL_UNKNOWN'].value]: { title: val, iconName: '', color: '#FF9C00' },  	// 取消异常
				[this.REGISTER_STATUS['FETCH_SUCCEED'].value]: { title: val, iconName: '', color: '#333333' },  	// 已取号
				[this.REGISTER_STATUS['RETURN_SUCCEED'].value]: { title: val, iconName: '', color: '#333333' },  	// 已退号
				[this.REGISTER_STATUS['COMPLETED'].value]: { title: val, iconName: '', color: '#333333' }			// 已完成
			}
			return statusArr[s] || { title: val, iconName: '', color: '#FF9C00' }
		},
		registType(){
			// REGIST_PRE, //预约挂号
			// REGIST_DAY //当日挂号
			let type = this.registResult.tradeTypeCode
			return config.common.REGIST_TYPE[type]
		},
		registStatus(){
			return this.registResult.productStatus && this.registResult.productStatus.code
		},
		refundSuccess(){
			let selfStatus = this.registResult.selfStatus && this.registResult.selfStatus.code
			let insuStatus = this.registResult.insuStatus && this.registResult.insuStatus.code
			if(insuStatus!=null){
				// 自费+医保是否退款成功
				return this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value == selfStatus && (this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value == insuStatus || this.REGIST_PAY_STATUS['PAY_FAILED'].value == insuStatus)
			}else{
				// 自费是否退款成功
				return this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value == selfStatus
			}
		},
		registerStatus(){
			let s = this.registResult.productStatus && this.registResult.productStatus.code
			let val = this.registResult.productStatus && this.registResult.productStatus.value
			let rtText = this.registType
			const statusArr = {
				[this.REGISTER_STATUS['REGIST_SUCCEED'].value]: { title: val, iconName: 'checkmark-circle-fill', iconColor: '#2979ff', tips: rtText=='挂号'?'请前往科室分诊台签到候诊':'就诊当天请凭预约单号取号就诊' },// 成功
				[this.REGISTER_STATUS['PAY_UNKNOWN'].value]: { title: val, iconName: 'error-circle-fill', iconColor: '#FF9C00', tips: '因网络原因暂无法确认支付结果' },	// 支付异常
				[this.REGISTER_STATUS['PAY_FAILED'].value]: { title: val, iconName: 'error-circle-fill', iconColor: '#FF4949', tips: this.refundSuccess?'退款一般会在48小时内原路退还':'退款异常，请稍后重试退款' }, // 挂号失败
				[this.REGISTER_STATUS['REGIST_FAILED'].value]: { title: val, iconName: 'error-circle-fill', iconColor: '#FF4949', tips: this.refundSuccess?'退款一般会在48小时内原路退还':'退款异常，请稍后重试退款' },// 挂号失败
				[this.REGISTER_STATUS['REGIST_UNKNOWN'].value]: { title: val, iconName: 'error-circle-fill', iconColor: '#FF9C00', tips: '因网络原因暂无法确认预约结果' },// 异常
				[this.REGISTER_STATUS['REGIST_PROCESSING'].value]: { title: val, iconName: 'checkmark-circle-fill', iconColor: '#2979ff', tips: '' }// 挂号中
			}
			return statusArr[s] || { title: val, iconName: 'error-circle-fill', iconColor: '#FF9C00', tips: '' }
		},
		selfStatus(){
			//自费支付状态显示转换
			let s = this.registResult.selfStatus && this.registResult.selfStatus.code
			let val = this.registResult.selfStatus && this.registResult.selfStatus.value
			const statusArr = {
				[this.REGIST_PAY_STATUS['PAY_INIT'].value]: { text: val, cls: 'dark', label: '' },	// 未支付
				[this.REGIST_PAY_STATUS['PAY_PROCESSING'].value]: { text: val, cls: 'dark', label: '' },// 支付中
				[this.REGIST_PAY_STATUS['PAY_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 已支付
				[this.REGIST_PAY_STATUS['PAY_FAILED'].value]: { text: val, cls: 'danger', label: '' },// 支付失败
				[this.REGIST_PAY_STATUS['PAY_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' },// 支付异常
				[this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 退款成功
				[this.REGIST_PAY_STATUS['REFUND_FAILED'].value]: { text: val, cls: 'danger', label: '' },// 退款失败
				[this.REGIST_PAY_STATUS['REFUND_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' }// 退款异常
			}
			return statusArr[s] || { text: val, cls: '', label: '' }
		},
		insuStatus(){
			//医保支付状态显示转换
			let s = this.registResult.insuStatus && this.registResult.insuStatus.code
			let val = this.registResult.insuStatus && this.registResult.insuStatus.value
			const statusArr = {
				[this.REGIST_PAY_STATUS['PAY_INIT'].value]: { text: val, cls: 'dark', label: '' },	// 未支付
				[this.REGIST_PAY_STATUS['PAY_PROCESSING'].value]: { text: val, cls: 'dark', label: '' },// 支付中
				[this.REGIST_PAY_STATUS['PAY_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 已支付
				[this.REGIST_PAY_STATUS['PAY_FAILED'].value]: { text: '医保结算失败', cls: 'danger', label: '未扣款' },// 支付失败
				[this.REGIST_PAY_STATUS['PAY_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' },// 支付异常
				[this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 退款成功
				[this.REGIST_PAY_STATUS['REFUND_FAILED'].value]: { text: val, cls: 'danger', label: '' },// 退款失败
				[this.REGIST_PAY_STATUS['REFUND_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' }// 退款异常
			}
			return statusArr[s] || { text: val, cls: '', label: '' }
		},
		paySuccess(){
			//挂号诊金支付状态显示转换
			let s = this.registResult.payStatus && this.registResult.payStatus.code
			let val = this.registResult.payStatus && this.registResult.payStatus.value
			const statusArr = {
				[this.REGIST_PAY_STATUS['PAY_INIT'].value]: { text: val, cls: 'dark', label: '' },	// 未支付
				[this.REGIST_PAY_STATUS['PAY_PROCESSING'].value]: { text: val, cls: 'dark', label: '' },// 支付中
				[this.REGIST_PAY_STATUS['PAY_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 已支付
				[this.REGIST_PAY_STATUS['PAY_FAILED'].value]: { text: val, cls: 'danger', label: '' },// 支付失败
				[this.REGIST_PAY_STATUS['PAY_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' },// 支付异常
				[this.REGIST_PAY_STATUS['REFUND_SUCCEED'].value]: { text: val, cls: 'dark', label: '' },// 退款成功
				[this.REGIST_PAY_STATUS['REFUND_FAILED'].value]: { text: val, cls: 'danger', label: '' },// 退款失败
				[this.REGIST_PAY_STATUS['REFUND_UNKNOWN'].value]: { text: val, cls: 'warning', label: '' }// 退款异常
			}
			return statusArr[s] || { text: val, cls: '', label: '' }
		},
		showRetryQuery(){
			// 支付异常，重试查询支付结果
			return this.registStatus == this.REGISTER_STATUS['PAY_UNKNOWN'].value
		},
		showRetryRefund(){
			// 重试退款: 挂号、预约失败或取消成功+退款异常
			return ( this.registStatus == this.REGISTER_STATUS['REGIST_FAILED'].value || this.registStatus == this.REGISTER_STATUS['PAY_FAILED'].value || this.registStatus == this.REGISTER_STATUS['CANCEL_SUCCEED'].value ) && !this.refundSuccess
		},
		showRetryConfirm(){
			// 重试确认挂号、预约结果: 挂号、预约异常
			return this.registStatus == this.REGISTER_STATUS['REGIST_UNKNOWN'].value
		},
		showAgainRegist(){
			// 再次挂号、预约: （挂号、预约失败或取消成功+退款成功）或者 已完成
			return ((this.registStatus == this.REGISTER_STATUS['REGIST_FAILED'].value || this.registStatus == this.REGISTER_STATUS['PAY_FAILED'].value || this.registStatus == this.REGISTER_STATUS['CANCEL_SUCCEED'].value ) && this.refundSuccess) || this.REGISTER_STATUS['COMPLETED'].value == this.registStatus
		},
		showToHome(){
			// 返回首页: （挂号、预约失败或取消成功+退款成功）或者 挂号、预约成功
			return ((this.registStatus == this.REGISTER_STATUS['REGIST_FAILED'].value || this.registStatus == this.REGISTER_STATUS['PAY_FAILED'].value) && this.refundSuccess) || this.registStatus == this.REGISTER_STATUS['REGIST_SUCCEED'].value
		},
		registSuccess(){
			// 挂号、预约成功
			return this.registStatus == this.REGISTER_STATUS['REGIST_SUCCEED'].value
		},
		showCancelRegist(){
			// 取消挂号、预约：待支付 或 挂号、预约成功
			return (this.registStatus == this.REGISTER_STATUS['PAY_INIT'].value || this.registStatus == this.REGISTER_STATUS['REGIST_SUCCEED'].value)
		},
		showOptions(){
			// 是否显示操作按钮：不等于支付中 && 不等于挂号、预约中
			return this.registStatus != this.REGISTER_STATUS['PAY_PROCESSING'].value && this.registStatus != this.REGISTER_STATUS['PAY_SUCCEED'].value
		},


	},
    methods:{

    }
}

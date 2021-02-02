
import config from '@/config'
export default {
	data() {
		return {
			registId: '',	//挂号单订单号
			registResult: {},
			userInfo: {},
			REGISTER_STATUS: config.common.REGISTER_STATUS
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
			return 'REFUND_SUCCEED' == selfStatus && ('REFUND_SUCCEED' == insuStatus || 'PAY_FAILED' == insuStatus)
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
			let status = this.registResult.selfStatus && this.registResult.selfStatus.code
			let val = this.registResult.selfStatus && this.registResult.selfStatus.value
			let stat = null
			switch (status){
				case 'PAY_INIT':
					stat = { text: '未支付', cls: '', label: '' }
					break;
				case 'PAY_PROCESSING':
					stat = { text: '支付中', cls: 'dark', label: '' }
					break;
				case 'PAY_SUCCEED':
					stat = { text: '已支付', cls: '', label: '' }
					break;
				case 'PAY_FAILED':
					stat = { text: '支付失败', cls: 'danger', label: '' }
					break;
				case 'PAY_UNKNOWN':
					stat = { text: '支付异常', cls: 'warning', label: '' }
					break;
				case 'REFUND_SUCCEED':
					stat = { text: '退款成功', cls: 'dark', label: '' }
					break;
				case 'REFUND_FAILED':
					stat = { text: '退款失败', cls: 'danger', label: '' }
					break;
				case 'REFUND_UNKNOWN':
					stat = { text: '退款异常', cls: 'warning', label: '' }
					break;
				default:
					stat = { text: val, cls: '', label: '' }
					break;
			}
			return stat
		},
		insuStatus(){
			//医保支付状态显示转换
			let status = this.registResult.insuStatus && this.registResult.insuStatus.code
			let val = this.registResult.insuStatus && this.registResult.insuStatus.value
			let stat = null
			switch (status){
				case 'PAY_INIT':
					stat = { text: '未支付', cls: '', label: '' }
					break;
				case 'PAY_PROCESSING':
					stat = { text: '支付中', cls: 'dark', label: '' }
					break;
				case 'PAY_SUCCEED':
					stat = { text: '已支付', cls: 'dark', label: '' }
					break;
				case 'PAY_FAILED':
					stat = { text: '医保结算失败', cls: 'danger', label: '未扣款' }
					break;
				case 'PAY_UNKNOWN':
					stat = { text: '支付异常', cls: 'warning', label: '' }
					break;

				case 'REFUND_SUCCEED':
					stat = { text: '退款成功', cls: 'dark', label: '' }
					break;
				case 'REFUND_FAILED':
					stat = { text: '退款失败', cls: 'danger', label: '' }
					break;
				case 'REFUND_UNKNOWN':
					stat = { text: '退款异常', cls: 'warning', label: '' }
					break;
				default:
					stat = { text: val, cls: '', label: '' }
					break;
			}
			return stat
		},
		paySuccess(){
			//挂号诊金支付状态显示转换
			let status = this.registResult.payStatus && this.registResult.payStatus.code
			let val = this.registResult.payStatus && this.registResult.payStatus.value
			let stat = null
			switch (status){
				case 'PAY_INIT':
					stat = { text: '未支付', cls: 'dark', label: '' }
					break;
				case 'PAY_PROCESSING':
					stat = { text: '支付中', cls: 'dark', label: '' }
					break;
				case 'PAY_SUCCEED':
					stat = { text: '已支付', cls: 'dark', label: '' }
					break;
				case 'PAY_FAILED':
					stat = { text: '支付失败', cls: 'dark', label: '' }
					break;
				case 'PAY_UNKNOWN':
					stat = { text: '支付异常', cls: 'dark', label: '' }
					break;
				case 'REFUND_SUCCEED':
					stat = { text: '退款成功', cls: 'dark', label: '' }
					break;
				case 'REFUND_FAILED':
					stat = { text: '退款失败', cls: 'danger', label: '' }
					break;
				case 'REFUND_UNKNOWN':
					stat = { text: '退款异常', cls: 'warning', label: '' }
					break;
				default:
					stat = { text: val, cls: '', label: '' }
					break;
			}
			return stat
		},
	},
    methods:{

    }
}

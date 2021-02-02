<template>
	<!-- 确认挂号 -->
	<view class="confirm-register">
		<u-line color="#D9D9D9"></u-line>
		<!-- 医生信息 start -->
		<jd-doctor-info :doctor="confirmInfo" :showFollow="false" :showIntrod="false" :showOrg="false">
			<template v-slot:content>
				<view class="cr-content">
					<view class="cr-row">
						<view class="cr-label">时间</view>
						<view class="cr-val">{{confirmInfo.date + confirmInfo.time}}<text class="cr-t-val">{{confirmInfo.when}}</text></view>
					</view>
					<view class="cr-row">
						<view class="cr-label">序号</view>
						<view class="cr-val">{{confirmInfo.numId}}</view>
					</view>
					<view class="cr-row">
						<view class="cr-label">费用</view>
						<view class="cr-val"><text class="cr-money">￥{{confirmInfo.cost}}</text><text class="cr-t-val" v-if="confirmInfo.numType">({{ NUM_TYPE[confirmInfo.numType] }})</text></view>
					</view>
				</view>
			</template>
		</jd-doctor-info>

		<!-- 就诊人 -->
		<view class="select-patient">
			<view class="sp-header">
				<view class="title">选择就诊人</view>
				<view class="option-btn" @click="toAddPatient">
					<u-icon name="plus" color="#2979ff" size="28" style="font-weight: 600;"></u-icon>
					<view class="option-text">添加就诊人</view>
				</view>
			</view>
			<view class="sp-content">
				<scroll-view class="scroll-view" scroll-x="true">
					<view class="scroll-content">
						<view class="gap"></view>
						<template v-for="(item,index) in patientList">
							<view :key="index" class="sp-item" :class="{'active':activePatient==item.outpatientId}" @click="changePatient(item)">
								<view class="avatar">
									<u-avatar size="80" :src="item.headImgUrl" />
								</view>
								<view class="info">
									<view class="top">
										<view class="name-lab">{{item.name}}</view>
										<jd-tag :text="RELATION_TYPE[item.relation]" mode="light" :type="item.relation=='1'?'success':'primary'"/>
									</view>
									<view class="body">
										<view class="age">{{item.age || 0}}岁</view>
										<view class="gender-icon" :class="{'women':item.sex=='F'}"></view>
									</view>
								</view>
								<view class="arrow-up"><u-icon name="arrow-up-fill" color="#FFFFFF" size="28" margin-bottom="0"></u-icon></view>
							</view>
						</template>
						<view class="gap" style="padding: 1rpx 5rpx 0;"></view>
					</view>
				</scroll-view>
			</view>
			<view class="sp-card-info" v-show="activePatient!=''">
				<view class="cell-content">
					<jd-cell-item :title="CARD_TYPE_NAME[activeCard.cardType]" :value="activeCard.cardNo" :index="activeCard.cardNo" @clickItem="selectCard"></jd-cell-item>
					<u-line color="#D9D9D9"></u-line>
					<jd-cell-item title="手机号" :value="changeMobileNo" index="1" @clickItem="showEditPhoneAlert"></jd-cell-item>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="pay-method" v-show="activePatient!=''">
			<view class="pm-header">
				<view class="pm-title">支付方式</view>
			</view>
			<view class="pm-body">
				<view class="cell-content">
					<pay-type title="自费支付" :showIcon="true" index="zf" @clickItem="changePayMethod">
						<template v-slot:icon>
							<view class="pay-icon pay-zf"></view>
						</template>
						<template v-slot:button>
							<view class="option-box">
								<u-icon name="checkmark-circle-fill" color="#2979ff" size="44" v-if="payMethod=='zf'"></u-icon>
							</view>
						</template>
					</pay-type>
					<!--
					<u-line color="#D9D9D9"></u-line>
					<pay-type title="医保支付" :showIcon="true" index="yb" @clickItem="changePayMethod">
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
					</pay-type> -->
				</view>
			</view>
		</view>

		<!-- 操作 -->
		<view class="bottom-options flex-r-center" v-show="activePatient != '' && currentCardNo!='' && payMethod!=''">
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
						<text class="pay-price">￥{{ confirmInfo.cost }}</text>
					</view>
				</template>
			</jd-button>
			<jd-button size="lg" style="flex:1" :btn-style="{flex:1,height:'98rpx',borderRadius: 0}" type="primary" @submit="registerPay" >确认支付</jd-button>
		</view>

		<jd-select-card
			ref="jdSelectCard"
			v-model="showSelectCard"
			:current="currentCardNo"
			:list="cardList"
			@changeCard="changeCard" @manageCard="manageCard">
		</jd-select-card>

		<jd-alert-container :show="showEditPhone" height="292rpx" width="556rpx" :showClose="false" @close="closeEditPhone">
			<view class="edit-phone-alert">
				<view class="ep-title">编辑手机号</view>
				<view class="ep-content">
					<u-input v-model="mobileNo" type="text" :border="true" :height="56" border-color="#" maxlength="11" :focus="mobileFocus" :clearable="false"/>
				</view>
				<view class="ep-options">
					<view class="cancel-btn" @click="closeEditPhone">取消</view>
					<view class="confirm-btn" @click="savePhone">保存</view>
				</view>
			</view>
		</jd-alert-container>

		<jd-modal ref="jdModal"></jd-modal>
	</view>
</template>

<script>
	import jdDoctorInfo from '@/viewComponents/jd-doctor-info/index.vue';
	import jdCellItem from '@/customComponents/jd-cell-item/index.vue';
	import jdButton from '@/customComponents/jd-button/index';
	import jdSelectCard from '@/customComponents/jd-action-sheet-popup/select-card.vue';
	import payType from '@/customComponents/jd-cell-item/pay-type.vue';
	import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
	import jdTag from '@/customComponents/jd-tag/index'
	import jdModal from '@/customComponents/jd-modal'
	import { mapState } from 'vuex'
	import config from '@/config';
	const {NUM_TYPE, RELATION_TYPE, CARD_TYPE_NAME} = config.common

	export default {
		name: 'confirmRegister',
		components: {
			jdDoctorInfo,jdCellItem,jdButton,jdSelectCard,payType,jdAlertContainer,jdTag,jdModal
		},
		data() {
			return {
				NUM_TYPE,
				RELATION_TYPE,
				CARD_TYPE_NAME,	//卡类型
				confirmInfo: {},
				registerInfo: {},
				userInfo: {},
				patientList:[],
				activePatient: '',
				changePatientInfo: {},
				mobileNo: '',
				payMethod: 'zf',
				showSelectCard: false,	//显示选卡弹出框
				showEditPhone: false,	//显示修改手机号弹出框
				mobileFocus: false,	//手机号编辑框自动获取焦点
				currentCardNo: '',
				cardList: [],
				activeCard: {},	//选择的卡
				insuAmt: 0.00, //医保支付金额
				surplusSelfAmt: 0.00, //还需支付金额
				budget:{},	//预结算结果
				registCreateInfo: {},	//挂号下单结果
				outpatientId: '',	//就诊人
				isAddCard: 0,	//是否跳转过添加卡页面
				isAddPatient: 0,//是否跳转过添加就诊人页面
			}
		},
		async onLoad(option){
			let _this = this
			this.confirmInfo = this.$store.state.register.confirmInfo
			this.registerInfo = this.$store.state.register.registerInfo
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow(){
		    //是否已经登录，已经登录就查询我的就诊人
		    if(this.userInfo && this.userInfo.userId){
		    	// 查询就诊人列表
		    	this.findMyUsers()
		    }
		},
		computed:{
			...mapState(['paymentProvider']),
			changeMobileNo: function () {
				return this.changePatientInfo.mobileNo || this.userInfo.mobileNo
			}
		},
		methods: {
			setOutPatientId(obj){
				console.log(obj)
				this.outpatientId = obj.outpatientId
			},
			async findMyUsers(){
				const { outpatientList } = await this.$api.outpatient_user_query({userId: this.userInfo.userId, sensitiveEncFlag:0})
				console.log('我的就诊人：',outpatientList)
				this.patientList = outpatientList || []
				// 没有就诊人，跳转到添加就诊人页面
				if(this.patientList.length == 0 && this.isAddPatient == 0){
					this.toAddPatient()
					return
				}
				this.isAddPatient = 0
				// 添加就诊人跳回来，就选中对应就诊人
				if(this.outpatientId!=null && this.outpatientId!=''){
					this.activePatient = this.outpatientId
				}
				if(this.patientList.length > 0 && this.activePatient!=null && this.activePatient!=''){
					let patient = null
					this.patientList.map((item) => {
						if(item.outpatientId == this.activePatient){
							patient = item
						}
					})
					if(patient){
						this.changePatient(patient)
					}
				}
			},
			async findCardList(val){
				let { cardInfoList } = await this.$api.ihosp_my_patient_card({
					orgCode: this.registerInfo.orgCode,
					userId: this.userInfo.userId,
					outpatientId: val
				})
				console.log('就诊卡：',cardInfoList)
				this.cardList = cardInfoList || []
				if( this.cardList.length > 0 ){
					//默认选中第一张卡
					this.activeCard = this.cardList[0]
					this.currentCardNo = this.activeCard.cardNo
					this.isAddCard = 0
				}else if(this.isAddCard==0){
					this.isAddCard = 1
					// 没有就诊卡，跳转到添加就诊卡页面
					let param = `?type=add&name=${this.changePatientInfo.name}&outpatientId=${this.changePatientInfo.outpatientId}`
					this.toAddCard(param)
				}else{
					this.isAddCard = 0
					this.changePatientInfo = {}
					this.activePatient = ''
					this.mobileNo = ''
					this.activeCard = {}
					this.currentCardNo = ''
				}
			},
			// 医保预结算
			async registBudget(){
				let param = this.registerInfo
				param.tradeType = config.order.BUDGET_PRE
				param.patientId = this.activePatient//就诊人ID
				param.cardId = this.activeCard.cardId	//卡ID
				param.terminalType = config.pay.TERMINAL_TYPE['ALI_MP'].code	//终端类型
				param.terminalId = config.pay.TERMINAL_ID['A_01'].code			//终端编号
				delete param.outpatAddress
				delete param.schDate
				const res = await this.$api.ihosp_regist_budget(param)
				console.log('医保预结算：',res)
				if(res.code == '200'){
					this.budget = res
					this.surplusSelfAmt = res.selfAmt
					this.insuAmt = res.insuAmt
				}else {
					uni.showModal({
					    title: '提示',
					    content: '您还未在院内医保建档',
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					})
				}
			},
			// 提交挂号单
			async registerPay(){
				let param = this.registerInfo
				param.patientId = this.activePatient	//就诊人ID
				param.cardId = this.activeCard.cardId	//卡ID
				param.terminalType = config.pay.TERMINAL_TYPE['ALI_MP'].code	//终端类型
				param.terminalId = config.pay.TERMINAL_ID['A_01'].code			//终端编号
				param.userId = this.userInfo.userId	//用户ID
				const res = await this.$api.ihosp_regist_create(param)
				console.log('提交挂号单：',res)
				if(res.code == '200'){
					this.registCreateInfo = res
					// 下单成功，调用支付
					this.registOrderPay(res.registId)
				}else {
					this.$u.toast('提交订单失败')
				}
			},
			// 挂号单支付
			async registOrderPay(registId){
				let _this = this
				let param = {
					tradeType: config.order.PAYMENT_REGIST,// 交易类型 'PAYMENT_REGIST':挂号单支付
					orgCode: this.registerInfo.orgCode,	//机构编码
					registId: registId,		//挂号单编号
					patientId: this.activePatient,	//就诊人ID；校验预结算是否是本人
					cardId: this.activeCard.cardId,	//卡ID；校验预结算是否是本人
					selfType: config.pay.SELF_TYPE['LIVEIDPAY'].code, 	//自费支付类型	--生活号支付
					selfOption:config.pay.SELF_OPTION['AliPay'].code,	//自费支付方式
					terminalType:config.pay.TERMINAL_TYPE['ALI_MP'].code,	//终端类型
					terminalId: config.pay.TERMINAL_ID['A_01'].code,		//终端编号
					openId: this.userInfo.openId	//用户openId
				}
				const res = await this.$api.ihosp_regist_pay(param)
				console.log('挂号单支付结果：',res)
				if(res.succeed){
					// 挂号单支付成功
					uni.requestPayment({
						provider: _this.paymentProvider,
						orderInfo: res.outThirdNo, // ==tradeNO
						success: function (res) {
							console.log('Pay success:' + JSON.stringify(res));
							if( res.resultCode == "6001" ){
								//用户取消支付，关闭订单
								console.log('用户取消支付，关闭订单')
								_this.registClose(registId)
								return
							}
							_this.queryRegistResult(registId)
						}, fail: function (err) {
							_this.$u.toast('支付异常')
							console.log('Pay fail(支付异常):' + JSON.stringify(err));
						}
					})
				}
			},
			queryRegistResult(registId){
				// uni.showLoading({title:'支付中...',mask:true})
				this.$refs.jdModal._loading({
					title:`支付结果确认`,
					content:`正在确认支付结果，请稍候...`,
				})
				let count = 0
				const queryResultFn = async()=> {
				    try {
				        const {page} = await this.$api.ihosp_regist_query({ registId: registId, userId: this.userInfo.userId },{isShowLoading:false})
				        let list = page && page.records || []
				        let registResult = list.length>0 && list[0] || {}
						let status = registResult.productStatus && registResult.productStatus.code
						// 支付中就继续轮询
						if((status === 'PAY_PROCESSING' || status === 'REGIST_PROCESSING') && count < 5){
							count++
				            setTimeout(()=>{
				                queryResultFn()
				            },3000)
				        }else {
				            // uni.hideLoading()
							this.$refs.jdModal.cancel()
							uni.navigateTo({
								url: `/pages/register/registerResult/index?registId=${registId}`
							})
				        }
				    }catch (e) {
				        console.log(e);
				        // uni.hideLoading()
						this.$refs.jdModal.cancel()
				    }
				}
				queryResultFn()
			},
			registClose(registId){
				this.$api.ihosp_regist_close({registId: registId, tradeType: 'REGIST_CLOSE', orgCode: this.registerInfo.orgCode})
			},
			showEditPhoneAlert(val){
				let _this = this
				this.mobileNo = this.changeMobileNo
				this.showEditPhone = true
				setTimeout(function(){
					_this.mobileFocus = true
				}, 300)
			},
			closeEditPhone(){
				this.showEditPhone = false
				this.mobileFocus = false
			},
			testTelphone(number) {
				var reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
				if (reg.test(number)) {
				  return true
				} else {
				  return false
				}
			},
			async savePhone(){
				if(!this.testTelphone(this.mobileNo)){
					this.$u.toast('手机号码格式有误')
					return
				}
				let param = {
					"outpatientId": this.changePatientInfo.outpatientId,
					"name": this.changePatientInfo.name,
					"mobileNo": this.mobileNo,
					"sensitiveEncFlag": 0
				}
				const res = await this.$api.outpatient_info_update(param)
				if(res.code=='200'){
					this.changePatientInfo.mobileNo = this.mobileNo
					this.$u.toast('手机号保存成功')
				}else {
					this.$u.toast('手机号保存失败')
				}
				this.showEditPhone = false
				this.mobileFocus = false
			},
			changePatient(item){
				this.changePatientInfo = item
				this.activePatient = item.outpatientId
				this.mobileNo = item.mobileNo || this.userInfo.mobileNo || ''
				this.findCardList(item.outpatientId)	//查询选择就诊人的就诊卡
			},
			changePayMethod(val){
				console.log(val)
				if(val == 'yb'){
					this.registBudget()
				}
				this.payMethod = val
			},
			changeCard(item){
				this.currentCardNo = item.cardNo
				this.activeCard = item
				this.$refs.jdSelectCard._toggleShow()
			},
			//管理就诊卡
			manageCard(){
				console.log('管理就诊卡:',this.activePatient)
				this.$refs.jdSelectCard._toggleShow()
				let item = this.changePatientInfo
				item.tabValue = 1
				this.$u.route({
					url:'/pages/archives/patients/edit/index',
					params:item
				})
			},
			selectCard(val) {
				this.$refs.jdSelectCard._toggleShow()
			},
			//添加就诊卡
			toAddCard(param){
				uni.navigateTo({
					url: '/pages/archives/patients/bind/index'+param
				})
			},
			// 添加就诊人
			toAddPatient(){
				this.isAddPatient = 1
				uni.navigateTo({
					url: `/pages/archives/patients/add/index?backParams=outpatientId`
					// url: `/pages/archives/patients/add/index?backParams=setOutPatientId`
				})
			},
		}
	};
</script>

<style scoped lang="scss">
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
				line-height: 28rpx;
				color: $text-color;
			}
			.pay-price{
				margin-left: 15rpx;
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-money;
			}
		}
	}
	.confirm-register{
		.cr-content{
			margin-top: 20rpx;
			background-color: #F5F8FF;
			border-radius: 10rpx;
			padding: 30rpx 20rpx;
			.cr-row{
				display: flex;
				& + .cr-row{
					margin-top: 20rpx;
				}
			}
			.cr-label{
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-grey;
				width: 56rpx;
				margin-right: 20rpx;
			}
			.cr-val{
				flex: 1;
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color;
			}
			.cr-t-val{
				margin-left: 12rpx;
				color: $text-color-grey;
				font-size: $font-s-base;
				line-height: 28rpx;
			}
			.cr-money{
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-money;
			}
		}
	}
	.cell-content{
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
	.select-patient{
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		}
		.gap{
			padding: 15rpx;
			height: 100%;
		}
		.sp-header{
			padding: 30rpx 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title{
				color: $text-color;
				font-size:$font-s-lg;
				line-height: 32rpx;
			}
			.option-btn{
				height: 28rpx;
				display: flex;
				align-items: center;
				.option-text{
					margin-left: 8rpx;
					font-size: $font-s-base;
					line-height: 28rpx;
					color: $primary;
				}
			}
		}
		.sp-content{
			width: 100%;
			display: flex;
			position: relative;
			height: 166rpx;
			&::before{
				content: " ";
				position: absolute;
				display: flex;
				left: 0;
				bottom: 0;
				z-index: 999;
				width: 50rpx;
				height: 24rpx;
				background-color: $bg-color;
			}
			&::after{
				content: " ";
				position: absolute;
				display: flex;
				right: 0;
				bottom: 0;
				z-index: 999;
				width: 50rpx;
				height: 24rpx;
				background-color: $bg-color;
			}
			.scroll-view {
				white-space: nowrap;
				width: 100%;
				height: 100%;
				display: flex;
			}
			.scroll-content{
				display: flex;
				height: 100%;
			}
			/deep/ .uni-scroll-view-content{
				display: flex;
				padding-bottom: 26rpx;
			}
			.sp-item {
				display: flex;
				flex-shrink: 0;
				align-items: center;
				width: 376rpx;
				height: 140rpx;
				padding: 30rpx;
				background-color: #FFFFFF;
				border: 1px solid #D9D9D9;
				box-sizing: border-box;
				border-radius: 10rpx;
				margin-right: 20rpx;
				position: relative;
				.arrow-up{
					display: none;
					height: 28rpx;
					position: absolute;
					bottom: -30rpx;
					left: 50%;
					margin-left: -14rpx;
					/* #ifdef MP-ALIPAY */
					bottom: -36rpx;
					/* #endif */
				}
				&.active{
					border: 1px solid $primary;
					.arrow-up{
						display: block;
					}
				}
				&:nth-last-child(1){
					margin-right: 0rpx;
				}
				.avatar{
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					flex-grow: 0;
					flex-shrink: 0;
					border: 1px solid #E3E3E3;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					.img{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.info{
					overflow: hidden;
				}
				.top{
					display: flex;
					align-items: center;
				}
				.body{
					display: flex;
					align-items: center;
					margin-top: 10rpx;
				}
				.name-lab{
					color: #333333;
					font-size:$font-s-lg;
					line-height: 32rpx;
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-right: 10rpx;
				}
				.age{
					font-size: $font-s-base;
					line-height: 28rpx;
				}
				.gender-icon{
					width: 24rpx;
					height: 24rpx;
					margin-left: 10rpx;
					@include bg-image('img/man');
					&.women{
						@include bg-image('img/women');
					}
				}
			}
		}
		.sp-card-info{
			padding: 0 30rpx;
		}
	}

	.pay-method{
		padding: 0 30rpx;
		.pm-header{
			padding: 30rpx 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.pm-title{
				color: $text-color-grey;
				font-size: $font-s-base;
				line-height: 28rpx;
			}
		}
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
			.pay-yb-lab{
				margin-left: 20rpx;
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-grey;
			}
			.pay-price{
				margin-left: 4rpx;
				font-size: $font-s-base;
				line-height: 28rpx;
				color: $text-color-money;
			}
		}
		.option-box{
			width: 36rpx;
			height: 36rpx;
			background: #FFFFFF;
			border: 1px solid $line;
			box-sizing: border-box;
			border-radius: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			align-content: center;
			padding-top: 2rpx;
		}
	}

	.edit-phone-alert{
		display: flex;
		flex-direction: column;
		.ep-title{
			width: 100%;
			height: 106rpx;
			line-height: 40rpx;
			padding-top: 38rpx;
			padding-bottom: 28rpx;
			display: flex;
			justify-content: center;
			flex-wrap: 0;
			flex-shrink: 0;
			color: $text-color;
			font-size: $font-s-llg;
		}
		.ep-content{
			flex: 1;
			padding: 0 30rpx 30rpx;
		}
		.ep-options{
			width: 100%;
			height: 88rpx;
			flex-wrap: 0;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			border-top: 1px solid $line;
			.cancel-btn, .confirm-btn{
				height: 100%;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $text-color;
				font-size: $font-s-lg;
			}
			.confirm-btn{
				color: $primary;
				border-left: 1px solid $line;
			}
		}
	}

</style>

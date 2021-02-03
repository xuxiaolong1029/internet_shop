<template>
	<!-- 医生主页 -->
	<view class="doctor-page">
		<u-line color="#D9D9D9"></u-line>
		<!-- 医生信息 start -->
		<jd-doctor-info :doctor="doctor" :showFollow="false" :showOrg="false" :showIntrod="doctor.specialSkill!=''" @moreInfo="moreInfo"></jd-doctor-info>

		<view class="time-line-box">
			<view class="tabs-box">
				<jd-button class="btn" type="primary" shape="circle" size="mini" :plain="activeTabs!=0" @submit="changeTabs(0)">全部排班</jd-button>
				<jd-button class="btn" type="primary" shape="circle" size="mini" :plain="activeTabs!=1" @submit="changeTabs(1)">只看有号</jd-button>
			</view>
			<u-time-line v-show="numArr && numArr.length>0">
				<u-time-line-item v-for="(item, index) in numArr" :key="index" :nodeTop="index==0?90:9">
					<template v-slot:node>
						<view class="tl-node"></view>
					</template>
					<template v-slot:content>
						<view>
							<view class="tl-date-row">
								<view class="tl-date">{{formatDate(item).schDateText}}</view>
								<view class="tl-date-label">{{formatDate(item).when}}</view>
							</view>
							<view class="tl-content">
								<register-categorys v-for="(item1,index1) in getApmList(item.apmList)" :key="index1" :categorys="item1" :date="item.schDate" :params="item" :showSurplusNum="true" @clickAppointment="appointment2" @changeContent="appointment2"></register-categorys>
							</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>

		<jd-select-regist-times
			ref="jdSelectRegistTimes"
			v-model="showSelectTime"
			title="选择就诊时间"
			:scheduleType="scheduleType"
			:list="timeList"
			@changeTime="changeTime">
		</jd-select-regist-times>

		<jd-alert-container :show="showDoctorInfo" height="724rpx" @close="closeAlertDoctor">
			<view class="doctor-inor-alert">
				<jd-doctor-info :doctor="doctor" :showFollow="false" :showOrg="false" :showIntrod="false"></jd-doctor-info>
				<view class="introd-box">
					<scroll-view class="scroll-view" scroll-y="true">
						<view class="introd-scroll-content">
							<text class="introd-text">{{doctor.specialSkill}}</text>
							<text class="introd-text">{{doctor.doctorntroduce}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</jd-alert-container>

		<jd-modal ref="jdModal"></jd-modal>
		<jd-login ref="child"></jd-login>
	</view>
</template>

<script>
	import JdLogin from '@/customComponents/jd-login/index'
	import jdDoctorInfo from '@/viewComponents/jd-doctor-info/index.vue';
	import registerCategorys from '../components/register-categorys/index.vue';
	import jdSelectRegistTimes from '@/customComponents/jd-action-sheet-popup/select-regist-times.vue';
	import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
	import jdButton from '@/customComponents/jd-button/index.vue';
	import jdModal from '@/customComponents/jd-modal'
	import { timeDifference, timestampToTime } from '@/utils/util'
	import config from '@/config';
	const {APM, DEPT_LAST} = config.common

	export default {
		name: 'doctorPage',
		components: {
			jdDoctorInfo,registerCategorys,jdSelectRegistTimes,jdAlertContainer,jdButton,jdModal,JdLogin
		},
		data() {
			return {
				APM,
				DEPT_LAST,
				orgCode: '',	//机构编码
				deptCode: '',	//科室编码
				doctorCode: '',	//医生编码
				isPrompt: false,//没有号源是否需要提示
				activeTabs: 0, //0:全部排班	1:只看有号
				scheduleType: '',
				showSelectTime: false,
				allNumList:[],
				// numList:[],
				doctor: {},
				timeList: [],
				showDoctorInfo: false,
				// numArr: [],
				apmList: [],
			};
		},
		onLoad: function (option) {
			this.orgCode = option.orgCode	//机构编码
			this.deptCode = option.deptCode	//科室编码
			this.doctorCode = option.doctorCode	//医生编码
			this.isPrompt = option.isPrompt	//没有号源是否需要提示
			this.findDoctorSupNum()
		},
		computed: {
			numArr() {
				let nList = []
				if(this.activeTabs===1){
					if(this.allNumList && this.allNumList.length>0){
						nList = this.allNumList.filter((item)=>{
							return this.getApmList(item.apmList).length>0
						})
					}
				}else{
					nList = this.allNumList
				}
				return nList
			},
			getApmList(){
				return function(apmList){
					let aList = []
					if(apmList && apmList.length>0 && this.activeTabs==1){
						aList = apmList.filter((amp) => {
							return (amp.surplusNum != null && amp.surplusNum > 0)
						})
					}else{
						aList = apmList
					}
					return aList
				}
			},
		},
		watch:{
			numArr(curVal,oldVal){
				if(this.isPrompt && (curVal==null || curVal.length==0)){
					this.$refs.jdModal._warning({
					    title:`此医生暂无可约的号`,
					    content:`请选择本科室其他医生`,
						showCancel: false,
					    confirmText:'好的'
					})
				}else{
					this.apmList
				}
			}
		},
		methods: {
			/*
			getApmList(apmList){
				let aList = []
				if(apmList && apmList.length>0 && this.activeTabs==1){
					aList = apmList.filter((amp) => {
						return (amp.surplusNum != null && amp.surplusNum > 50)
					})
				}else{
					aList = apmList
				}
				return aList
			},

			 */
			// 医生所有日期余号查询
			async findDoctorSupNum(){
				const result = await this.$api.ihosp_doctor_sup_num({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:DEPT_LAST.yes, doctorCode: this.doctorCode})
				console.log('医生所有日期余号：',result)
				this.doctor = result || {}
				this.allNumList = this.doctor.doctorSupDateList || []
				// this.numArr = this.doctor.doctorSupDateList || []
				// this.numList = this.allNumList
			},
			// 医生指定日期号源查询
			async findDoctorNumDay(item){
				this.timeList = []
				// orgCode	String	Y	32	机构编码
				// doctorCode	String	Y	32	医生编码
				// schDate	String	Y	16	日期yyyy-MM-dd
				// schApm	String	N	16	上下午标识；1上午，2下午
				const {numList} = await this.$api.ihosp_doctor_num_day({orgCode:this.orgCode,deptCode: item.deptCode,doctorCode: this.doctorCode, schDate:item.schDate, schApm:item.apm})
				console.log('医生指定日期号源：',numList)
				let list = numList || []
				//过滤小于当前时间的时间段
				let dt = new Date()
				let nowDate = timestampToTime(dt.getTime(),10,'-')
				if(list.length > 0 && item.schDate == nowDate){
					list = list.filter((item) => {
						let pbDate = new Date(nowDate + ' ' + item.endTime)
						return pbDate > dt
					})
				}
				this.timeList = list || []
			},
			changeTabs(type){
				this.activeTabs = type
			},
			formatDate(item){
				let num = {}
				let dt = new Date(item.schDate)
				let dtText = this.$u.date(dt.getTime(), 'yyyy/mm/dd')
				let week = this.transformWeek(item.week, '周')
				num['schDateText'] = `${dtText} (${week})`
				num['when'] = this.transformWhen(dt)
				return num
			},
			transformWeek(week,prefix){
				let weekText = prefix
				switch (week){
					case "1":
						weekText += '一'
						break;
					case "2":
						weekText += '二'
						break;
					case "3":
						weekText += '三'
						break;
					case "4":
						weekText += '四'
						break;
					case "5":
						weekText += '五'
						break;
					case "6":
						weekText += '六'
						break;
					case "7":
						weekText += '日'
						break;
				}
				return weekText
			},
			transformWhen(date){
				let tdf = timeDifference(date)
				let when = ''
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
				return when
			},
			moreInfo(item){
				//查看更多医生信息
				this.showAlertDoctor()
			},
			showAlertDoctor() {
				//显示医生信息弹窗
				this.showDoctorInfo = true
			},
			closeAlertDoctor() {
				//关闭医生信息弹窗
				this.showDoctorInfo = false
			},
			appointment2(item,params,registTypeCode) {
				let registerInfo = {
					tradeType: registTypeCode,//挂号类型；REGIST_PRE预约挂号 / REGIST_DAY当日挂号
					orgCode: this.orgCode,//机构编号
					deptCode: item.deptCode,//科室编号
					doctorCode: this.doctor.doctorCode,//医生编号
					schDate: item.schDate,//就诊日期
					patientId: '',//就诊人编号
					cardId: '',//卡编号
					schNumId: '',	//排班号源码ID
					outpatAddress: item.address,//就诊地点
					terminalType: '',//终端类型
					terminalId: '',//终端编号
				}
				this.$store.commit('setRegisterInfo', registerInfo)
				this.findDoctorNumDay(item)
				let dt = new Date(item.schDate)
				let dtText = this.$u.date(dt.getTime(), 'yyyy/mm/dd')
				let week = this.transformWeek(item.week, '周')
				this.scheduleType = `${dtText}(${week})`+this.APM[item.apm]
				this.showSelectTime = true
				this.$refs.jdSelectRegistTimes._toggleShow()
				let when = this.transformWhen(dt)
				let confirmInfo = {
					doctorName: this.doctor.doctorName,	//医生名称
					titleName: this.doctor.titleName,	//医生属性
					doctorImgUrl: this.doctor.doctorImgUrl,	//医生头像
					orgName: this.doctor.orgName,	//机构名称
					deptName: this.doctor.deptName,	//科室名称
					date: `${dtText}(${week})`,
					when: when,	//何时
					cost: item.registFee,	//费用
					numType: item.numType,	//号源类型；1特诊，2副高
					time: '',	//时间
					numId: '',	//序号
				}
				this.$store.commit('setConfirmInfo', confirmInfo)
			},
			changeTime(item){
				// 判断是否登录，未登录就跳转到登录页面
				let userInfo = uni.getStorageSync('userInfo')
				if(!userInfo){
					// orgCode		机构编码
					// doctorCode	医生编码；
					// deptCode		科室编码
					let path = `/pages/register/doctorPage/index?orgCode=${this.orgCode}&doctorCode=${this.doctorCode}&deptCode=${this.deptCode}`
					this.$refs.child.getAuthSetting(path,userInfo);
					/*uni.navigateTo({
						url: '/pages/auth/index?from='+encodeURIComponent(path)
					});*/
					return
				}

			    //号源选择
				let registerInfo = this.$store.state.register.registerInfo
				registerInfo.schNumId = item.schNumId	//排班号源码ID
				this.$store.commit('setRegisterInfo', registerInfo)

				let confirmInfo = this.$store.state.register.confirmInfo
				confirmInfo.time = item.startTime +'-'+ item.endTime,	//时间
				confirmInfo.numId = item.numId,	//序号
				this.$store.commit('setConfirmInfo', confirmInfo)

				this.$refs.jdSelectRegistTimes._toggleShow()
				uni.navigateTo({
					url: '/pages/register/confirmRegister/index'
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.doctor-info{
		border-radius: 0rpx 0rpx 20rpx 20rpx;
	}
	.doctor-inor-alert{
		height: 100%;
		display: flex;
		flex-direction:column;
		/deep/ .doctor-info{
			background-color: transparent !important;
			padding-bottom: 20rpx;
		}
		.introd-box{
			flex: 1;
			overflow: hidden;
			padding: 0 30rpx 30rpx;
			.scroll-view{
				height: 100%;
			}
			.introd-scroll-content{
				display: flex;
				flex-direction:column;
			}
			.introd-text{
				color: $text-color;
				text-align: justify;
				font-size:$font-s-base;
				line-height: 42rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	.time-line-box{
		margin-top: 30rpx;
		padding: 0 30rpx 0 35rpx;
		position: relative;
		.tabs-box{
			position: absolute;
			top: 0;
			left: 61rpx;
			/deep/ .u-btn{
				margin-right: 20rpx;
			}
		}
		/deep/ {
			.u-time-axis:before{
				border-color: $line !important;
				top: 0;
			}
			.u-time-axis-item{
				margin-bottom: 30rpx;
				&:first-child{
					padding-top: 81rpx;
				}
			}
			.u-time-axis{
				padding-left: 24rpx;
				padding-bottom: 1rpx;
			}
			.u-time-axis-node{
				left:-24rpx;
			}
		}
		.tl-node {
			width: 10rpx;
			height: 10rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: $line;
		}
		.tl-date-row{
			display: flex;
			justify-content: space-between;
			line-height: 28rpx;
			margin-bottom: 20rpx;
		}
		.tl-date, .tl-date-label {
			color: $text-color-grey;
			font-size: $font-s-base;
		}
		.tl-content{
			background-color: #FFFFFF;
			border-radius: 10rpx;
			padding: 0rpx 30rpx;
		}
	}
</style>

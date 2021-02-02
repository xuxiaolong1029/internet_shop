<template>
	<!-- 选择医生 -->
	<view class="select-doctor">
		<u-line color="#D9D9D9"></u-line>
		<!-- 科室信息 start -->
		<info-card :title="deptInfo.deptName" :tips="deptInfo.numOutInfo" :tag="deptInfo.tab" :telephone="deptInfo.telephone" class="info-card" @toCall="toCall" @clickTips="showTips">
			<view class="link-container" v-if="deptLast==DEPT_LAST.yes">
				<view class="hospital-bi" @click="toDeptInfo">
					<view class="bi-icon"></view>
					<text>科室简介</text>
					<u-icon name="arrow-right" color="#FF9C00" size="20"></u-icon>
				</view>
				<view class="hospital-notice" v-if="deptInfo.deptNotice" @click="showNotice">
					<view class="notice-icon"></view>
					<text>科室公告</text>
					<u-icon name="arrow-right" color="#12CE8A" size="20"></u-icon>
				</view>
			</view>
		</info-card>
		<!-- 日期筛选 start -->
		<u-sticky :offset-top="offsetTop" :enable="enable" @fixed="fixed" @unfixed="unfixed">
			<view class="date-filter-content" :class="{'sticky':sticky}">
				<date-filter :dateList="dateList" :activeKey="activeDate" class="date-filter" @changeDate="changeDate"></date-filter>
			</view>
		</u-sticky>
		<template v-if="activeDate=='all'">
			<!-- 普通号 start -->
			<view class="common-register" v-if="ordinaryDoctorList && ordinaryDoctorList.length>0">
				<view class="cr-title">普通号</view>
				<template v-for="(item,index) in ordinaryDoctorList">
					<jd-register-doctor :doctorObj="item" :showProperty="false" :showIntroduce="false" @clickAppointment="appointment" @changeContent="appointment"></jd-register-doctor>
				</template>
			</view>
			<!-- 专家号 start -->
			<view class="expert-register" v-if="expertDoctorList && expertDoctorList.length>0">
				<view class="cr-title">专家号</view>
				<template v-for="(item,index) in expertDoctorList">
					<jd-register-doctor :doctorObj="item" @clickAppointment="appointment" @changeContent="appointment"></jd-register-doctor>
				</template>
			</view>
			<!-- 无数据 -->
			<view class="no-data-content" v-show="(ordinaryDoctorList==null || ordinaryDoctorList.length==0) && (expertDoctorList==null || expertDoctorList.length==0)">
				<jd-result :text="'此科室暂无可预约的医生'"></jd-result>
			</view>
		</template>
		<template v-else>
			<view class="common-register" v-if="ordinaryDayList && ordinaryDayList.length>0">
				<view class="cr-title">普通号</view>
				<template v-for="(item,index) in ordinaryDayList">
					<jd-register-doctor :doctorObj="item"
						:showProperty="false"
						:showOption="false"
						:showPrice="false"
						:showNumberDate="false"
						:showIntroduce="false"
						:customStyle="{'padding-bottom':'0rpx'}">
						<register-categorys v-for="(item1,index1) in item.apmList" :key="index1" :categorys="item1" :date="activeDate" :params="item" :showSurplusNum="true" @clickAppointment="appointment2" @changeContent="appointment2"></register-categorys>
					</jd-register-doctor>
				</template>
			</view>
			<view class="expert-register" v-if="expertDayList && expertDayList.length>0">
				<view class="cr-title">专家号</view>
				<template v-for="(item,index) in expertDayList">
					<jd-register-doctor :doctorObj="item"
						:showOption="false"
						:showPrice="false"
						:showNumberDate="false" 
						:customStyle="{'padding-bottom':'0rpx'}"
						@changeContent="showDoctorInfoFn">
						<register-categorys v-for="(item1,index1) in item.apmList" :key="index1" :categorys="item1" :date="activeDate" :params="item" :showSurplusNum="true" @clickAppointment="appointment2" @changeContent="appointment2"></register-categorys>
					</jd-register-doctor>
				</template>
			</view>
			<!-- 无数据 -->
			<view class="no-data-content" v-show="(ordinaryDayList==null || ordinaryDayList.length==0) && (expertDayList==null || expertDayList.length==0)">
				<jd-result :text="'此科室暂无可预约的医生'"></jd-result>
			</view>
		</template>

		<jd-select-regist-times ref="jdSelectRegistTimes"
			v-model="showSelectTime"
			title="选择就诊时间"
			:scheduleType="scheduleType"
			:list="timeList"
			@changeTime="changeTime">
		</jd-select-regist-times>

		<!-- 公告/提示 -->
		<jd-alert-container :show="noticeAlert" :showClose="false" :height="alertInfo.height" @close="closeNotice">
			<view class="notice-alert">
				<view class="title" v-if="alertInfo.title">{{alertInfo.title}}</view>
				<view class="introd-box">
					<scroll-view class="scroll-view" scroll-y="true">
						<view class="introd-scroll-content">
							<text class="introd-text">{{ alertInfo.content }}</text>
						</view>
					</scroll-view>
				</view>
				<view class="line-box">
					<u-line color="#D9D9D9"></u-line>
				</view>
				<view class="notice-alert-btn" @click="closeNotice">{{alertInfo.btnText}}</view>
			</view>
		</jd-alert-container>

		<jd-alert-container :show="showDoctorInfo" height="724rpx" @close="closeAlertDoctor">
			<view class="doctor-inor-alert">
				<jd-doctor-info :doctor="changeDoctorInfo" :showFollow="false" :showOrg="false" :showIntrod="false"></jd-doctor-info>
				<view class="introd-box">
					<scroll-view class="scroll-view" scroll-y="true">
						<view class="introd-scroll-content">
							<text class="introd-text">{{changeDoctorInfo.specialSkill}}</text>
							<text class="introd-text">{{changeDoctorInfo.doctorntroduce}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</jd-alert-container>
		<jd-login ref="child"></jd-login>
	</view>
</template>

<script>
	import JdLogin from '@/customComponents/jd-login/index'
	import infoCard from '../components/info-card/index.vue';
	import dateFilter from '../components/date-filter/index.vue';
	import jdRegisterDoctor from '@/viewComponents/jd-register-doctor/index.vue';
	import jdSelectRegistTimes from '@/customComponents/jd-action-sheet-popup/select-regist-times.vue';
	import registerCategorys from '../components/register-categorys/index.vue';
	import jdResult from '@/customComponents/jd-result/index.vue';
	import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
	import jdDoctorInfo from '@/viewComponents/jd-doctor-info/index.vue';
	import { timeDifference, timestampToTime } from '@/utils/util'
	import config from '@/config';
	const {DEPT_LAST, APM} = config.common
	export default {
		name: 'selectDoctor',
		components: {
			infoCard,dateFilter,jdRegisterDoctor,registerCategorys,jdSelectRegistTimes,jdResult,jdAlertContainer,jdDoctorInfo,JdLogin
		},
		data() {
			return {
				DEPT_LAST,
				APM,
				orgCode: '',
				deptId: '',
				deptCode: '',
				deptLast: 'N',
				deptInfo:{
					deptName: '',	//科室名称
					numOutInfo: '',	//科室放号提示
					tag: '',		//科室标签
					telephone:'',	//科室电话
					deptNotice: '',	//科室公告
				},
				noticeAlert: false,
				showDoctorInfo: false,	//显示医生信息弹窗
				activeDoctorInfo: {},
				showSelectTime:false,
				scheduleType: '',
				offsetTop: 0,
				enable: true,
				sticky: false,
				activeDate: 'all',
				alertInfo:{
					height: '720rpx',
					title: '',
					content: '',
					btnText: '关闭'
				},
				dateList: [],
				timeList: [],
				isNoData: false,
				ordinaryDoctorList:[],	//全部日期普通号
				expertDoctorList:[],	//全部日期专家号
				ordinaryDayList:[],	//指定日期普通号
				expertDayList:[],	//指定日期专家号
				changeDoctorInfo:{},
			};
		},
		async onLoad(option){
			let _this = this
			this.orgCode = option.orgCode
			this.deptId = option.deptId
			this.deptCode = option.deptCode
			this.deptLast = option.deptLast
			this.deptInfo.deptName = option.deptName
			uni.setNavigationBarTitle({
			    title: option.deptName || ''
			});
			//是否末级科室
			if(DEPT_LAST.yes == this.deptLast){
				//查询科室信息
				await this.findDeptInfo()
				uni.getStorage({
					key: 'dept_notice',
					success: function (res) {
						//每天第一次进入此页时，自动弹出医院公告，当天再次进入时不自动弹出
						let dt = new Date()
						let dateStr = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
						if((res.data==null || res.data != dateStr) && (_this.deptInfo.numOutInfo!=null)){
							uni.setStorage({key: 'dept_notice',data: dateStr})
							_this.showNotice()
						}
					}
				})
			}
			this.findDeptHasNum()	//科室所有日期有无号查询
			this.findDeptHasNumLate()	// 科室所有医生最近有号查询
		},
		onShow() {
			this.enable= true
		},
		onHide() {
			this.enable= false
		},
		methods: {
			// 查询科室信息
			async findDeptInfo(){
				const { result } = await this.$api.basedata_orgdept_info({deptId:this.deptId})
				console.log('科室信息：',result)
				this.deptInfo = Object.assign({},result)
			},
			// 科室所有日期有无号查询
			async findDeptHasNum(){
				// orgCode	机构编码
				// deptCode 科室编码；
				// deptLast	是否末级科室；Y是，N否
				const {numList} = await this.$api.ihosp_dept_has_num({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:this.deptLast})
				console.log('有号日期：',numList)
				this.dateList = this.dateListFormat(numList)
			},
			// 科室所有医生最近有号查询
			async findDeptHasNumLate(){
				// orgCode	机构编码
				// deptCode 科室编码；
				// deptLast	是否末级科室；Y是，N否
				// isExpert  是否专家号
				const { numList } = await this.$api.ihosp_dept_has_num_late({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:this.deptLast, isExpert:0})
				console.log('医生最近有号：',numList)
				this.ordinaryDoctorList = numList || []	//全部日期普通号
				let data = await this.$api.ihosp_dept_has_num_late({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:this.deptLast, isExpert:1})
				this.expertDoctorList = data.numList || []	//全部日期专家号
			},
			// 科室指定日期所有医生余号查询
			async findDeptHasNumDay(schDate){
				// orgCode	机构编码
				// deptCode 科室编码；
				// deptLast	是否末级科室；Y是，N否
				// schDate	查询日期 yyyy-MM-dd
				// isExpert  是否专家号
				const { numList } = await this.$api.ihosp_dept_has_num_day({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:this.deptLast,schDate:schDate, isExpert:0})
				console.log('科室指定日期所有医生余号：',numList)
				this.ordinaryDayList = numList || []	//指定日期普通号
				let data = await this.$api.ihosp_dept_has_num_day({orgCode:this.orgCode,deptCode:this.deptCode,deptLast:this.deptLast,schDate:schDate, isExpert:1})
				this.expertDayList = data.numList || []	//指定日期专家号
			},
			// 医生指定日期号源查询
			async findDoctorNumDay(doctorCode,schDate,apm){
				this.timeList = []
				// orgCode	String	Y	32	机构编码
				// doctorCode	String	Y	32	医生编码
				// schDate	String	Y	16	日期yyyy-MM-dd
				// schApm	String	N	16	上下午标识；1上午，2下午
				const {numList} = await this.$api.ihosp_doctor_num_day({orgCode:this.orgCode,deptCode:this.deptCode,doctorCode: doctorCode, schDate:schDate, schApm:apm})
				console.log('医生指定日期号源：',numList)
				let list = numList || []
				//过滤小于当前时间的时间段
				let dt = new Date()
				let nowDate = timestampToTime(dt.getTime(),10,'-')
				if(list.length > 0 && schDate == nowDate){
					list = list.filter((item) => {
						let pbDate = new Date(nowDate + ' ' + item.endTime)
						return pbDate > dt
					})
				}
				this.timeList = list
			},
			dateListFormat(data){
				let list = []
				if(data && data.length > 0){
					list = data.map((item) => {
						return this.formateDataObj(item)
					})
				}
				return list
			},
			formateDataObj(item){
				let dt = new Date(item.schDate);//号源日期
				let month = dt.getMonth()+1
				return {
					text: this.formatWeek(item.schDate, item.week),//'今天',
					date: this.$u.date(dt.getTime(), 'mm/dd'), //month+'/'+dt.getDate(),//'01/04',
					schDate: item.schDate,
					status: item.hasNum=='Y'?'有号':'无号'
				}
			},
			formatWeek(schDate,week, type){
				let ndt = new Date()
				let tomorrow = new Date()
				tomorrow.setTime(tomorrow.getTime()+24*60*60*1000)//明天的时间
				let dt = new Date(schDate)	//日期
				let weekText = week
				if( ndt.getFullYear() == dt.getFullYear() &&  ndt.getMonth() == dt.getMonth() && ndt.getDate() == dt.getDate() && !type){
					weekText = '今天'
				}else if( tomorrow.getFullYear() == dt.getFullYear() &&  tomorrow.getMonth() == dt.getMonth() && tomorrow.getDate() == dt.getDate() && !type){
					weekText = '明天'
				}else{
					weekText = '周'
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
						default:
							break;
					}
				}
				return weekText
			},
			//科室简介
			toDeptInfo(){
				uni.navigateTo({
					url: `/pages/hospital/department/detail?id=${this.deptInfo.id}&deptCode=${this.deptInfo.deptCode}`
				});
			},
			toCall(telephone){
				uni.makePhoneCall({
					phoneNumber: telephone,
					success: (res) => {
						console.log('makePhoneCall调用成功!')
					},
					fail: (res) => {
						console.log('makePhoneCall调用失败!')
					}
				});
			},
			showNotice(){
				this.alertInfo = {
					height:'720rpx',
					title: '科室公告',
					content: this.deptInfo.deptNotice,
					btnText: '好，我已了解',
				}
				this.noticeAlert = true
			},
			closeNotice() {
				//关闭公告弹窗
				this.noticeAlert = false
			},
			showTips(){
				this.alertInfo = {
					height: '404rpx',
					title: '',
					content: this.deptInfo.numOutInfo,
					btnText: '关闭',
				}
				this.noticeAlert = true
			},
			changeTime(item){
				// 判断是否登录，未登录就跳转到登录页面
				let userInfo = uni.getStorageSync('userInfo')
				if(!userInfo){
					// orgCode	机构编码
					// deptId 	科室id
					// deptCode	科室编码；
					// deptName	科室简称
					// deptLast	是否末级科室；Y是，N否
					let path = `/pages/register/selectDoctor/index?orgCode=${this.orgCode}&deptId=${this.deptId}&deptCode=${this.deptCode}&deptName=${this.deptInfo.deptName}&deptLast=${this.deptLast}`
					this.$refs.child.getAuthSetting(path,userInfo)
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

				uni.navigateTo({
					url: '/pages/register/confirmRegister/index'
				});
			},
			fixed() {
				//触发吸顶
				this.sticky = true
			},
			unfixed() {
				//取消吸顶
				this.sticky = false
			},
			changeDate(item) {
				console.log('changeDate:',typeof item == "object");
				if(item && typeof item == "object"){
					//查询指定日期号源
					this.activeDate = item.schDate
					this.findDeptHasNumDay(this.activeDate)
				}else{
					// 查询所有日期号源
					this.activeDate = item
					this.findDeptHasNumLate()
				}

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
			appointment(item) {
				uni.navigateTo({
					url: `/pages/register/doctorPage/index?orgCode=${this.orgCode}&doctorCode=${item.doctorCode}&deptCode=${this.deptCode}&isPrompt=true`
				})
			},
			appointment2(item,params,registTypeCode) {
				let registerInfo = {
					tradeType: registTypeCode,//挂号类型；REGIST_PRE预约挂号 / REGIST_DAY当日挂号
					orgCode: this.orgCode,//机构编号
					deptCode: item.deptCode,//科室编号
					doctorCode: params.doctorCode,//医生编号
					schDate: this.activeDate,//就诊日期
					patientId: '',//就诊人编号
					cardId: '',//卡编号
					schNumId: '',	//排班号源码ID
					outpatAddress: item.address,//就诊地点（传科室地址）
					terminalType: '',//终端类型
					terminalId: '',//终端编号
				}
				this.$store.commit('setRegisterInfo', registerInfo)
				this.findDoctorNumDay(params.doctorCode, this.activeDate, item.apm)	//查询排班时段列表
				let dt = new Date(this.activeDate)
				let week = this.formatWeek(this.activeDate,item.week,'week')
				let dtText = this.$u.date(dt.getTime(), 'yyyy/mm/dd')
				console.log(dtText)
				this.scheduleType = `${dtText}(${week})`+this.APM[item.apm]
				this.showSelectTime = true
				this.$refs.jdSelectRegistTimes._toggleShow()

				let when = this.transformWhen(dt)
				let confirmInfo = {
					doctorName: params.doctorName,	//医生名称
					titleName: params.titleName,	//医生职称
					doctorImgUrl: params.doctorImgUrl,	//医生头像
					orgName: params.orgName,	//机构名称
					deptName: params.deptName,	//科室名称
					date: `${dtText}(${week})`,
					when: when,	//何时
					cost: item.registFee,	//费用
					numType: item.numType,	//号源类型；1特诊，2副高
					time: '',	//时间
					numId: '',	//序号
				}
				this.$store.commit('setConfirmInfo', confirmInfo)
			},
			// 显示医生信息弹出框
			showDoctorInfoFn(item){
				this.changeDoctorInfo = item
				this.showDoctorInfo = true
			},
			//关闭医生信息弹窗
			closeAlertDoctor() {
				this.showDoctorInfo = false
			},
		}
	};
</script>

<style scoped lang="scss">
	.info-card{
		margin-bottom: 20rpx;
	}
	.link-container{
		margin-top: 20rpx;
		display: flex;
		.hospital-bi, .hospital-notice{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0rpx 12rpx;
			border-radius: 20rpx;
			background: rgba(255, 156, 0, 0.1);
			color: $warning;
			margin-right: 30rpx;
			height: 44rpx;
		}
		.hospital-notice{
			background: rgba(18, 206, 138, 0.1);
			color: $success;
		}
		.bi-icon, .notice-icon{
			width: 28rpx;
			height: 28rpx;
			margin-right: 8rpx;
			@include bg-image('img/icon-yyjj');
		}
		.notice-icon{
			@include bg-image('img/icon-yygg');
		}
	}
	.date-filter-content{
		margin-top: 20rpx;
	}
	.date-filter-content.sticky{
		margin-top: 0rpx;
		border-bottom: 1rpx solid $line;
	}
	.date-filter{
		margin-top: 0rpx;
	}
	.no-data-content{
		width: 100%;
		height: calc(100vh - 614rpx);
	}

	.common-register, .expert-register{
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 30rpx 30rpx 0;
		.cr-title{
			color: $text-color;
			font-size: $font-s-lg;
			line-height: $font-s-lg;
		}
	}


	.rd-types{
		font-size: $font-s-base;
		line-height: font-s-base;
		color: $text-color;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 30rpx;
		.rd-type-left{
			overflow: hidden;
			.rd-types-header{
				overflow: hidden;
				line-height: $font-s-base;
			}
			.rd-types-body{
				margin-top: 12rpx;
				display: flex;
				font-size: $font-s-base;
				line-height: $font-s-base;
				color: $text-color-grey;
			}
			.type{
				font-size: $font-s-base;
				line-height: $font-s-base;
				color: $primary;
				margin-right: 20rpx;
			}
			.dept{
				line-height: $font-s-base;
				color: $text-color-grey;
				margin-left: 20rpx;
			}
			.rd-position{
				margin-left: 20rpx;
				font-size: $font-s-base;
				line-height: $font-s-base;
				color: $text-color-grey;
			}
		}
		.rd-type-right{
			width: 88rpx;
			flex-grow: 0;
			flex-shrink: 0;
		}
		.price{
			color: $text-color-money;
		}
		.u-btn{
			line-height: 48rpx;
			height: 48rpx;
			font-size: 24rpx;
		}
	}
	.notice-alert{
		height: 100%;
		display: flex;
		flex-flow: column;
		.title{
			font-size: $font-s-lg;
			line-height: $font-s-lg;
			color: $text-color;
			display: flex;
			justify-content: center;
			padding: 30rpx 30rpx 0;
			flex-shrink: 0;
			flex-wrap: 0;
		}
		.introd-box{
			flex: 1;
			overflow: hidden;
			padding: 30rpx;
			// height: 564rpx;
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
				font-size: 28rpx;
				line-height: 42rpx;
			}
		}
		.line-box{
			width: 100%;
			padding: 0 40rpx;
			display: flex;
		}
		.notice-alert-btn{
			padding: 30rpx;
			font-size: $font-s-lg;
			line-height: 32rpx;
			color: $primary;
			display: flex;
			justify-content: center;
			flex-shrink: 0;
			flex-wrap: 0;
		}
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
</style>

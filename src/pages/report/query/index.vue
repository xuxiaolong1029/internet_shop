<template>
	<!-- 查报告 -->
	<view class="query-report">
		<u-line color="#D9D9D9"></u-line>
		<view class="select-patient cell-content">
			<cell-item :title="getPatient" :value="getPatientsTypeAndNo" index="patient" :valueStyle="{color:'#999999'}" @clickItem="choosePatientAction"></cell-item>
		</view>
		<view class="select-date cell-content">
			<cell-item title="查询时间" :value="currentDateText" index="date" :valueStyle="{color:'#999999'}" @clickItem="showDatePicker"></cell-item>
		</view>
		<view class="time-line-box" v-show="list.length">
			<view class="tlb-year" v-for="(item, index) in list" :key="index">
				<view class="tlb-year-title">{{ item.year }}年</view>
				<view class="tlb-time-line-box">
					<u-time-line v-if="item.dataList && item.dataList.length>0">
						<u-time-line-item v-for="(dayItem, index2) in item.dataList" :key="index2" :nodeTop="22">
							<template v-slot:node>
								<view class="tl-node"></view>
							</template>
							<template v-slot:content>
								<view>
									<view class="tl-date-row">
										<view class="tl-date">{{ dayItem.date }}</view>
									</view>
									<view class="tl-content" v-if="dayItem.dataList && dayItem.dataList.length>0">
										<view class="report-item" v-for="(reportItem, index3) in dayItem.dataList" :key="index3" @click="reportDetail(reportItem)">
											<view class="report-item-left">
												<view class="report-item-title">{{ reportItem.projectName }}</view>
												<view class="report-item-time">{{ reportItem.reportTime }}</view>
											</view>
											<view class="report-item-right">
												{{ reportItem.status || '完成'}}
												<view class="ci-arrow">
													<u-icon name="arrow-right" color="#D9D9D9" size="28"></u-icon>
												</view>
											</view>
										</view>
									</view>
									<view class="no-data-content" v-if="index==(list.length-1) && index2==(item.dataList.length-1)">
										<u-divider color="#cccccc" border-color="#cccccc" bg-color="transparent">没有更多报告了</u-divider>
									</view>

								</view>
							</template>
						</u-time-line-item>
					</u-time-line>
				</view>
			</view>
		</view>
		<jd-action-select-date :currentTimeDate="currentTimeDate" ref="actionSelectDate" @confirm="getDate"></jd-action-select-date>
		<template v-if="!list.length && !queryLoading">
			<jdResultCard
					:text="`${getPatient}${placeholInfo.hubText}`"
					:placeholInfo="placeholInfo"
					:orgName="orgName"
					:notCardNoColor="notCardNoColor"
					:list="outpatientList"
					:current="patientsIndex"
					:isNotCardNo="isNotCardNo"
					@onHead="onPatientsHead"
					@resultBtn="resultBtn"
					@chooseList="onPatientsPopup($event,false)"
			/>
		</template>

		<select-patients-popup ref="selectPatientsPopup"
							   :current="patientsIndex"
							   @chooseList="onPatientsPopup"
							   @titleRightClick="onPatientsHead"
							   :list="outpatientList"  />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import cellItem from '@/customComponents/jd-cell-item/cell-item';
	import jdActionSelectDate from '@/customComponents/jd-action-sheet-popup/select-date';
	import selectPatientsPopup from '@/customComponents/jd-action-sheet-popup/select-patients'
	import patientsCardMixins from '@/viewComponents/jd-result-card/mixins'
	import jdResultCard from '@/viewComponents/jd-result-card'
	import { getLast3Month } from '@/utils'
	import config from '@/config'

	const {common} = config
	const last3Month = getLast3Month()
	const START = 'start',END = 'end'
	export default {
		name: 'QueryReport',
		mixins:[patientsCardMixins],
		components: {cellItem,jdActionSelectDate,jdResultCard,selectPatientsPopup},
		data() {
			return {
				currentTimeDate:{value:3,label:'最近3个月',[START]:last3Month.last,[END]:last3Month.now},
				userInfo: {},
				hospitalInfo: {},
				list: [],
				queryLoading:true
			};
		},

		computed:{
			...mapState({
				orgCode:state =>state.orgCode,
			}),
			currentDateText(){
				//currentTimeDate:{value:3,label:'最近3个月',[START]:last3Month.last,[END]:last3Month.now},
				if(this.currentTimeDate.value && this.currentTimeDate.label){
					return this.currentTimeDate.label
				}else{
					return this.$u.date(new Date(this.currentTimeDate[START]).getTime(), 'yyyy/mm/dd') + ' ~ ' + this.$u.date(new Date(this.currentTimeDate[END]).getTime(), 'yyyy/mm/dd')
				}
			},
			notCardNoColor(){
				return this.list.length ? '#FF9C00' : '#999'
			},
			placeholInfo(){
				if(!this.list.length){
					let item = this.outpatientList[this.patientsIndex]
					return {
						btnName:this.isNotCardNo ? '修改登记号' : '绑定登记号/电子健康卡',
						hubText:this.isNotCardNo ? '暂无可查看的检验/检查报告' : '还未绑定登记号/电子健康卡',
						cardNo:this.isNotCardNo ? `${common.CARD_TYPE_NAME[item.cardType]} ${item.cardNo}` : '',
					}
				}else {
					return ''
				}
			},
		},
		async onLoad(option){
			this.userInfo = uni.getStorageSync('userInfo')
		},
		async onShow(){
			await this.getPatientsList()
		},
		methods: {
			async getPatientsList(){
				try {
					this.cardInfoList = await this.getMyPatientCard(this.orgCode)
					this.currenParent = this.cardInfoList.length? this.cardInfoList[0] : {}
					await this.queryReportList()
					await this.getOutPatientList(this.cardInfoList||[])

				}catch (e) {
					console.log(e)
				}
			},
			async queryReportList(){
				this.queryLoading = true
				let {outpatientId, cardId } = this.currenParent
				let param = {
					orgCode: this.orgCode, //医院编码
					patientId: outpatientId, //就诊人ID
					cardId: cardId,	//卡id
					reportType:'', //报告类型(不传代表检查检验一起查询)： jiancha-检查，jianyan-检验
					startDate: this.currentTimeDate[START], //开始日期：yyyy-MM-dd
					endDate: this.currentTimeDate[END], //结束日期：yyyy-MM-dd
				}
				this.queryLoading = false
				const { dataList } = await this.$api.report_examinsp_list(param)
				console.log('查询报告列表：',dataList)
				this.list = dataList || []
			},
			reportDetail(item){
				// 查看报告详情
				this.$u.route({url:`/pages/report/record/details?primaryId=${item.primaryId}&orgCode=${this.orgCode}&reportType=${item.reportType}`});
			},
			getDate(date){
				this.currentTimeDate = date
				this.queryReportList()
			},
			showDatePicker(){
				this.$refs.actionSelectDate._toggleShow()
			},
			choosePatientAction(){
				if(!this.list.length) return
				this.togglePatientsPopup()
			},
			// 切换卡类型
			async onPatientsPopup(index,isShowP=true){
				let item = this.outpatientList[index]
				if(isShowP) this.togglePatientsPopup();
				this.patientsIndex = index;
				if(!item.cardNo){ //没卡号
					this.list = []
				}else{
					this.currenParent = item
					await this.queryReportList()
				}
			},
		}
	};
</script>

<style scoped lang="scss">
	.query-report{
		height: 100%;
		.cell-content{
			height: 88rpx;
			background-color: #FFFFFF;
		}
		.select-date{
			margin-top: 20rpx;
		}
		.time-line-box {
			padding: 10rpx 30rpx 0 30rpx;
			position: relative;
		}
	}
	.tlb-year{
		margin-top: 20rpx;
		.tlb-time-line-box{
			padding-left: 4rpx;
			margin-top: 8rpx;
		}
		.tlb-year-title{
			font-size: 36rpx;
			line-height: 38rpx;
			color: $text-color-grey;
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
			line-height: 26rpx;
			margin-bottom: 20rpx;
			margin-top: 14rpx;
		}
		.tl-date {
			color: $text-color-grey;
			font-size: $font-s-sm;
		}
		.tl-content{
			background-color: #FFFFFF;
			border-radius: 10rpx;
			padding: 30rpx;
		}
		.report-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.report-item-left{
				overflow: hidden;
			}
			.report-item-title{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: $font-s-lg;
				line-height: 34rpx;
				color: $primary;
			}
			.report-item-time{
				font-size: $font-s-base;
				color: $text-color-grey;
				line-height: 30rpx;
				margin-top: 20rpx;
			}
			.report-item-right{
				width: 120rpx;
				display: flex;
				justify-content: flex-end;
				flex-wrap: 0;
				flex-shrink: 0;
				font-size: 28rpx;
				color: $text-color-grey;
			}
			.ci-arrow{
				height: 28rpx;
				line-height: 28rpx;
				margin-left: 2rpx;
				margin-right: -8rpx;
				width: 30rpx;
				flex-wrap: 0;
				flex-shrink: 0;
			}
		}
		/deep/ {
			.u-time-axis{
				padding-left: 26rpx;
			}
			.u-time-axis-node{
				left: -26rpx;
			}
		}
	}
	.no-data-content{
		padding: 148rpx 0 104rpx;
	}

</style>

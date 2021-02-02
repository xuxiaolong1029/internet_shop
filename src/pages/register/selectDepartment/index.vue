<template>
	<!-- 选择科室 -->
	<view class="select-department">
		<u-line color="#D9D9D9"></u-line>
		<!-- 医院信息 start -->
		<info-card :title="hospitalInfo.orgName" :tips="hospitalInfo.numOutInfo" :telephone="hospitalInfo.mobile" @toCall="toCall" @clickTips="showTips">
			<view class="link-container">
				<view class="hospital-bi" @click="toHospitalInfo">
					<view class="bi-icon"></view>
					<text>医院简介</text>
					<u-icon name="arrow-right" color="#FF9C00" size="20"></u-icon>
				</view>
				<view class="hospital-notice" @click="showNotice">
					<view class="notice-icon"></view>
					<text>医院公告</text>
					<u-icon name="arrow-right" color="#12CE8A" size="20"></u-icon>
				</view>
			</view>
		</info-card>

		<view class="history-container" v-if="!(!myDeptList.length && !doctorList.length)">
			<view class="his-dept" v-if="myDeptList.length">
				<view class="title">曾就诊科室</view>
				<view class="hd-container">
					<scroll-view class="scroll-view" scroll-x="true">
						<view class="scroll-content">
							<template v-for="(item,index) in myDeptList">
								<view :key="index" class="dept-item" @click="changeDept(item,DEPT_LAST.yes)">
									<text class="detp-text">{{item.deptName}}</text>
								</view>
							</template>
							<view class="gap" style="padding: 5rpx;"></view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="his-doctor" v-if="doctorList">
				<view class="title">曾就诊医生</view>
				<view class="hd-container">
					<scroll-view class="scroll-view" scroll-x="true">
						<view class="scroll-content">
							<template v-for="(item,index) in doctorList">
								<view :key="index" class="doctor-item" @click="changeDoctor(item,DEPT_LAST.yes)">
									<view class="avatar">
										<image class="img" :src="item.photoUrl" mode="scaleToFill"></image>
									</view>
									<view class="info">
										<view class="name-lab">{{item.name}}</view>
										<view class="dept"><text class="dept-lab">{{item.deptName}}</text></view>
									</view>
								</view>
							</template>
							<view class="gap"></view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 科室列表 start -->
		<view class="dept-list-container">
			<view class="sticky-box">
				<u-sticky :offset-top="offsetTop" :enable="enable" @fixed="fixed" @unfixed="unfixed">
					<view class="search-default">
						<u-search @focus="toSearch" shape="square" :clearabled="true" :disabled="true" @click="toSearch"
							bg-color="#f4f4f4" color="#333333" placeholder-color="#BBBBBB"
							:show-action="false" placeholder="请输入科室/医生/疾病/症状" @clear="clear">
						</u-search>
					</view>
				</u-sticky>
			</view>
			<view class="dept-list">
				<view v-if="isMlDept && list.length > 0" class="dept-tree">
					<view class="dept-ml-container" :class="{'dept-ml-sticky':searchSticky}">
						<view class="dept-ml-left">
							<scroll-view class="dept-scroll-view" scroll-y="true">
								<template v-for="(item,index) in list">
									<view :key="index" class="dept-parent-item" :class="{'active':index==activeDeptIndex}" @click="changeParentDept(index)">
										<text class="active-icon"></text>
										<text class="dept-parent-name">{{item.deptName}}</text>
									</view>
								</template>
							</scroll-view>
						</view>
						<view class="dept-ml-right">
							<scroll-view class="dept-scroll-view" scroll-y="true">
								<!-- <view class="dept-list-item list-cell" @click="changeDept(list[activeDeptIndex],DEPT_LAST.no)">
									<text class="avatar">全部{{list[activeDeptIndex].deptName}}科室</text>
								</view> -->
								<template v-for="(item,index) in list[activeDeptIndex].childDeptList">
									<view :key="index" class="dept-list-item list-cell" @click="changeDept(item,DEPT_LAST.yes)">
										<text class="avatar">{{item.deptName}}</text>
										<text class="tag-country" v-if="item.deptLevel == 1">{{'国'}}</text>
										<text class="tag-province" v-if="item.deptLevel == 2">{{'省'}}</text>
										<text class="tag-municipal" v-if="item.deptLevel == 3">{{'市'}}</text>
									</view>
								</template>
							</scroll-view>
						</view>
					</view>
				</view>
				<view v-if="!isMlDept && list.length > 0" v-else class="detp-index-list" :class="{'search-sticky':searchSticky}">
					<u-index-list :scrollTop="scrollTop" :index-list="indexList">
						<view v-for="(item, index) in list" :key="index" class="il-item">
							<u-index-anchor :index="item.letter" class="il-anchor" />
							<view class="list-cell u-border-bottom" v-for="(item1, index) in item.data" :key="index" @click="changeDept(item1,DEPT_LAST.yes)">
								<text class="il-name">{{item1.deptName}}</text>
								<text class="tag-country" v-if="item.deptLevel == 1">{{'国'}}</text>
								<text class="tag-province" v-if="item.deptLevel == 2">{{'省'}}</text>
								<text class="tag-municipal" v-if="item.deptLevel == 3">{{'市'}}</text>
							</view>
						</view>
					</u-index-list>
				</view>

				<!-- 无数据 -->
				<view class="no-data-content" v-show="list.length==0">
					<jd-result :text="'暂无数据'"></jd-result>
				</view>
			</view>
		</view>
		<view class="bottom-link">
			<text>不知道选什么科室？来试试</text>
			<u-button type="primary" shape="circle" size="mini" @click="toAIGuidance">自测分诊</u-button>
			<text>吧！</text>
		</view>

		<!-- 医院公告 -->
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

	</view>
</template>

<script>
	import infoCard from '../components/info-card/index.vue';
	import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
	import jdResult from '@/customComponents/jd-result/index.vue';
	import config from '@/config';
	const {DEPT_LAST} = config.common
	export default {
		name: 'selectDepartment',
		components: {
			infoCard,jdAlertContainer,jdResult
		},
		data() {
			return {
				DEPT_LAST,
				hospitalInfo: {},
				userInfo: {},
				noticeAlert: false,
				myDeptList:[],	//曾就诊科室
				doctorList:[],
				offsetTop: 0,
				enable: true,
				isMlDept: true,	//是否多级科室
				searchSticky: false,//搜索框是否吸顶
				scrollTop: 0,
				list: [],
				activeDeptIndex: 0,	//选择父级科室下标
				alertInfo:{
					height: '720rpx',
					title: '',
					content: '',
					btnText: '关闭'
				},
			};
		},
		onShow() {
			this.enable= true
		},
		onHide() {
			this.enable= false
		},
		async onLoad(option){
			let _this = this
			this.hospitalInfo = uni.getStorageSync('hospital_info')
			uni.getStorage({
				key: 'hospital_notice',
				success: function (res) {
					//每天第一次进入此页时，自动弹出医院公告，当天再次进入时不自动弹出
					let dt = new Date()
					let dateStr = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
					if((res.data==null || res.data != dateStr) && (_this.hospitalInfo.orgNotice!=null)){
						uni.setStorage({key: 'hospital_notice',data: dateStr})
						_this.showNotice()
					}
				}
			})
			this.getDeptList()
			this.userInfo = uni.getStorageSync('userInfo')
			//是否已经登录，已经登录就查询曾就诊科室、医生
			if(this.userInfo && this.userInfo.userId){
				this.getMyDept()
				this.getMyDoctor()
			}
		},
		computed: {
			indexList(){
				let arr = this.list.map(val => {
					return val.letter;
				})
				return arr || []
			},
		},
		methods: {
			async getDeptList(){
				const { result } = await this.$api.basedata_orgdept_tree({orgCode:this.hospitalInfo.orgCode})
				console.log('科室tree:',result)
				this.list = result || []
			},
			async getMyDept(){
				const { orgDeptList } = await this.$api.ihosp_my_dept({orgCode:this.hospitalInfo.orgCode, userId:this.userInfo.userId})
				console.log('曾就诊科室:',orgDeptList)
				this.myDeptList = orgDeptList || []
			},
			async getMyDoctor(){
				const {orgEmpList} = await this.$api.ihosp_my_doctor({orgCode:this.hospitalInfo.orgCode, userId:this.userInfo.userId})
				console.log('曾就诊医生:',orgEmpList)
				this.doctorList = orgEmpList || []
			},
			toAIGuidance(){
				// AI导诊
				// this.$u.toast('功能开发中...')
				uni.navigateToMiniProgram({
				  appId: '2021002124605198',
				  path: '',
				  success(res) {
				    // 打开成功
					console.log('打开成功')
				  }
				})
			},
			toHospitalInfo(){
				uni.navigateTo({
					url: '/pages/hospital/info/index'
				});
			},
			showNotice(){
				this.alertInfo = {
					height:'720rpx',
					title: '医院公告',
					content: this.hospitalInfo.orgNotice,
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
					content: this.hospitalInfo.numOutInfo,
					btnText: '关闭',
				}
				this.noticeAlert = true
			},
			fixed() {
				//触发吸顶
				this.searchSticky = true;
			},
			unfixed() {
				//取消吸顶
				this.searchSticky = false;
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			changeParentDept(val){
				this.activeDeptIndex = val
			},
			changeDept(item,deptLast){
				// orgCode	机构编码
				// deptId 	科室id
				// deptCode	科室编码；
				// deptName	科室简称
				// deptLast	是否末级科室；Y是，N否
				let deptName = this.DEPT_LAST.yes==deptLast?item.deptName : (`全部${item.deptName}科室`)
				uni.navigateTo({
					url: `/pages/register/selectDoctor/index?orgCode=${this.hospitalInfo.orgCode}&deptId=${item.id}&deptCode=${item.deptCode}&deptName=${deptName}&deptLast=${deptLast}`
				});
			},
			changeDoctor(item,deptLast){
				// orgCode		机构编码
				// doctorCode	医生编码；
				// deptCode		科室编码
				uni.navigateTo({
					url: `/pages/register/doctorPage/index?orgCode=${this.hospitalInfo.orgCode}&doctorCode=${item.doctorCode}&deptCode=${item.deptCode}&isPrompt=true`
				})
			},
			toSearch(){
				uni.navigateTo({
					url: '/pages/search/index'
				});
			},
			toCall(telephone){
				console.log(telephone);
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
			clickTips(tips){
				console.log(tips);

			},
		}
	};
</script>

<style scoped lang="scss">
	.select-department{
		display: flex;
		flex-direction: column;
		height: calc(100vh);
		padding-bottom: 88rpx;
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	.dept-ml-container{
		display: flex;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: $white;
		&.dept-ml-sticky{
			height: calc(100vh - 84rpx);
		}
		.dept-scroll-view{
			height: 100%;
		}
		.dept-ml-left{
			width: 300rpx;
			background-color: $bg-color;
			padding-bottom: 88rpx;
			.dept-parent-item{
				position: relative;
				padding: 30rpx 0rpx 30rpx 60rpx;
				display: flex;
				align-items: center;
				&.active{
					background-color: $white;
					.dept-parent-name {
						color: $primary;
					}
					.active-icon{
						display: block;
					}
				}
			}
			.dept-parent-name{
				color: #333333;
				font-size:$font-s-base;
				line-height: 28rpx;
			}
			.active-icon{
				width: 10rpx;
				height: 16rpx;
				position: absolute;
				left: 39rpx;
				@include bg-image('img/icon-right');
				display: none;
			}
		}
		.dept-ml-right{
			flex: 1;
			padding-bottom: 88rpx;
		}
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
			text{
				line-height: 28rpx;
				font-size:$font-s-base;
			}
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

	.history-container{
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 0rpx 0rpx 30rpx 30rpx;
		.title{
			padding-top: 30rpx;
			padding-bottom: 20rpx;
			font-size: $font-s-base;
			line-height: $font-s-base;
			color: $text-color;
		}
		.scroll-view {
			white-space: nowrap;
			width: 100%;
			display: flex;
			/deep/ .uni-scroll-view-content{
				display: flex;
			}
			.scroll-content{
				display: flex;
			}
			.gap{
				padding: 15rpx;
				height: 100%;
			}
			.dept-item{
				display: flex;
				flex-shrink: 0;
				align-items: center;
				border-radius: 10rpx;
				height: 52rpx;
				padding: 0rpx 24rpx;
				background: rgba(48, 113, 234, 0.1);
				border-radius: 56rpx;
				margin-right: 20rpx;
				.detp-text{
					font-size:$font-s-base;
					color: $primary;
				}
			}
			.doctor-item {
				display: flex;
				flex-shrink: 0;
				align-items: center;
				width: 328rpx;
				height: 140rpx;
				padding: 30rpx;
				background-color: #FFFFFF;
				border: 1rpx solid #D9D9D9;
				box-sizing: border-box;
				border-radius: 10rpx;
				margin-left: 20rpx;
				&:nth-of-type(1){
					margin-left: 0rpx;
				}
				.avatar{
					width: 80rpx;
					height: 80rpx;
					border-radius: 40rpx;
					margin-right: 20rpx;
					box-sizing: border-box;
					border: 1rpx solid $line;
					@include bg-image('img/doctor-def');
					.img{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.info{
					display: flex;
					flex-direction: column;
				}
				.name-lab{
					color: #333333;
					font-size:$font-s-lg;
					line-height: 32rpx;
				}
				.dept{
					margin-top: 10rpx;
					color: #999999;
					font-size:$font-s-base;
					line-height: 28rpx;
					.dept-lab{
						color: #999999;
					}
				}
			}
		}
	}

	.dept-list-container{
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		.dept-list{
			flex: 1;
		}
		.dept-tree{
			height: 100%;
			display: flex;
		}
		.sticky-box{
			position: relative;
			z-index: 1;
		}
		/deep/ {
			.u-index-bar__sidebar{
				position: absolute;
				top: 108rpx;
				transform: none;
			}
			.search-sticky .u-index-bar__sidebar{
				position: fixed;
				top: 50%;
				transform: translateY(-50%);
				margin-top: 44rpx;
			}
			.il-anchor{
				position: relative;
				opacity: 0;
			}
			.u-index-anchor{
				height: 88rpx;
				position: relative !important;
				z-index: 0 !important;
				opacity: 0;
			}
			.u-index-bar > .il-item{
				margin-top: -88rpx;
			}
			.u-index-bar__index{
				color: #606266 !important;
				font-size:$font-s-sm;
			}
			.u-border-bottom:after{
				display: none;
			}
		}
	}
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 30rpx 60rpx;
		overflow: hidden;
		background-color: #FFFFFF;
		align-items: center;
		.il-name{
			color: #333333;
			font-size:$font-s-base;
			line-height: 28rpx;
		}
		.tag-country, .tag-province, .tag-municipal{
			width: 28rpx;
			height: 28rpx;
			font-size:$font-s-sm;
			line-height: 28rpx;
			text-align: center;
			color: #FFA368;
			background-color: #FFECD3;
			border-radius: 2rpx;
			margin-left: 8rpx;
		}
		.tag-province{
			color: #639AFF;
			background-color: #DFEAFE;
		}
		.tag-municipal{
			color: #7CCB92;
			background-color: #C9F7D5;
		}
	}

	.bottom-link{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 88rpx;
		display: flex;
		align-items: center;
		background: #ffffff;
		box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.1);
		z-index: 99;
		padding: 0 30rpx;
		font-size: $font-s-base;
		color: $text-color;
		text:first-child{
			margin-right: 8rpx;
		}
		text:last-child{
			margin-left: 8rpx;
		}
		/deep/ .u-btn{
			margin: 0;
			height: 40rpx;
			padding: 0 14rpx;
			font-size: $font-s-base !important;
			line-height: 28rpx;
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
	.no-data-content{
		width: 100%;
		height: calc(100vh - 820rpx);
	}
</style>

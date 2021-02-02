<template>
	<view class="home-page">
		<view class="home-top">
			<div class="mask"></div>
			<image :src="hospitalInfo.imgUrl" mode="scaleToFill" />
			<view class="home-search">
				<search background-color="rgba(255,255,255,.5)" @click="goPage('/pages/search/index')"></search>
				<view class="user_img" v-if="Object.keys(userInfo).length>0">
					<jd-avatar :src="userInfo.headImgUrl" @click="goUser('/pages/tabBar/user/index')"></jd-avatar>
				</view>
				<view v-else class="user_img" @click="onGetAuthorize()">
					<jd-avatar src="../../../static/img/avatar-default.png" ></jd-avatar>
				</view>
			</view>
			<view class="home-hispital">
				<view class="home-hispital-img">
					<jd-avatar :src="hospitalInfo.logoUrl" size="80"></jd-avatar>
				</view>
				<view class="home-hispital-info">
					<view class="hispital-name" v-if="hospitalInfo.orgName">
						{{ hospitalInfo.orgName||'' }}
						<view>{{ hospitalInfo.orgLevelName||'' }}</view>
					</view>
					<view class="address">{{ hospitalInfo.address||'' }}</view>
				</view>
			</view>
			<view class="home-menu">
				<view class="menu-list" v-for="(item, index) in hispitalMessage" :key="index">
					<view :url="item.url" @click="goHospitalAction(item)">
						<view><image :src="item.img" mode="scaleToFill" alt=""></image></view>
						<view>
							<text>{{ item.title }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="home-content">
			<view class="function">
				<view class="order">
					<navigator url="/pages/register/selectDepartment/index">
						<image src="../../../static/img/home/icon-yygh.png" mode="scaleToFill"></image>
						<text>预约挂号</text>
						<text>可预约7天内号源</text>
					</navigator>
				</view>
				<view class="function2">
					<view class="triage" @click="goToAI">
						<text>自测分诊</text>
						<text>不知道看什么科?</text>
					</view>
					<view class="register" @click="goTarget('/pages/register/record/index')">
						<text>我的挂号</text>
						<text>取消预约从此进</text>
					</view>
				</view>
			</view>
			<view class="modules" style="height: 232rpx;padding: 30rpx;">
				<sub-menu :menu="subMenus" @click="goTarget" title-size="32" ></sub-menu>
			</view>
			<view class="my-card modules" v-if="cardInfoList.length>0">
				<view style="padding: 0 30rpx;"><jd-card title="我的就诊凭证" view="选择就诊人" @clickCard="togglePatientsPopup"></jd-card></view>
				<uni-swipe @click="changePage" @change="changeSwipe" :current="cardIndex" :height="350" :list="cardInfoList" effect3d :autoplay="false">
					<template v-slot="{item}">
						<jd-card-item :color="item.cardType==='12'?'#333':'#fff'" :orgName="hospitalInfo.orgName" :item="item" :height="350">
							<view style="background: #fff;padding:6rpx 4rpx 0 4rpx;" v-if="item.cardType==='12'">
								<tki-qrcode
										:cid="item.cardNo+'qrcode'"
										:ref="item.cardNo+'qrcode'"
										val="https://www.baidu.com"
										:size="156"
										background="#ffffff"
										foreground="#000000"
										pdground="#000000"
										icon="/static/img/home/card_logo.png"
										:iconSize="20"
										:onval="true"
										:loadMake="true"
										:showLoading="false"
										loadingText="二维码生成中"
								/>
							</view>
						</jd-card-item>
					</template>
				</uni-swipe>
			</view>
			<view class="my-doctor modules" v-if="doctorsList.length>0">
				<view style="padding: 0 30rpx;"><jd-card title="我的医生" icon-type="''" ></jd-card></view>
				<my-doctor :doctorsList="doctorsList" :orgCode="orgCode"></my-doctor>
			</view>
			<view class="modules offices">
				<view class="top-search">
					<search color="#ccc" border-radius="10" iconSize="26" @click="goPage('/pages/search/index')"></search>
				</view>
				<view class="dep-card-list">
					<view class="dep-card-list-i flex-c-center" v-for="item in orgDeptList" :key="item.id" @click="goToDepartmentDetails(item)">
						<u-image width="60" height="60" :src="item.deptIcon || '/static/img/default-dept.png'" />
						<text class="title">{{item.deptName|filterDeptName}}</text>
					</view>
				</view>
			</view>
			<view class="my-center modules">
				<view style="padding: 0 30rpx;"><jd-card title="个人中心" icon-type="''"></jd-card></view>
				<sub-menu :menu="centerList" height="160rpx" @click="goTarget"></sub-menu>
			</view>
		</view>
		<jd-login ref="child"></jd-login>
		<card-qrcode v-if="Object.keys(cardQrCodeItem).length>0" @close="cardQrCodeItem={}" :item="cardQrCodeItem" :show="Object.keys(cardQrCodeItem).length>0"></card-qrcode>
		<select-patients-popup ref="selectPatientsPopup" title="请选择就诊人" :current="cardIndex" iconColor="#D9D9D9" @chooseList="choosePatient" @titleRightClick="goPage('/pages/archives/patients/add/index')" :list="outpatientList"  />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import SubMenu from '../components/sub-menus.vue';
	import JdCard from '@/customComponents/jd-card/index.vue';
	import JdLogin from '../../../customComponents/jd-login/index'
	import search from '../components/search.vue';
	import selectPatientsPopup from '@/customComponents/jd-action-sheet-popup/select-patients'
	import JdCardItem from "../../../customComponents/jd-card-item/index";
	import CardQrcode from "../components/card-qrcode";
	import MyDoctor from '../components/my-doctor'
	import JdAvatar from '@/customComponents/jd-avatar/index.vue';
	export default{
		name: 'home',
		components: {
			JdAvatar,
			JdCard,
			search,
			SubMenu,
			JdCardItem,
			JdLogin,
			CardQrcode,
			MyDoctor,
			selectPatientsPopup
		},
		data() {
			return {
				userInfo:{},//用户信息
				cardQrCodeItem:{},
				hospitalInfo: {}, //医院信息
				outpatientList:[],//我的就诊人
				cardInfoList:[], //就诊卡信息
				orgDeptList:[], //推荐科室
				doctorsList: [], //就诊过的医生信息
				swipeIndex:0,
				cardIndex:0,
				hispitalMessage: [
					{ img: '../../../static/img/home/yyjj.png', title: '医院简介',url:'/pages/hospital/info/index' },
					{ img: '../../../static/img/home/zdks.png', title: '重点科室',url:'/pages/hospital/department/index' },
					{ img: '../../../static/img/home/zjgg.png', title: '专家骨干',url:'/pages/hospital/doctor/index'},
					{ img: '../../../static/img/home/lydh.png', title: '来院导航',url:'' }
				],
				subMenus: [
					{ img: '../../../static/img/home/icon-qh.png', title: '取号', des: '在线取号候诊' },
					{ img: '../../../static/img/home/icon-jf.png', title: '交费',des: '手机支付不排队',url:'/pages/pay/waitLog/index'},
					{ img: '../../../static/img/home/icon-cbg.png', title: '查报告', des: '检验、检查报告', url:'/pages/report/query/index' }
				],
				centerList: [
					{ img:'../../../static/img/home/icon_wdgh.png', title: '我的挂号',url:'/pages/register/record/index'},
					{ img:'../../../static/img/home/icon_jzrg.png', title: '我的就诊人',url:'/pages/archives/patients/index'},
					{ img: '../../../static/img/home/icon-jf.png', title: '我的交费',url:'/pages/pay/record/index'},
				]
			};
		},
		computed:{
			...mapState({
				orgCode:state =>state.orgCode,
			}),
		},
		onLoad(){
			this.getOrgCode()
			this.hospitalInfo = uni.getStorageSync('hospital_info')||{};
			if(this.hospitalInfo.orgName){
				uni.setNavigationBarTitle({
					title:this.hospitalInfo.orgName
				})
			}
		},
		onShow(){
			this.userInfo = uni.getStorageSync('userInfo')||{};
			if(Object.keys(this.userInfo).length>0){
				this.getMyPatientCard(this.orgCode,this.userInfo.userId);
				this.getMyDoctor(this.orgCode,this.userInfo.userId)
			}
		},
		methods: {
			//appId换机构编码
			async getOrgCode(){
				if(!this.orgCode){
					const {result} = await this.$api.userChannel_org_appid({
						thdAppId:uni.getAppIdSync().appId
					});
					this.$store.commit('setOrgCode',result.orgCode)
					this.$store.commit('setAppId',result.thdAppId)
					this.$store.commit('setShowVerifyFlag',result.showVerifyFlag)
					this.getHospitalInfoData()
					this.getOrgDeptList()
				}else{
					this.getHospitalInfoData()
					this.getOrgDeptList()
				}
			},

			goToAI(){
				uni.navigateToMiniProgram({
					appId: '2021002124605198',
					path: '',
					success(res) {
						// 打开成功
						console.log('打开成功')
					}
				})
			},
			async getHospitalInfoData(){
				const { result } = await this.$api.basedata_hospital({orgCode:this.orgCode})
				this.hospitalInfo = result;
				uni.setNavigationBarTitle({
					title:this.hospitalInfo.orgName
				});
				uni.setStorage({key:'hospital_info',data: result})
			},
			goHospitalAction(item){
				if(item.title === '来院导航'){
					const {latitude,longitude,address} = this.hospitalInfo
					uni.openLocation({
						latitude,
						longitude,
						name:'来院导航',
						address,
					});
					return
				}
				uni.$u.route({ url:item.url})
			},
			async getOrgDeptList(){
				const {result=[]} = await this.$api.basedata_orgdept_list({
					orgCode:this.orgCode,
					recommend:1
				});
				this.orgDeptList = result;
			},
			async getMyPatientCard(orgCode,userId,outpatientId){
				let {cardInfoList} = await this.$api.ihosp_my_patient_card({
					orgCode:orgCode,
					userId:userId,
					outpatientId:outpatientId
				});
				if(Array.isArray(cardInfoList)&&cardInfoList.length>0){
					this.cardInfoList = cardInfoList;
				}
				this.getOutPatientList(cardInfoList||[])
			},
			async getOutPatientList(cardInfoList){
				const data = await this.$api.outpatient_user_query({
					userId:this.userInfo.userId,
					sensitiveEncFlag: 0
				})
				if(Number(data.code)===200&&data.outpatientList){
					this.outpatientList=[]
					this.outpatientList = [...cardInfoList];
					for(let item of data.outpatientList){
						//如果没用就诊卡
						if(!item.hasCard){
							this.outpatientList.push({
								certNo:item.certNo,
								certType:item.certType,
								outpatientId:item.outpatientId,
								outpatientName:item.name,
							});
						}
					}
				}
			},
			async getMyDoctor(orgCode,userId){
				const {orgEmpList} = await this.$api.ihosp_my_doctor({
					orgCode:orgCode,
					userId:userId,
				});
				if(orgEmpList&&Array.isArray(orgEmpList)){
					this.doctorsList=orgEmpList;
				}
			},
			changePage(item) {
				this.cardQrCodeItem = item
			},
			changeSwipe(index){
				this.swipeIndex = index;
				this.cardIndex = index;
			},
			goPage(url) {
				//switchTab
				this.$u.route({ url:url})
			},
			goTarget(url){
				this.$refs.child.getAuthSetting(url,this.userInfo)
			},
			choosePatient(index){
				let item = this.outpatientList[index]
				this.togglePatientsPopup()
				if(!item.cardNo){
					let param = `?type=add&name=${item.outpatientName}&outpatientId=${item.outpatientId}`
					this.$u.route({ url:'/pages/archives/patients/bind/index'+param})
				}else{
					this.cardIndex = index;
				}
			},
			onGetAuthorize() {
				uni.navigateTo({
					url: '/pages/auth/index?from='+encodeURIComponent('/pages/tabBar/home/index')
				});
			},
			goToDepartmentDetails(item){
				this.$u.route({url:`/pages/hospital/department/detail?id=${item.id}&deptCode=${item.deptCode}`})
			},
			toJSON(){
				return this
			},
			goUser(url){
				uni.switchTab({url:url});
			},
			togglePatientsPopup(){
				this.$refs.selectPatientsPopup._toggleShow()
			},
		},
		filters:{
			filterDeptName(val){
				if(val.length>4){
					return val.substr(0,4)+'...'
				}else{
					return val
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.home-page {
		width: 100%;margin-bottom: 20rpx;
		.home-top {
			width: 100%;height: 352rpx;position: relative;background-color:rgba(0,0,0,.1);
			.mask{
				position: absolute;left: 0;top:0;width: 100%;height: 352rpx;background-color: rgba(0, 0, 0, 0.2);; z-index:1;
			}
			>image{
				width: 100%;height:352rpx;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
				opacity: 0.8;position: relative;z-index: 0;
			}
			.home-search {
				position: absolute;width: 100%;top: 20rpx;left: 0;padding: 0 30rpx;display: flex;z-index: 10;
				.user_img {
					width: 60rpx;height: 60rpx;border-radius: 50%;margin-left: 20rpx;
				}
			}
			.home-hispital {
				position: absolute;top: 100rpx;left: 30rpx;height: 80rpx;
				background-repeat: no-repeat;
				color: $white;font-size: $font-s-base;display: flex;z-index: 10;
				.home-hispital-img{
					margin-right: 20rpx;
				}
				.home-hispital-info {
					flex: 1;font-size:$font-s-lg;
					.hispital-name{
						font-size:$font-s-lg;display: flex;
						view{
							color: $warning;
							border: 1rpx solid $warning;
							font-size: $font-s-sm;
							border-radius: 20rpx;
							margin-left: 15rpx;
							padding: 4rpx 10rpx;
						}
					}
					.address{
						font-size:$font-s-base;margin-top: 10rpx;
					}
				}
			}
			.home-menu {
				display: flex;
				position: absolute;
				bottom: 0;
				left: 30rpx;
				right: 30rpx;
				z-index: 10;
				width: calc(100% - 60rpx);
				background-color: rgba(48, 113, 234, 0.6);
				height: 130rpx;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				padding: 20rpx;
				box-sizing: border-box;
				.menu-list {
					text-align: center;
					height: 100%;
					flex: 1;
					cursor: pointer;
					image {
						width: 56rpx;
						height: 56rpx;
						color: $white;
					}
					text {
						color: $white;
						font-size: $font-s-sm;
					}
				}
			}
		}
		.home-content {
			margin: 0 30rpx;
			width: calc(100% - 60rpx);
			.function {
				width: 100%;
				background-color: $white;
				border-radius: 0 0 20rpx 20rpx;
				height: 280rpx;
				display: flex;
				.order {
					flex: 1;
					text-align: center;
					height: 100%;
					box-sizing: border-box;
					padding-top: 54rpx;
					border-right: 1rpx solid $line;
					image {
						width: 80rpx;
						height: 80rpx;
					}
					text {
						display: block;
						font-size:$font-s-lg;
						color: $text-color;
						margin-top: 8rpx;
						&:nth-of-type(2) {
							color: $text-color-grey;
							font-size:$font-s-sm;
						}
					}
				}
				.function2 {
					flex: 1;
					cursor: pointer;
					height: 100%;
					view {
						padding-left: 130rpx;
						box-sizing: border-box;
						padding-top: 27rpx;
						width: 100%;
						height: 140rpx;
					}
					.triage {
						background: url(@/static/img/home/icon-zcfz.png) no-repeat left 30rpx center;
						background-size: 80rpx 80rpx;
						border-bottom: 1rpx solid $line;
					}
					.register {
						background: url(@/static/img/home/icon-wdgh.png) no-repeat left 30rpx center;
						background-size: 80rpx 80rpx;
					}
					text {
						display: block;
						font-size:$font-s-lg;
						color: $text-color;
						margin-top: 8rpx;
						&:nth-of-type(2) {
							color: $text-color-grey;
							font-size:$font-s-sm;
						}
					}
				}
			}
			.modules {
				background-color: $white;
				width: 100%;
				border-radius: 20rpx;
				margin-top: 20rpx;
			}
			.my-card {
				height: 500rpx;
			}
			.my-doctor {
				height: 300rpx;
				.scroll_view_doctor {
					white-space: nowrap;width: 100%;
				}
			}
			.my-center {
				height: 250rpx;
				.center {
					display: flex;
					flex-direction: row;
					width: 100%;
					height: 160rpx;
					.list {
						width: 25%;
						text-align: center;
						padding-top: 5rpx;
						.img {
							width: 80rpx;
							height: 80rpx;
						}
						text {
							display: block;
							margin-top: 5rpx;
						}
					}
				}
			}
			.offices{
				width: 100%;padding: 20rpx;box-sizing: border-box;
				.top-search{
					background: #f4f4f4;width: 100%;border-radius: 10rpx;
				}
				.dep-card-list{
					margin-top: 20rpx;
					display:grid;
					grid-column-gap:19rpx;
					grid-row-gap:20rpx;
					grid-template-columns:1fr 1fr 1fr 1fr;
					.dep-card-list-i{
						width: 147rpx;
						height: 180rpx;
						background: #F5F7F9;
						border-radius: 10rpx;
						.title{
							margin-top:30rpx;
							font-size: $font-s-base;
							color: $text-color-grey;
						}
					}
				}
			}
		}
	}
</style>

<template>
	<view class="page-record-index">
		<view class="page-record-dropdown" :class="{'is-dropdown':showDropdown}">
			<u-dropdown @open="showDropdown = true" @close="showDropdown=false" title-size="32" height="88">
				<u-dropdown-item @change="getMyRecord" v-model="patientId" title="选择就诊人" :options="patientList"></u-dropdown-item>
				<u-dropdown-item @change="getMyRecord" v-model="tradeType" title="选择类型" :options="registTypeList"></u-dropdown-item>
			</u-dropdown>
		</view>
		<view class="page-record-mescroll">
			<mescroll-body ref="mescrollRef" top="80" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
				<view class="page-record-content">
					<template v-for="(item, index) in recordList">
						<view class="record-content-item" v-if="item.productStatus" :key="index" @click.stop="goToDetails(item.registId)">
							<record-item :item="item">
								<view slot="item">
									<info-row label="患者姓名" :val="item.patientName">
										<text slot="val">({{getCardTypeName(item.cardType)}}{{item.cardNum}})</text>
									</info-row>
									<info-row label="就诊时间" :val="item.consultationTime||''"></info-row>
									<info-row label="挂号诊金" :val="'￥'+item.orderAmt">
										<text slot="val">({{item.payStatus.value}})</text>
									</info-row>
								</view>
								<view class="record-item-bottom" v-if="getButtonName(item).length>0">
									{{item.productStatus.code==='PAY_INIT'?getTimeString(item.createTime,index)||'':''}}
									<view class="time" v-if="item.productStatus&&item.productStatus.code==='PAY_INIT'&&nowTimes[index]>0">
										请在 <u-count-down separator="zh" separator-size="28" font-size="28" separator-color="#3071EA" :show-hours="false" color="#3071EA" :timestamp="nowTimes[index]"></u-count-down>
										内支付
									</view>
									<view class="button">
										<view v-if="getButtonName(item)[0]">
											<jd-button size="mini" @submit="handleOrder(item,getButtonName(item),0)" shape="circle" :btn-style="{border:'1rpx solid #999999'}">{{getButtonName(item)[0].label}}</jd-button>
										</view>
										<view v-if="getButtonName(item)[1]" style="margin-left:20rpx">
											<jd-button size="mini" @submit="handleOrder(item,getButtonName(item),1)" shape="circle" type="primary" >{{getButtonName(item)[1].label}}</jd-button>
										</view>
									</view>
								</view>
							</record-item>
						</view>
					</template>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import config from '@/config'
	import MescrollMixin from "../../../components/mescroll-uni/mescroll-mixins";
	import infoRow from '../../../customComponents/jd-info-row/index.vue'
	import RecordItem from '../components/record-item/index.vue'
	import jdButton from '@/customComponents/jd-button/index';
	export default {
		name: 'record-index',
		mixins: [MescrollMixin],
		components:{
			infoRow,RecordItem,jdButton
		},
		data() {
			return {
				popupShow:false,
				zIndex:-1,
				patientId:'',
				tradeType:'',
				patientList:[],
				recordList: [],
				registTypeList:[
					{
						label: "预约挂号",
						value: "REGIST_PRE"
					},
					{
						label: "当日挂号",
						value: "REGIST_DAY"
					},
					{
						label: "全部类型",
						value: ""
					}
				],
				downOption:{
					use:true,
				},
				upOption: {
					textLoading: '加载中 ...', // 加载中的提示文本
					textNoMore: '-- 已经到底了 --', // 没有更多数据的提示文本
					offset: 150, // 距底部多远时,触发upCallback
					page: {
						num:0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size:10, // 每页数据的数量
						time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
					},
					empty: {
						use: true, // 是否显示空布局
						tip: '~ 暂无相关数据 ~' // 提示
					}
				},
				page:{},
				nowTimes:{},
				showDropdown:false,
				timer:{}
			};
		},
		onLoad(){
			this.userInfo = uni.getStorageSync('userInfo');
			this.getOutpatientInfo();
		},
		methods:{
			async getOutpatientInfo(){
				const { outpatientList=[] } = await this.$api.outpatient_user_query({userId:this.userInfo.userId})
				for (let item of outpatientList){
					this.patientList.push({label:item.name,value:item.outpatientId})
				}
				this.patientList.push({label:"全部就诊人", value:""});
			},
			downCallback(){
				this.recordList = []; // 先清空列表,显示加载进度
				this.mescroll.resetUpScroll();
			},
			async upCallback(page){
				this.page = page;
				this.getMyRecord()
			},
			async getMyRecord(){
				await this.$api.ihosp_regist_query({
					patientId:this.patientId,
					userId:this.userInfo.userId,
					tradeType:this.tradeType,
					pageNo:this.page.num,
					pageSize:this.page.size,
				}).then(result=>{
					let list= result.page.records || [];
					this.mescroll.endSuccess(list.length,this.page.size === list.length);
					if(this.page.num === 1){
						this.recordList = []
					}
					this.recordList=this.recordList.concat(list)
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
			},
			//订单操作
			handleOrder(item,buttonObj,index){
				let type = buttonObj[index].type;
				const handle={
					//取消订单
					'cancel':async (item)=>{
						let res = await this.$api.ihosp_regist_cancel({registId:item.registId,tradeType:'REGIST_CANCEL',orgCode:item.orgCode})
						if(Number(res.code)===200){
							this.$u.toast(`${item.tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}单取消成功`);
							this.getMyRecord()
						}
					},
					//支付
					'pay':(item)=>{
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: item.payOrderId,
							success:(res)=>{
								this.$u.toast('支付成功')
								this.getMyRecord()
							},fail: (err)=>{
								this.$u.toast('支付异常')
							}
						})
					},
					//刷新订单
					'freshen':(item)=>{
						this.getMyRecord()
					},
					//再次下单
					'again':(item)=>{
						uni.navigateTo({
							url: '/pages/register/selectDepartment/index'
						});
					}
				};
				return handle[type](item)
			},
			getTimeString(val,index){
				let nowTime = new Date().getTime();
				let currentTime = (new Date(val).getTime())+15*60*1000;
				this.nowTimes[index] = parseInt((currentTime-nowTime)/1000);
			},
			goToDetails(registId){
				uni.navigateTo({
					url:`/pages/register/record/details?registId=${registId}&userId=${this.userInfo.userId}`,//'/pages/register/record/details?registId='+registId,
					success:(res)=>{
						console.log(res)
					},
					fail:(err)=>{
						console.log(err)
					}
				});
			},
			getButtonName(item){
				let tradeTypeCode= item.tradeTypeCode
				let productStatus= item.productStatus?item.productStatus.code:'';
				let REGISTER_STATUS = config.common.REGISTER_STATUS;
				//预约中 挂号中  支付中等中间状态 没用操作按钮
				const buttonName = {
					[REGISTER_STATUS['PAY_INIT'].value]:[{label:`取消${tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}`,type:'cancel'},{label:'立即支付',type:'pay'}],  //待支付
					[REGISTER_STATUS['REGIST_SUCCEED'].value]:[{label:`取消${tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}`,type:'cancel'}], //挂号/预约成功
					[REGISTER_STATUS['FETCH_SUCCEED'].value]:[{label:'申请退号',type:'back'},{label:'刷新队列',type:'freshen'}], //已取号
					[REGISTER_STATUS['CANCEL_SUCCEED'].value]:['',{label:`再次${tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}`,type:'again'}],//已取消
					[REGISTER_STATUS['REGIST_FAILED'].value]:['',{label:`再次${tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}`,type:'again'}],//预约失败 /挂号失败
					[REGISTER_STATUS['COMPLETED'].value]:['',{label:`再次${tradeTypeCode==='REGIST_PRE'?'预约':'挂号'}`,type:'again'}], //已完成
					[REGISTER_STATUS['REGIST_UNKNOWN'].value]:['',{label:'重试确认',type:'freshen'}], //挂号异常 /预约异常
					[REGISTER_STATUS['PAY_UNKNOWN'].value]:['',{label:'重新查询',type:'freshen'}], //支付异常
				};
				return buttonName[productStatus]||[]
			},
			getCardTypeName(type){
				return config.common.CARD_TYPE_NAME[type]
			}
		}
	};
</script>

<style lang="scss" scoped>
	.page-record-index{
		width: 100%;
		.page-record-dropdown {
			display: flex;
			position: fixed;top:0;left: 0;right: 0;
			width: 100%;z-index:10;
			border-bottom: 1rpx solid #eee;
			background-color: #fff;
			&.is-dropdown::v-deep .u-dropdown__content{
				display: block;
			}
			::v-deep.u-dropdown__content{
				display: none;
			}
		}

		.page-record-mescroll{
			.page-record-content {
				width: 100%;padding:0 20rpx;box-sizing: border-box;
				.record-content-item{
					margin-top:20rpx;
					.record-item-bottom{
						display: flex;align-items: center;justify-content: flex-end;margin-top: 20rpx;
						.time{
							flex: 1;text-align: left;
							text{
								color:$primary; margin: 0 4rpx;
							}
						}
						.button{
							font-size:$font-s-sm;display: flex;text-align: right;
						}
					}
				}
			}
		}
	}
</style>

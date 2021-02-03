<template>
    <view class="page-pay-record">
        <view class="page-pay-record-dropdown" :class="{'is-dropdown':showDropdown}">
            <u-dropdown @open="showDropdown = true" @close="showDropdown=false" title-size="32" height="88">
                <u-dropdown-item @change="getPayRecord" height="500" v-model="patientId" title="选择就诊人" :options="patientList"></u-dropdown-item>
                <u-dropdown-item @change="getPayRecord" height="500" v-model="status" title="选择状态" :options="statusList"></u-dropdown-item>
            </u-dropdown>
        </view>
        <mescroll-body ref="mescrollRef" @init="mescrollInit" top="80" bottom="140" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
            <view class="page-pay-record-content">
                <template v-for="(item, index) in payList">
                    <view class="pay-content-item" :key="index" @click.stop="goToDetails(item)">
                        <record-Item :item="item">
                            <view slot="middle">
                                <info-row label="患者姓名" :val="item.patientName"></info-row>
                                <info-row label="开单医生" :val="item.doctorName">
                                    <text slot="val">(<!--{{orgName}}--> {{item.deptName}})</text>
                                </info-row>
                                <info-row label="开单时间" :val="item.orderTime||''"></info-row>
                            </view>
                        </record-Item>
                        <view class="footer" v-if="item.status.includes('UNKNOWN')||item.status.includes('FAILED')">
                            <text>网络异常，暂无法确认退款结果</text>
                            <jd-button size="mini" @submit="handleOrder()" shape="circle" type="primary" >重试退款</jd-button>
                        </view>
                    </view>
                </template>
            </view>
        </mescroll-body>
        <view class="pay-bottom" v-if="payList.filter(item=>item.status==='PAY_PROCESSING').length>0">
            <view>查看待交费用</view>
<!--            pages/pay/waitLog/index-->
            <view class="count" @click="goToWaitLog()">(还有{{payList.filter(item=>item.status==='PAY_PROCESSING').length}}笔) <u-icon name="arrow-right" color="#3071EA" size="28"></u-icon></view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import config from '@/config'
    import MescrollMixin from "../../../components/mescroll-uni/mescroll-mixins";
    import RecordItem from './card-item'
    import InfoRow from '../../../customComponents/jd-info-row/index.vue'
    import jdButton from '@/customComponents/jd-button/index';
    export default {
        name: 'pay-record-index',
        mixins: [MescrollMixin],
        components:{
            RecordItem,InfoRow,jdButton
        },
        data() {
            return {
                timer:null,
                orgName:'',
                patientId:'',
                status:'',
                patientList:[],
                payList: [],
                statusList:Object.values(config.common.PAY_STATUS).concat([{label: "全部类型", value: ""}]),
                downOption:{
                    use:true,
                },
                upOption: {
                    textLoading: '加载中 ...', // 加载中的提示文本
                    textNoMore: '-- 已经到底了 --', // 没有更多数据的提示文本
                    offset: 150, // 距底部多远时,触发upCallback
                    page: {
                        num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                        size:10, // 每页数据的数量
                        time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                    },
                    empty: {
                        use: true, // 是否显示空布局
                        tip: '~ 暂无相关数据 ~' // 提示
                    }
                },
                page:{},
                showDropdown:false,
                statusTimer:null
            };
        },
        computed: {
            ...mapState({
                orgCode:state =>state.orgCode,
            }),
        },
        onLoad(par){
            this.patientId = par.patientId;
            uni.getStorage({//获取本地缓存
                key:"hospital_info",
                success:(res)=>{
                    this.orgName = res.data.orgName
                }
            });
            this.userInfo = uni.getStorageSync('userInfo');
            this.getOutpatientInfo()
        },
        onUnload(){
            clearTimeout(this.statusTimer)
        },
        onHide(){
            clearTimeout(this.statusTimer)
        },
        methods:{
            async getOutpatientInfo(){
                const { outpatientList=[] } = await this.$api.outpatient_user_query({userId:this.userInfo.userId})
                this.patientList=[]
                if(outpatientList.length>0){
                    for (let item of outpatientList){
                        this.patientList.push({label:item.name,value:item.outpatientId})
                    }
                    this.patientList.push({label:"全部就诊人", value:""});
                }
            },
            handleOrder(){
                this.payList=[];
                this.getPayRecord()
            },
            downCallback(){
                this.payList = []; // 先清空列表,显示加载进度
                this.mescroll.resetUpScroll();
            },
            async upCallback(page){
                this.page = page;
                this.getPayRecord()
            },
            async getPayRecord(reload){
                await this.$api.fee_query_list({
                    orgCode:this.orgCode,
                    tradeType:config.order.QUERY_LIST_FEE,
                    status:this.status,
                    userId:this.userInfo.userId,
                    patientId:this.patientId,
                    pageNo:this.page.num,
                    pageSize:this.page.size,
                }).then(result=>{
                    let list= result.feeSubInfoPage.records || [];
                    this.mescroll.endSuccess(list.length,this.page.size === list.length);
                    if(this.page.num === 1){
                        this.payList = []
                    }
                    if(reload==='reload'){
                        this.payList = list
                    }else{
                        this.payList = this.payList.concat(list)
                    }
                    if(this.payList.find(item=>['FEE_PROCESSING','PAY_PROCESSING'].includes(item.status))){
                        this.statusTimer = setTimeout(()=>{
                            this.page={num:1, size:10};
                            this.getPayRecord('reload')
                        },3000)
                    }else{
                        clearTimeout(this.statusTimer)
                    }
                }).catch(()=>{
                    //联网失败, 结束加载
                    this.mescroll.endErr();
                });
            },
            goToWaitLog(){
                let data = this.payList.find(item=>['FEE_PROCESSING','PAY_PROCESSING'].includes(item.status));
                uni.navigateTo({
                    url:`/pages/pay/waitLog/index?cardId=${data.cardId}`
                });
            },
            goToDetails(item){
                uni.navigateTo({
                    url:`/pages/pay/record/details?orderNo=${item.orderNo}&orgCode=${this.orgCode}&feeSubId=${item.feeSubId}&tradeType=${config.order.QUERY_DETAIL_FEE}`
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .page-pay-record{
        width: 100%;
        .page-pay-record-dropdown {
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

        .page-pay-record-content {
            width: 100%;padding:0 20rpx;box-sizing: border-box;
            .pay-content-item{
                background-color: #fff;border-radius: 20rpx;
                .footer{
                    display: flex;justify-content: space-between;padding: 0 30rpx 20rpx;box-sizing: border-box;align-items: center;
                    text{
                        font-size: $font-s-base;color: #999;
                    }
                }
            }
        }
        .pay-bottom{
            width: 100vw;height: 88rpx;line-height: 88rpx;background-color: #fff;padding: 0 30rpx;box-sizing: border-box;
            position: fixed;bottom: 0;left: 0;font-size:$font-s-lg;display: flex;justify-content: space-between;z-index: 9;
            .count{
                color:$primary;
            }
        }
    }
</style>

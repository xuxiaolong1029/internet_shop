<template>
    <view class="page-pay-record">
        <view class="pay-content-item" v-if="feeSubInfo">
            <record-Item :item="feeSubInfo">
                <view slot="middle">
                    <info-row label="患者单号" :val="feeSubInfo.patientId||''"></info-row>
                    <info-row label="患者姓名" :val="feeSubInfo.patientName||''"></info-row>
                    <info-row label="开单医生" :val="feeSubInfo.doctorName||''">
                        <text slot="val">({{orgName}} {{feeSubInfo.deptName}})</text>
                    </info-row>
                    <info-row label="开单时间" :val="feeSubInfo.orderTime||''"></info-row>
                </view>
            </record-Item>
        </view>
        <view style="margin-top: 20rpx" v-if="feeSubDetailInfoList.length>0">
            <u-card title="费用明细" margin="0" title-size="32" color="#333" >
                <u-read-more slot="body" close-text=" " open-text=" " show-height="280" text-indent="0">
                    <view class="detailed" v-for="item in feeSubDetailInfoList" :key="item.itemCode">
                        <view class="pharmaceutical"><text class="name">{{item.itemName||''}}</text>
                            <text class="unit">x{{item.itemCount||''}}{{item.itemUnit||''}}</text></view>
                        <text class="price">￥{{item.itemAmt||''}}</text>
                    </view>
                </u-read-more>
            </u-card>
        </view>
        <view style="margin-top: 20rpx" v-if="orderPayInfo">
            <u-card title="支付信息" margin="0" title-size="32" color="#333" padding="20">
                <view class="" slot="body">
                    <info-row label="支付类型" :val="orderPayInfo.paymentTypeName||''"></info-row>
                    <info-row v-if="orderPayInfo.paymentType!=='SELF'" label="医保支付" :val="'￥'+orderPayInfo.insuAmt||''">
                        <text slot="val" :class="orderPayInfo.insuStatus">({{orderPayInfo.insuStatus||''}})</text>
                    </info-row>
                    <info-row label="自费支付" :val="'￥'+orderPayInfo.selfAmt||''">
                        <text slot="val" :class="orderPayInfo.selfStatus.code">({{orderPayInfo.selfStatus.value||''}})</text>
                    </info-row>
                    <info-row label="支付方式" :val="orderPayInfo.payOption||''"></info-row>
                    <info-row label="支付单号" :val="orderPayInfo.outTradeNo||''"></info-row>
                    <info-row label="支付时间" :val="orderPayInfo.payTime||''"></info-row>
                </view>
            </u-card>
        </view>
        <jd-modal ref="jdModal"></jd-modal>
        <view class="pay-bottom" @click="handleOrder" v-if="bottomIfShow">
            {{bottomName}}
        </view>
    </view>
</template>

<script>
    import RecordItem from './card-item'
    import JdModal from '../../../customComponents/jd-modal/index'
    import InfoRow from '../../../customComponents/jd-info-row/index.vue'
    export default {
        name: 'pay-record-details',
        components:{
            RecordItem,InfoRow,JdModal
        },
        data() {
            return {
                orgName:'',
                feeSubInfo:null,
                orderPayInfo:null,
                feeSubDetailInfoList: [],
                query:{}
            };
        },
        computed:{
            bottomIfShow(){
                if(this.feeSubInfo&&this.feeSubInfo.status){
                    return this.feeSubInfo.status.includes('UNKNOWN')||this.feeSubInfo.status.includes('FAILED')
                }else{
                    return false
                }
            },
            bottomName(){
                if(this.feeSubInfo&&this.feeSubInfo.status){
                    return this.feeSubInfo.status.includes('FAILED')?'重试退款':'重试查询支付结果'
                }else{
                    return false
                }
            }
        },
        onLoad(par){
            this.query = par
            uni.getStorage({//获取本地缓存
                key:"hospital_info",
                success:(res)=>{
                    this.orgName = res.data.orgName
                }
            });
            this.getPayDetails(this.query)
        },
        methods:{
            // 挂号单结果查询
            async getPayDetails(par,modal){
                let data = await this.$api.fee_query_detail(par);
                this.feeSubInfo = {...data.feeSubInfo};
                this.orderPayInfo = {...data.orderPayInfo};
                this.feeSubDetailInfoList = [...data.feeSubDetailInfoList];
                if(modal==='modal'){
                    this.$refs.jdModal.cancel();
                    let modalMessage={};
                    if(this.feeSubInfo.status&&['REFUND_SUCCEED','FEE_SUCCEED'].includes(this.feeSubInfo.status)){
                        modalMessage={
                            type:'_success',
                            title:this.bottomName==='重试退款'?'退款成功':'缴费成功',
                            content:this.bottomName==='重试退款'?'退款一般会在48小时内原路退还':'缴费信息将自动刷新',
                            showConfirm:true,
                            showCancel:false,
                            confirmText:'好的'
                        };
                    }
                    if(this.feeSubInfo.status&&['REFUND_UNKNOWN','FEE_UNKNOWN'].includes(this.feeSubInfo.status)){
                        modalMessage={
                            type:'_warning',
                            title:'仍然异常',
                            content:'网络异常，无法获取退款结果',
                            showConfirm:true,
                            showCancel:false,
                            confirmText:'好的'
                        };
                    }
                    if(this.feeSubInfo.status&&['REFUND_FAILED','FEE_UNKNOWN'].includes(this.feeSubInfo.status)){
                        modalMessage={
                            type:'_danger',
                            title:'缴费失败',
                            content:`因网络原因暂无法确认${this.bottomName==='重试退款'?'退款':'交费'}结果`,
                            showConfirm:true,
                            showCancel:false,
                            confirmText:'好的'
                        };
                    }
                    this.getModal(modalMessage)
                }
            },
            getModal(info){
                this.$refs.jdModal[info.type]({
                    title:info.title,
                    content:info.content,
                    showCancel:info.showCancel,
                    showConfirm:info.showConfirm,
                    confirmText:info.confirmText,
                    success:async(res)=>{
                        if(res.confirm) {
                            this.$refs.jdModal.cancel();
                        }
                    },
                    cancel:async(res)=>{
                        if(res.cancel) {
                            this.$refs.jdModal.cancel();
                        }
                    }
                })
            },
            //订单操作
            handleOrder(){
                let modalMessage={
                    type:'_loading',
                    title:this.bottomName==='重试退款'?'退款申请':'缴费状态查询',
                    content:this.bottomName==='重试退款'?'正在申请退款，请稍候...':'正在查询缴费状态，请稍候...'
                };
                this.getModal(modalMessage);
                this.getPayDetails(this.query,'modal')
            }
        }
    };
</script>

<style lang="scss" scoped>
    .page-pay-record{
        width: 100%;padding: 0 30rpx 120rpx;box-sizing: border-box;
        /deep/.u-card__head{
            padding: 20rpx 30rpx!important;
        }
        /deep/.u-card__body{
            padding: 10rpx 30rpx!important;
        }
        .REFUND_UNKNOWN,.REFUND_FAILED{
            color:$warning;
        }
        .pay-bottom{
            width: 100vw;height: 88rpx;line-height: 88rpx;background-color: #fff;
            position: fixed;bottom: 0;left: 0;font-size:$font-s-lg;z-index: 9;
            color:$primary;text-align: center;
        }
        .detailed{
            display: flex;align-items: center;justify-content: flex-end;
            .pharmaceutical{
                width: 470rpx;text-align: left;display: flex;align-items: center;
                .name{
                    display: inline-block;overflow: hidden;max-width: 390rpx;
                    white-space: nowrap;text-overflow: ellipsis;margin-right: 10rpx;
                }
                .unit{
                   flex: 1;white-space: nowrap
                }
            }
            .price{
                flex: 1;text-align: right;color:$warning;
            }
        }
    }
</style>

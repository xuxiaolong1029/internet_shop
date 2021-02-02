<template>
    <view class="pay-wait-log">
        <view class="top-nav-wrapper flex-r-sb-center" v-if="getPatient">
            <view class="left" @tap.stop="choosePatientAction">
                <u-cell-group :border="false">
                    <u-cell-item :title-style="{color:'#000'}" :title="getPatient" :arrow="false">
                        <u-icon v-slot:right-icon name="arrow-right" color="#BBB" size="28" />
                    </u-cell-item>
                </u-cell-group>
            </view>
<!--
            <view class="right" style="flex:1">
                <u-cell-group :border="false">
                    <u-cell-item title="医院" :value="orgName" :title-style="{color:'#999'}"  :arrow="false">
                        <u-icon slot="right-icon" name="arrow-right" color="#BBB" size="28" />
                    </u-cell-item>
                </u-cell-group>
            </view>-->
        </view>
        <u-gap height="88" bg-color="#f4f4f4" />
        <template v-if="waitPayList.length">
            <view class="list-w-w">
<!--                <u-checkbox-group wrap shape="circle">-->
<!--                        <u-checkbox-->
<!--                                v-for="(item, index) in waitPayList"-->
<!--                                @change="radioChange"-->
<!--                                :name="item.feeType"-->
<!--                                :key="item.feeType"-->
<!--                                v-model="item.checked"-->
<!--                        >-->
                <view class="list-w" v-for="(item, index) in waitPayList" @tap="checkboxChange(index)">
                    <view class="list-w__icon-wrap list-w__icon-wrap--circle" :class="[iconClass(item.checked)]">
                        <u-icon class="list-w__icon-wrap__icon" name="checkbox-mark" :size="20" :color="iconColor(item.checked)"/>
                    </view>
                    <view style="width: 100%">
                        <u-card margin="5px 0" @click="checkboxChange(index)" :head-border-bottom="false" border-radius="20" :border="false" :body-style="bodyStyle" :head-style="{paddingBottom:5}">
                            <view slot="head">
                                <view class="flex-r-sb-center">
                                    <text>{{item.feeType}}</text>
                                    <!--                                    <jd-tag bg-color="#fff" text="可医保" />-->
                                </view>
                                <text class="price">￥{{item.orderAmt}}</text>
                            </view>
                                <view slot="body" class="c-list-w" v-show="isShowPayInfoList(item.dataList)">
                                        <view v-for="pro in item.dataList" :key="pro.id" class="flex-r-s-center">
                                            <text class="li-c">{{pro.itemName}}</text>
                                            <text class="number" v-if="pro.itemCount"> x{{pro.itemCount}}{{pro.itemUnit}}</text>
                                        </view>
                                </view>
                        </u-card>
                    </view>

                </view>

<!--                        </u-checkbox>-->

<!--                </u-checkbox-group>-->
            </view>

            <view class="control-wrapper flex-r">
                <view class="right flex-r-center">
                    <text>支付金额</text>
                    <text class="total">￥{{total}}</text>
                </view>
                <view class="bt-w">
                    <jdButton
                            :disabled="!currentWaitPayList.length"
                            @submit="goPay" size="lg" border-radius="0" type="primary">确认支付</jdButton>
                </view>
            </view>

        </template>
        <template v-if="!waitPayList.length && !waitLogLoading">
<!--
            <jd-result marginTop="100" :text='`${getPatient}${placeholInfo.hubText}`'>
                <view class="res-card-no" v-if="placeholInfo.cardNo">{{placeholInfo.cardNo}}</view>
                <view class="res-org-name" v-if="isNotCardNo">{{orgName}}</view>
                <jd-button
                            shape="circle"
                            @submit="resultBtn"
                           :btn-style="{border:'1px solid #3071EA'}"
                           plain type="primary" size="mini" font-size="28">{{placeholInfo.btnName}}</jd-button>
            </jd-result>
            <jd-select-patients-list-wrapper @onHead="onPatientsHead">
                <jd-select-patients-list :notCardNoColor="notCardNoColor" :list="outpatientList" :current="patientsIndex" @chooseList="onPatientsPopup($event,false)" />
            </jd-select-patients-list-wrapper>-->
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
            <view style="margin-top: 60px" class="flex-r-center">
                <u-link underLine @onClick="goActionPage">查看已缴费记录</u-link>
            </view>
        </template>
        <select-patients-popup ref="selectPatientsPopup"
                               :current="patientsIndex"
                               @chooseList="onPatientsPopup"
                               @titleRightClick="onPatientsHead"
                               :list="outpatientList"  />
    </view>
</template>

<script>
    import jdRadio from '@/customComponents/jd-radio'
    import jdTag from '@/customComponents/jd-tag'
    import jdButton from '@/customComponents/jd-button'
    import selectPatientsPopup from '@/customComponents/jd-action-sheet-popup/select-patients'
    import { mapState } from 'vuex'
    import patientsCard from '@/viewComponents/jd-result-card/mixins'
    import jdResultCard from '@/viewComponents/jd-result-card'
    import config from '@/config'
    const {order:ORDER,common} = config
    export default {
        name: 'pay-wait-log',
        mixins:[patientsCard],
        components:{jdRadio,jdTag,jdButton,selectPatientsPopup, jdResultCard},
        data(){
            return{
                waitPayList: [
                     {
                         feeType: 'apple',
                         orderAmt:100,
                         checked:true,
                         dataList:[{
                             id:1,
                             itemName:'1. 血清促甲状腺激素测定(化学发光法)',
                             itemCount:3,
                             itemUnit:'盒'
                         }]
                     },{
                         feeType: 'apple1',
                         orderAmt:2000,
                         checked:false,
                         dataList:[{
                             id:2,
                             itemName:'1. 血清促甲状腺激素测定(化学发光法)腺激素腺激素',
                             itemCount:2,
                             itemUnit:'盒'
                         }]
                     },
                ],
                bodyStyle:{paddingTop:0,width:'100%'},
                patientTitle:'',
                waitLogLoading:true
            }
        },
        /**
         * @param cardId 查询某张卡的待缴费数据时必传
         */
        onLoad(query){
            this.cardId = query.cardId || ''
            this.getHospitalData()
        },
        async onShow(){
            this.cardInfoList = await this.getMyPatientCard(this.orgCode)
            let cardItem = this.cardInfoList.length? this.cardInfoList[0] : {}
            if(this.cardId) cardItem = this.cardInfoList.find(item => item.cardId === this.cardId) || cardItem
            await this.getWaitLog(cardItem)
            await this.getOutPatientList(this.cardInfoList||[])
        },
        onReady(){

        },
        computed:{
            ...mapState({
                orgCode:state =>state.orgCode,
            }),

            total(){
                return this.waitPayList.reduce((total,item)=> item.checked ? total + item.orderAmt : total,0)
            },
            isShowPayInfoList(){
                return function (list) {
                    return !!(Array.isArray(list) && list.length)
                }
            },
            iconClass() {
                return function(value) {
                    let classes = [];
                    if (value == true) classes.push('list-w__icon-wrap--checked');
                    return classes.join(' ');
                }
            },
            iconColor() {
                return function(value) {
                    return value ? '#ffffff' : 'transparent';
                }
            },
            placeholInfo(){
                if(!this.waitPayList.length){
                    let item = this.outpatientList[this.patientsIndex]
                    return {
                        btnName:this.isNotCardNo ? '修改登记号' : '绑定登记号/电子健康卡',
                        hubText:this.isNotCardNo ? '暂无支付的费用' : '还未绑定登记号/电子健康卡',
                        cardNo:this.isNotCardNo ? `${common.CARD_TYPE_NAME[item.cardType]} ${item.cardNo}` : '',
                    }
                }else {
                    return ''
                }
            },
            currentWaitPayList(){
                return this.waitPayList.filter(item=> !!item.checked)
            },
            notCardNoColor(){
                return this.waitPayList.length ? '#FF9C00' : '#999'
            }
        },
        methods:{
            checkboxChange(index){
                this.$set(this.waitPayList[index],'checked',!this.waitPayList[index].checked)
            },
            async getWaitLog(item){
                this.waitLogLoading = true
                const {outpatientId,cardNo,cardType,cardId}= item
                if(!cardId) {
                    this.waitLogLoading = false
                    return
                }
                try {
                    let {dataList} = await this.$api.ihosp_fee_query_list({
                        orgCode:this.orgCode,
                        tradeType:ORDER.QUERY_LIST_WAIT_FEE,
                        patientId:outpatientId,
                        cardNo:cardNo,
                        cardType:cardType,
                        cardId:cardId,
                    });
                    dataList.forEach(item=>{
                        item.checked = false
                    })
                    this.waitPayList = dataList
                    this.waitLogLoading = false
                }catch (e) {
                    this.waitLogLoading = false
                    console.log(e)
                }

            },

            choosePatientAction(){
                if(!this.waitPayList.length) return
                this.togglePatientsPopup()
            },
            async onPatientsPopup(index,isShowP=true){
                let item = this.outpatientList[index]
                if(isShowP) this.togglePatientsPopup();
                this.patientsIndex = index;
                if(!item.cardNo){
                    this.waitPayList = []
                    // let param = `?type=add&name=${item.outpatientName}&outpatientId=${item.outpatientId}`
                    // this.$u.route({ url:'/pages/archives/patients/bind/index'+param})
                }else{
                    await this.getWaitLog(item)
                }
            },
            goActionPage(){
                this.$u.route({url:'/pages/tabBar/home/index'})
            },
            goPay(){
                uni.setStorage({
                    key:'wait-pay-info',
                    data:{
                        waitPayList:this.currentWaitPayList,
                        patientsInfo:this.outpatientList[this.patientsIndex],
                        orgCode:this.orgCode,
                    }
                })
                this.$u.route({ url:'/pages/pay/confirmPay/index' })
            },
        },
    }
</script>

<style scoped lang="scss">

    .pay-wait-log{
        padding-bottom: 88rpx;
        ::v-deep.u-btn--primary--plain{
            background-color: transparent!important;
        }
        .top-nav-wrapper{
            z-index: 1000;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            border-top:1px solid #E3E3E3;
            height: 88rpx;
            overflow: hidden;
            .left{
                /*width: 250rpx;*/
                /*flex: 0 0 250rpx;*/
                flex: 1;
                border-right:1px solid #E3E3E3;
            }
            .right{
                flex: 1;
            }
        }
        .price{
            color: $text-color-money;
        }

            .list-w-w{
                padding: 10px 30rpx 30rpx 30rpx;
                box-sizing: border-box;
                .c-list-w{
                    background: #F3F7FF;
                    border-radius: 5px;
                    padding: 30rpx 20rpx;
                    width: 575rpx;
                    .li-c{
                        @include ellipsis_1(88%);
                    }
                    .number{
                        text-align: right;
                        flex: 0 0 70rpx;
                        width: 70rpx;
                        margin-left: 4px;
                    }
                }
            }


        .control-wrapper{
            background: $white;
            height: 88rpx;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            .right{
                flex: 1;
                font-size: $font-s-lg;
                .total{
                    color: $text-color-money;
                    margin-left: 5px;
                }
            }
            .bt-w{
                width: 372rpx;
                flex: 0 0 372rpx;
            }
        }


        .list-w {
            width: 100%;
            /* #ifndef APP-NVUE */
            display: inline-flex;
            /* #endif */
            align-items: center;
            overflow: hidden;
            user-select: none;
            line-height: 1.8;

            &__icon-wrap {
                color: $u-content-color;
                flex: none;
                display: -webkit-flex;
                /* #ifndef APP-NVUE */
                display: flex;
                flex-direction: row;
                /* #endif */
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                width: 40rpx;
                height: 40rpx;
                color: transparent;
                text-align: center;
                transition-property: color, border-color, background-color;
                font-size: 20px;
                border: 1px solid #c8c9cc;
                transition-duration: 0.2s;
                margin-right: 16rpx;
                /* #ifdef MP-TOUTIAO */
                // 头条小程序兼容性问题，需要设置行高为0，否则图标偏下
                &__icon {
                    line-height: 0;
                }
                /* #endif */

                &--circle {
                    border-radius: 100%;
                }

                &--square {
                    border-radius: 6rpx;
                }

                &--checked {
                    color: #fff;
                    background-color: $u-type-primary;
                    border-color: $u-type-primary;
                }

                &--disabled {
                    background-color: #ebedf0;
                    border-color: #c8c9cc;
                }

                &--disabled--checked {
                    color: #c8c9cc !important;
                }
            }

            &__label {
                word-wrap: break-word;
                margin-left: 10rpx;
                margin-right: 24rpx;
                color: $u-content-color;
                font-size: 30rpx;

                &--disabled {
                    color: #c8c9cc;
                }
            }
        }

    }
</style>

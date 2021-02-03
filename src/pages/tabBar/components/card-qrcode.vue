<template>
    <jd-alert-container :show="show" height="630rpx" :width="570" @close="closeAlert" background-color="transparent">
        <view class="qrcode-page">
            <image class="image" src="../../../static/img/qrcodebg.png" mode="scaleToFill" />
            <view class="card-qrcode">
                <view class="info">
                    <view class="name">{{item.outpatientName||'fsg'}}</view>
                    <view class="num"><text>{{getCardTypeName(item.cardType)}}</text>{{item.outpatientId}}</view>
                </view>
                <view class="qrcode" v-if="Object.keys(item).length>0" >
                    <tki-qrcode
                            ref="card_item_qrcode"
                            cid="qrcode22"
                            :val="item.certNo"
                            :size="240"
                            background="#ffffff"
                            foreground="#000000"
                            pdground="#000000"
                            :onval="true"
                            :loadMake="true"
                            :showLoading="true"
                            loadingText="二维码生成中"
                    />
                    <view>
                        <tki-barcode
                                ref="card_item_barcode"
                                cid="barcode"
                                onval
                                :val="item.certNo"
                                :load-make="true"
                                :opations="barOpations"
                        />
                    </view>
                </view>
            </view>
        </view>
    </jd-alert-container>
</template>

<script>
    import config from '@/config'
    import jdAlertContainer from '@/customComponents/jd-alert-container/index.vue';
    export default {
        name: "card_qrcode",
        components:{
            jdAlertContainer
        },
        props:{
            show:{
                type:Boolean,
                default:false
            },
            item:{
                type: Object,
                default: ()=>{}
            }
        },
        data(){
            return{
                barOpations:{
                    height: 100,
                    width:1.5,
                    marginTop:15,
                    displayValue:false
                }
            }
        },
        mounted(){
            console.log(this.item)
        },
        methods:{
            closeAlert(){
                this.$emit('close');
            },
            getCardTypeName(type){
                return config.common.CARD_TYPE_NAME[type]
            }
        }
    }
</script>

<style scoped lang="scss">
    .qrcode-page{
        width: 100%;height: 100%;position: relative;
        .image{
            position: absolute;z-index: 0;width: 560rpx;top:0;height: 630rpx;
        }
        .card-qrcode{
            width: 100%;padding:0 16rpx;position: relative;box-sizing: border-box;
            .info{
                width: 100%;height: 120rpx;padding:40rpx 20rpx;
                box-sizing: border-box;position: relative;margin-bottom: 40rpx;
                view{
                    font-size:$font-s-lg;
                }
                .num{
                    margin-top: 10rpx;font-size: 24rpx;
                    text{
                        color: #999;margin-right: 20rpx;
                    }
                }
            }
            .qrcode{
                width:calc(100% - 30rpx);height:470rpx;text-align: center;padding: 40rpx 0;
                border-top:2rpx dashed #D9D9D9;box-sizing: border-box;margin:0 8rpx;
            }
        }
    }
</style>
<template>
    <view class="info-wrapper set-bg-com" :style="{backgroundImage: `url(${info.imgUrl || ''})`,opacity:opacity}">
        <u-card :show-head="false" border-radius="20" :border="false" :body-style="{paddingBottom:0}">
            <view slot="body">
                <view class="top flex-r-sb-center">
                    <view class="flex-r-center">
                        <view class="avatar-w">
                            <u-avatar :src="info.logoUrl" />
                        </view>
                        <view class="tag-wrapper">
                            <text class="org-name">{{info.orgName}}</text>
                            <view class="tag-i-w flex-r">
                                <view style="margin-right: 3px">
                                    <jd-tag v-if="info.orgLevelName"
                                            shape="square"
                                            border-color="transparent"
                                           :text="info.orgLevelName" />
                                </view>
                                <view style="margin-right: 3px">
                                    <jd-tag  v-if="info.orgTypeName"
                                             shape="square"
                                             border-color="transparent"
                                            :text="info.orgTypeName" type="success" />
                                </view>
                                <jd-tag  v-if="info.orgNatureName"
                                         shape="square"
                                         font-size="24"
                                         border-color="transparent"
                                       :text="info.orgNatureName" type="success" />
                            </view>
                        </view>
                    </view>
                    <jd-icon-btn v-if="info.landline" @onClick="callTel"  name="phone-fill" color="#fff" type="primary" />
                </view>
                <view class="sub-address flex-r-s-center" @tap="goGps">
                    <view class="address">{{info.address}}</view>
                    <u-icon name="map-fill" color="#3071EA" size="40" />
                </view>
                <u-read-more ref="uReadMore1" text-indent="0" color="#3071EA" :shadow-style="shadowStyle" :toggle="true" :show-height="240" :close-text="closeText" :openText="openText">
                    <view class="cont-text">{{info.introduction}}</view>
                </u-read-more>
            </view>
        </u-card>
        <u-card title="特色科室" v-if="info.featureDept" title-size="32" border-radius="20" :border="false" :body-style="bodyStyle" :head-border-bottom="false">
            <u-read-more slot="body" ref="uReadMore" text-indent="0" color="#3071EA" :shadow-style="shadowStyle" :toggle="true" show-height="240" :close-text="closeText" :openText="openText">
                <view class="cont-text">{{info.featureDept}}</view>
            </u-read-more>
        </u-card>
        <u-card title="医院荣誉" v-if="info.orgHonor" title-size="32" border-radius="20" :border="false" :body-style="bodyStyle" :head-border-bottom="false">
            <u-read-more  slot="body" ref="uReadMore" text-indent="0" color="#3071EA" :shadow-style="shadowStyle" :toggle="true" show-height="240" :close-text="closeText" :openText="openText">
                <view class="cont-text">{{info.orgHonor}}</view>
            </u-read-more>
        </u-card>
    </view>
</template>

<script>
    import infoCard from '../components/info-card';
    import jdIconBtn from '@/customComponents/jd-button/icon-btn'
    import jdTag from '@/customComponents/jd-tag'
    import {mapState} from 'vuex'
    export default {
        name: 'hospital',
        components:{infoCard,jdIconBtn,jdTag},
        data() {
            return {
                src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
                shadowStyle:{
                    backgroundImage: "none",
                    paddingTop: 0,
                    marginTop: "20rpx"
                },
                closeText:'展开',
                openText:'收缩',
                bodyStyle:{paddingTop:0,paddingBottom:0},
                info:{},
                isToggle:true,
                showHeight:'240',
                opacity:0 // u-read-more组件初始化后设置1 避免出现闪现的问题
            }
        },
        onLoad(){

        },
        async onReady() {
            this.initData()

        },
        computed:{
            ...mapState(['orgCode'])
        },
        methods:{
            initData(){
                uni.getStorage({
                    key:'hospital_info',
                    success:async (res)=>{
                        if(res.data) this.info = res.data || {}
                        else await this.getInfoData()
                        this.setReadMoreOptions()
                            this.$nextTick(() => {
                                if(this.$refs.uReadMore) this.$refs.uReadMore.init();
                                if(this.$refs.uReadMore1) this.$refs.uReadMore1.init();
                                this.opacity = 1
                            })
                    }
                })
            },
            async getInfoData(){
                try {
                   const { result } = await this.$api.basedata_hospital({orgCode:this.orgCode})
                    this.info = result

                }catch (e) {

                }
            },
            callTel(){
                uni.makePhoneCall({
                    phoneNumber: this.info.landline
                });
            },
            setReadMoreOptions(){
                // 如未配置【特色科室】与【医院容易】内容，则医院简介默认全部显示，不设展开收起。
                if(!this.info.featureDept && !this.info.orgHonor){
                    this.isToggle = false
                    this.showHeight = 2000
                }
            },
            goGps(){
                const {latitude,longitude,address} = this.info
                uni.openLocation({
                    latitude,
                    longitude,
                    name:'来院导航',
                    address,
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .info-wrapper{
        .top{
            .tag-wrapper{
                margin-left: 20rpx;
                .tag-i-w{
                    margin-top: 2px;
                }
            }
            .avatar-w{
                border-radius: 50%;
                border: 1px solid rgba(48, 113, 234, 0.2);
            }
        }
        .sub-address{
            color: $text-color-grey;
            line-height: 40rpx;
            margin:10px 0;
            justify-content: space-between;
            .address{
                flex: 0 0 80%;
                margin-right: 40rpx;
            }
        }
        .cont-text{
            line-height: 40rpx;
        }
        .card-c-w{
            .title{
                font-size: $font-s-lg;
            }
        }

        ::v-deep .u-size-mini{
            font-size: 24rpx!important;
        }
    }
</style>

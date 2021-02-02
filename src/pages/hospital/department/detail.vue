<template>
    <view class="department set-bg-com" :style="{backgroundImage: `url(${info.deptImgUrl || bgUrl})`}">
        <u-card v-if="info.deptName" :title="info.deptName" :head-border-bottom="!!orgDeptExtraInfoVoList.length" title-size="32" border-radius="20" :border="false" :body-style="bodyStyle">
            <view slot="body">
                <u-cell-group :border="false" v-for="(item,index) in orgDeptExtraInfoVoList" :key="index">
                    <u-cell-item :border-bottom="orgDeptExtraInfoVoList.length-1 > index" :title="item.orgName" :label="item.address" :arrow="false" >
                        <view slot="right-icon">
                            <jd-icon-btn v-if="item.landline" @onClick="cellTel(item.landline)"  name="phone-fill" color="#fff" type="primary" />
                        </view>
                    </u-cell-item>
                </u-cell-group>
            </view>
        </u-card>
        <u-card v-if="info.introduction" title="科室简介" title-size="32" border-radius="20" :border="false" :body-style="bodyStyle" :head-border-bottom="false">
            <u-read-more slot="body" ref="uReadMore" text-indent="0" color="#3071EA" :shadow-style="shadowStyle" :toggle="true" show-height="240" :close-text="closeText" :openText="openText">
                <view class="cont-text">{{info.introduction}}</view>
            </u-read-more>
        </u-card>
        <u-card title="专家名医" v-if="docList.length" :head-border-bottom="false" border-radius="20" :border="false">
            <doctor-item :docList="docList" slot="body"></doctor-item>
        </u-card>
        <view class="btn-wrapper">
            <jd-button @submit="actionPage" type="primary">预约挂号</jd-button>
        </view>
    </view>
</template>

<script>
    import jdButton from '@/customComponents/jd-button/index'
    import jdIconBtn from '@/customComponents/jd-button/icon-btn'
    import doctorItem from '../components/doctor-item'
    import mixinsBgUrl from '../mixins/bgUrl'
    import { mapState } from 'vuex'
    import config from '@/config'
    const { common} = config
    export default {
        name: 'department',
        mixins:[mixinsBgUrl],
        components:{jdIconBtn,jdButton,doctorItem},
        data() {
            return {
                shadowStyle:{
                    backgroundImage: "none",
                    paddingTop: 0,
                    marginTop: "20rpx"
                },
                bodyStyle:{paddingTop:0,paddingBottom:5},
                closeText:'展开',
                openText:'收缩',
                info:{},
                docList:[],
                orgDeptExtraInfoVoList:[]
            };
        },
        /**
         * @param id 科室id
         * @param deptCode 科室码
         */
        onLoad({ id,deptCode}){
            this.getDeptDetail(id)
            this.getDoctorList(deptCode)
        },
        computed:{
            ...mapState(['orgCode'])
        },
        methods:{
            getDetail(){
                uni.getStorage({
                    key:'deptInfo',
                    success:(res={})=>{
                        this.info = res.data
                    }
                })
            },
            async getDeptDetail(id){
                const {result={}} = await this.$api.basedata_orgdept_info({
                    deptId:id
                })
                uni.setNavigationBarTitle({title:result.deptName})
                this.info = result
                this.orgDeptExtraInfoVoList = result.orgDeptExtraInfoVoList || []
            },
            async getDoctorList(deptCode){
                const {result={}} = await this.$api.basedata_orgemp_page_list({
                    orgCode:this.orgCode,
                    deptCode,
                    isExpert:1,
                    empType:1,
                    pageNo:1,
                    pageSize:500,
                })
                this.docList = result.records || []
            },
            actionPage(){
                this.$u.route({
                    url:'/pages/register/selectDoctor/index',
                    params:{
                        deptId:this.info.id,
                        orgCode:this.orgCode,
                        deptCode:this.info.deptCode,
                        deptName:this.info.deptName,
                        deptLast:common.DEPT_LAST.yes
                    }
                })
            },
            cellTel(phoneNumber){
                uni.makePhoneCall({
                    phoneNumber
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .department{
        padding-bottom:60px;
        ::v-deep.u-cell{
            padding-left: 0;
            padding-right: 0;
        }
        .cont-text{
            line-height: 40rpx;
            /*margin-top: 10px;*/
        }

        .btn-wrapper{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }

    }
</style>

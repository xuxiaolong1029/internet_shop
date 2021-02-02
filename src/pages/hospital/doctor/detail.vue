<template>
    <view class="doctor-detail set-bg-com" :style="{backgroundImage: `url(${bgUrl})`}">
        <u-card v-if="isShowInfoCard" :show-head="false" :head-border-bottom="false" border-radius="20" :border="false" :body-style="bodyStyle">
            <view slot="body">
                <view class="flex-r" style="margin-bottom: 10px">
                    <u-avatar size="80" :src="info.photoUrl"></u-avatar>
                    <view class="tag-wrapper flex-c">
                        <text>{{info.name}}</text>
                        <text class="rank">{{info.titleName}}</text>
                    </view>
                </view>
                <view class="cont-text">{{info.specialSkill}}</view>
            </view>
        </u-card>
        <u-card title="简介" v-if="info.introduction" title-size="32" :head-border-bottom="false" border-radius="20" :border="false" :body-style="{paddingTop:0}">
            <view slot="body" class="cont-text">{{info.introduction}}</view>
        </u-card>
        <view class="btn-wrapper">
            <jd-button @submit="actionPage" type="primary">预约挂号</jd-button>
        </view>
    </view>
</template>

<script>
    import jdButton from '@/customComponents/jd-button/index'
    import mixinsBgUrl from '../mixins/bgUrl'
    import config from '@/config'
    const { common} = config
    export default {
        name: 'doctor-detail',
        mixins:[mixinsBgUrl],
        components:{jdButton},
        data(){
            return{
                info:{},
                isShowBespeak:false
            }
        },
        onLoad(query){
            this.getDetail(query.id)
        },
        computed:{
            isShowInfoCard(){
                const {name,titleName,specialSkill} =this.info
                return name || titleName || specialSkill
            }
        },
        methods:{
            async getDetail(id){
                const {result={}} = await this.$api.basedata_orgemp_emp({id});
                this.info = result
                // await this.getOrderDateList([result.empCode || ''])
            },
            actionPage(){
                const {orgCode,empCode,deptCode,deptName,deptId} = this.info
                this.$u.route({
                    url:'/pages/register/doctorPage/index',
                    params:{
                        orgCode:orgCode,
                        doctorCode:empCode,
                        deptCode:deptCode,
                        deptName:deptName,
                        deptId:deptId,
                        deptLast:common.DEPT_LAST.yes
                    }
                })
            },
            async getOrderDateList(doctorCodeList = []){
                const {doctorList} = await this.$api.ihosp_doctor_sch_date_list({
                    orgCode:this.orgCode,
                    doctorCodeList,
                })
                this.isShowBespeak = !!(Array.isArray(doctorList) && doctorList.length)
            },
        }
    }
</script>

<style scoped lang="scss">
    .doctor-detail{
        padding-bottom: 60px;
    }
    .cont-text{
        line-height: 40rpx;
    }
    .tag-wrapper{
        margin-left: 20rpx;
        .org-name{
            font-size: $font-s-lg;
        }
    }
    .rank{
        margin-top: 5px;
        color: $text-color-grey;
    }
    .btn-wrapper{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>

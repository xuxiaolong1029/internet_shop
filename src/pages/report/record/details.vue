<template>
    <view class="page-report-details">
        <view class="tip">
            <u-icon name="error-circle-fill" size="24"></u-icon>
            <text>此报告仅对送检标本负责，结果供送检医生参考。</text>
        </view>
        <view class="report-details-content">
            <card-item :title="result.projectName">
                <view class="card-item-content">
                    <template v-for="(item,index) in patient_info_message">
                        <info-row :label="item.label" :val="result[item.value]" :key="index">
                            <view slot="val">
                                <!--visitType-->
                                <text v-if="item.label==='患者类型'">
                                    {{result.visitType==='zy'?'住院':'门诊'}}
                                </text>
                                <text v-if="item.value==='patientName'">
                                    （{{result.patientSex==='F'?'男':'女'}}&nbsp;&nbsp;&nbsp;{{result.patientAge}}岁）
                                </text>
                                <text v-if="item.label==='患者编号'">
                                    {{getCardTypeName(result.cardType)}} {{result.cardNo}}
                                </text>
                            </view>
                        </info-row>
                    </template>
                </view>
            </card-item>
        </view>
        <view class="result-list" v-if="reportType!=='jiancha'">
            <u-card title="名称" title-color="#999999" sub-title-color="#999999" title-size="28" sub-title="结果(参考值)" margin="0">
                <view class="" slot="body">
                    <template v-for="item in result.indicators">
                        <jd-card :key="item.code" card-height="84" title-size="28" :title="item.name" icon-type="''" >
                            <view slot="suffix" class="card-suffix">
                                <u-icon v-if="item.forward!=='normal'" :color="item.forward==='upper'?'#FF4949':'#12CE8A'" size="28" :name="item.forward==='upper'?'arrow-upward':'arrow-downward'"></u-icon>
                                {{item.result}}{{item.unit}} <text>({{item.min}}-{{item.max}})</text></view>
                        </jd-card>
                    </template>
                    <jd-card card-height="84" title-size="28" title="嗜酸性粒细胞比例" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                    <jd-card card-height="84" title="红细胞压积" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                    <jd-card card-height="84" title-size="28" title="红细胞压积" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                    <jd-card card-height="84" title="淋巴细胞比率" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                    <jd-card card-height="84" title-size="28" title="嗜酸性粒细胞比例" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                    <jd-card card-height="84" cardBorder="none" title="中性细胞数" icon-type="''" >
                        <view slot="suffix" class="card-suffix">6.41 <text>(0.4-8.0)</text></view>
                    </jd-card>
                </view>
            </u-card>
        </view>
        <view class="result-swipe" v-if="reportType!=='jianyan'">
            <uni-swipe :height="360" :list="swipeImg" :autoplay="false" @click="lookBigImage" >
                <template v-slot="{item}">
                    <image class="img" :src="item" mode="scaleToFill" />
                </template>
            </uni-swipe>
        </view>
        <view class="result-list" v-if="reportType!=='jianyan'">
            <u-card title="检查所见" title-size="32" margin="0">
                <view slot="body" style="padding:20rpx 0">
                    <u-read-more font-size="28" color="#333333">
                        {{result.examineShow}}
                    </u-read-more>
                </view>
            </u-card>
        </view>
        <view class="result-list" v-if="reportType!=='jianyan'">
            <u-card title="检查提示" title-size="32" margin="0">
                <view slot="body" style="padding:20rpx 0">
                    <u-read-more font-size="28" color="#333333">
                        {{result.diagnosis}}
                    </u-read-more>
                </view>
            </u-card>
        </view>
        <view class="user-info">
            <template v-for="(item,index) in doctor_info_message">
                <info-row :label="item.label" :val="result[item.value]" :key="index">
                </info-row>
            </template>
        </view>
    </view>
</template>

<script>
    import config from '@/config'
    import JdCard from '@/customComponents/jd-card/index.vue';
    import CardItem from './card-item'
    import InfoRow from '../../../customComponents/jd-info-row/index.vue'
    export default {
        name: "report-record-details",
        components:{CardItem,InfoRow,JdCard},
        data(){
            return{
                swipeImg:[],
                reportType:'',
                result:{},
                patient_info_message:[],
                doctor_info_message:[]
            }
        },
        onLoad(par){
            this.reportType = par.reportType||"jianyan";
            this.patient_info_message=
                this.reportType==='jiancha'?
                    [
                        {label:'患者姓名',value:'patientName'},
                        {label:'患者编号',value:''},
                        {label:'患者类型',value:''},
                        {label:'检查类型',value:'examineCategoryName'},
                        {label:'检查部位',value:'examinePartName'},
                        {label:'检查方法',value:'examineMethodName'},
                        {label:'检查编号',value:'examineId'},
                        {label:'影像编号',value:'medimgCode'},
                        {label:'检查仪器',value:'deviceName'}
                    ]:
                    [
                        {label:'患者姓名',value:'patientName'},
                        {label:'患者编号',value:''},
                        {label:'患者类型',value:''},
                        {label:'床位编号',value:'bedNo'},
                        {label:'标本类型',value:'specimenName'},
                        {label:'标本编号',value:'specimenCode'},
                        {label:'检测仪器',value:'deviceName'}
                    ];
            this.doctor_info_message=
                this.reportType!=='jiancha'?
                    [
                        {label:'申请科室',value:'applyDeptName'},
                        {label:'申请医师',value:'applyDoctorName'},
                        {label:'临床诊断',value:'diagnosis'},
                        {label:'采集时间',value:'collectTime'},
                        {label:'接收时间',value:'examineTime'},
                        {label:'报告时间',value:'reportTime'},
                        {label:'报告编号',value:'reportId'},
                        {label:'采集人',value:'collectDoctorName'},
                        {label:'检验人',value:'examineDoctorName'},
                        {label:'审核人',value:'auditDoctorName'}
                    ]:
                    [
                        {label:'申请科室',value:'applyDeptName'},
                        {label:'申请医师',value:'applyDoctorName'},
                        {label:'检查时间',value:'examineTime'},
                        {label:'报告时间',value:'reportTime'},
                        {label:'报告编号',value:'reportId'},
                        {label:'报告医师',value:'examineDoctorName'},
                        {label:'记录医师',value:'collectDoctorName'},
                        {label:'审核医师',value:'auditDoctorName'}
                    ];
            this.getReportDetails(par)
            this.query = par
        },
        methods:{
            async getReportDetails(par){
                let param = {
                    orgCode: par.orgCode||"54452", //医院编码
                    primaryId:par.primaryId||"12088229218808672256"
                }
                if(this.reportType==='jiancha'){
                    this.result = await this.$api.report_examine_detail(param);
                    this.swipeImg = this.result.medimgUrls.split(',');
                }else{
                    this.result = await this.$api.report_inspection_detail(param);
                }
            },
            lookBigImage(item){
                uni.navigateTo({
                    url:'/pages/report/record/image?image='+item
                });
            },
            getCardTypeName(type){
                return config.common.CARD_TYPE_NAME[type]
            }
        }
    }
</script>

<style scoped lang="scss">
    .page-report-details{
        width: 100vw;padding-bottom: 40rpx;font-family: PingFang SC;
        .tip{
            width: 100vw;height: 64rpx;line-height: 64rpx;padding: 0 30rpx;
            background: #FFF5E5;box-sizing: border-box;display: flex;justify-items: center;color: $warning;
            text{
                font-size:$font-s-sm;margin-left: 10rpx;
            }
        }
        .report-details-content{
            margin-top: 20rpx;
            .card-item-content{
                padding:26rpx 20rpx;background-color:#F3F7FF;border-radius:10rpx;
            }
        }
        .result-list{
            margin-top: 20rpx;
            /deep/.u-card__body{
                padding: 0 30rpx!important;
            }
            .card-suffix{
                color:$text-color;
                text{
                    color:$text-color-grey;
                }
            }
        }
        .user-info{
            margin-top: 20rpx;box-sizing: border-box;padding:26rpx 30rpx;background-color: $white;
        }
        .result-swipe{
            margin-top: 20rpx;width: 100%;padding: 30rpx 30rpx 60rpx 30rpx;box-sizing: border-box;background-color: $white;
            .img{
                width: 100%;height: 360rpx;
            }
        }

    }
</style>
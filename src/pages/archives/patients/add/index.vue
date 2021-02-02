<template>
    <view class="form-common-wrapper">
        <u-form :model="form" ref="uForm" label-width="190" :error-type="['toast']">
            <jd-form-item-card is-margin>
                <u-form-item label="姓名" prop="name">
                    <u-input v-model="form.name" placeholder="请在此输入姓名" focus />
                </u-form-item>
                <jd-form-item
                        v-if="!formType"
                        prop="patientCertNo"
                        @onLabelChange="getPopupValue($event,'patient')"
                              actionSheetTitle="选择证件类型"
                              itemRightIcon="arrow-down"
                              :label="cardTypeLabel" :options="options"
                              :actionSheetValue="form.patientCertType">
                    <u-input placeholder="请在此输入证件号"  v-model="form.patientCertNo"/>
                </jd-form-item>
                <template v-if="formType || !isIdCardType">
                    <u-form-item label="性别" prop="sex">
                        <jd-sex-tag v-model="form.sex" />
                    </u-form-item>
                    <jd-form-item
                            prop="birthDate"
                            label="出生日期"
                             isMask
                             @onMaskClick="showDatePicker = !showDatePicker"
                             :right-icon-style="leftIconStyle"
                             right-icon="arrow-right">
                        <u-input placeholder="请选择出生日期" v-model="form.birthDate"/>
                    </jd-form-item>
                </template>

            </jd-form-item-card>

            <jd-form-item-card is-margin v-if="formType">
                <u-form-item label="监护人姓名" placeholder="请在此输入监护人姓名" prop="guardianName"><u-input v-model="form.guardianName"  /></u-form-item>
                <jd-form-item
                        prop="guardianCertNo"
                        @onLabelChange="getPopupValue($event,'guardian')"
                        actionSheetTitle="选择证件类型"
                        itemRightIcon="arrow-down"
                        :label="'监护人'+guardianCertTypeLabel" :options="options"
                        :actionSheetValue="form.guardianCertType">
                    <u-input placeholder="请在此输入证件号" v-model="form.guardianCertNo"/>
                </jd-form-item>
            </jd-form-item-card>

            <jd-form-item-card is-margin v-if="showVerifyFlag !== '0'">
                <u-form-item label="验证码" prop="verifyCode">
                    <u-input v-model="form.verifyCode" type="number" placeholder="请在此输入验证码" />
                    <u-link @onClick="getCode" slot="right">{{tips}}</u-link>
                </u-form-item>
            </jd-form-item-card>
        </u-form>
        <view style="padding:30px 18px">
            <jd-button @submit="addAction" type="primary" size="lg" :disabled="false" :borderRadius="0">添加就诊人</jd-button>
        </view>
        <view class="link-wrapper flex-r-center">
            <u-link @onClick="toggleFormType" under-line>{{getFormTypeName}}</u-link>
        </view>
        <u-picker mode="date" @confirm="onTime" :defaultTime="defaultTime" v-model="showDatePicker"></u-picker>
        <u-verification-code  :seconds="seconds" ref="uCode"
                              @end="onVerificationEnd"
                              @change="codeChange"></u-verification-code>
        <jd-modal ref="jdModal" />
    </view>
</template>

<script>
    import jdFormItemCard from '@/customComponents/jd-form-item/card'
    import jdButton from '@/customComponents/jd-button';
    import jdFormItem from '@/customComponents/jd-form-item'
    import jdSexTag from '@/customComponents/jd-tag/sex-tag'
    import jdModal from '@/customComponents/jd-modal'
    import mixins from '@/mixins'
    import rules from './rules'
    import config from '@/config'
    import {navigateBack} from '@/utils'
    import {mapState} from 'vuex'
    const {common} = config
    import CONS from './config'

    export default {
        name: 'patients-add',
        mixins:[mixins.datePicker,rules],
        components:{jdFormItemCard,jdButton,jdFormItem,jdSexTag,jdModal},
        data(){
            return{
                tips: '',
                form:{
                    [CONS.PATIENT_CERT_TYPE]:common.CARD_TYPE[0].value,
                    [CONS.SEX]:'',
                    [CONS.NAME]:'',
                    [CONS.PATIENT_CERT_NO]:'',
                    [CONS.GUARDIAN_CERT_NO]:'',
                    [CONS.GUARDIAN_CERT_TYPE]:common.CARD_TYPE[0].value,
                    [CONS.VERIFY_CODE]:''
                },
                leftIconStyle:{ color:'#ccc'},
                options: common.CARD_TYPE,
                formType:false, // 有身份证
                seconds: 60,
                userInfo:uni.getStorageSync('userInfo')
            }
        },
        /**
         * @param backParams 返回页面参数名
         */
        onLoad(query){
            this.query = query
        },
        onReady() {
            this.$refs.uForm.setRules(this.rules);
        },
        computed:{
            ...mapState(['showVerifyFlag','appId','orgCode']),
            cardTypeLabel(){
                if(this.form.patientCertType){
                    const cardTypeItem = common.CARD_TYPE.find(item=>item.value === this.form.patientCertType) || {}
                    return cardTypeItem.label
                }else {
                    return common.CARD_TYPE[0].label
                }
            },
            guardianCertTypeLabel(){
                if(this.form.guardianCertType){
                    const cardTypeItem = common.CARD_TYPE.find(item=>item.value === this.form.guardianCertType) || {}
                    return cardTypeItem.label
                }else {
                    return common.CARD_TYPE[0].label
                }

            },
            getFormTypeName(){
                return this.formType ?  '有身份证件？' : '没有身份证件？'
            },
            isIdCardType(){
                return this.form[CONS.PATIENT_CERT_TYPE] === common.CARD_TYPE[0].value
            }
        },
        watch:{
        },
        methods:{
            getPopupValue(item,name){
                this.$set(this.form,`${name}CertType`,item.value)
            },
            async addAction(){
                const {jdModal} = this.$refs
                this.$refs.uForm.validate(async valid => {
                    if(!valid) return
                    console.log('orgCode',this.orgCode)
                    let params={
                        orgCode:this.orgCode,
                        sensitiveEncFlag: 0, // 不加密
                        userId:this.userInfo.userId,
                        patientCertFlag:!this.formType ? 'Y' :'N',
                        showVerifyFlag:this.showVerifyFlag,
                        patientMobileNo:this.patientMobileNo
                    }

                    let newParamsArr = []
                    if(!this.formType){ // 有身份情况
                        if(this.isIdCardType){ //证件类型=>身份证
                            newParamsArr = [...CONS.HAS_ID_CARD]
                        }else {
                            newParamsArr= [...CONS.OTHER_CARD_TYPE_ARR] //证件类型=>非身份证
                        }
                    }else { // 没有身份证情况
                        newParamsArr=[...CONS.NO_HAS_ID_CARD]
                    }

                    for(let value of newParamsArr){
                        params[value] = this.form[value]
                    }

                    const response = await this.$api.outpatient_info_create(params,{isResponseBody:true})
                    const {backParams} = this.query
                    if(response.code == 200){
                        jdModal._success({
                            title:`添加就诊人成功`,
                            content:`已可选择新添加的就诊人`,
                            confirmText:'好的',
                            success:(res)=>{
                                if (res.confirm) {
                                    navigateBack({
                                        delta:1,
                                        params:{
                                            [backParams]:response[backParams],
                                        },
                                        /*
                                        params:response,
                                        fnName:backParams
                                        */
                                    })
                                }
                            }
                        })
                    }else if(response.code === '12200211'){
                        jdModal._warning({
                            title:`院内未登记此人信息`,
                            content:`请先完成远呢日患者信息建档`,
                            confirmText:'在线建档',
                            success:(res)=>{
                                if (res.confirm) {
                                    this.$u.route({
                                        url:'/pages/archives/onlineFile/index',
                                        params:{
                                            origin:'add',
                                            certNo:this.form[CONS.PATIENT_CERT_NO],
                                            name:this.form[CONS.NAME],
                                            certType:this.form[CONS.PATIENT_CERT_TYPE],
                                        }
                                    })
                                }
                            }
                        })
                    }
                })

            },
            toggleFormType(){
                this.formType =!this.formType
                if(!this.formType){ // 有身份证
                    this.$set(this.form,CONS.PATIENT_CERT_TYPE,common.CARD_TYPE[0].value)
                    this.$delete(this.form,'sex')
                }else {
                    this.$set(this.form,'sex','')
                    this.$delete(this.form,CONS.PATIENT_CERT_TYPE)
                }
            },
            onTime(val){
                this.defaultTime = this._filterTime(val)
                this.form['birthDate'] = this._filterTime(val)
            },
            codeChange(text) {
                this.tips = text;
            },
            getCode() {
                if(!this.$refs.uCode.canGetCode) return
                this.$refs.uForm.validate(async valid => {
                    if(!valid) return
                    const {patientCertNo,patientCertType,guardianCertNo,guardianCertType} = this.form
                    try {
                        const {mobileNo} = await this.$api.sms_verify_code_cert_no({
                            thdAppId:this.appId,
                            certNo:!this.formType ? patientCertNo : guardianCertNo,
                            certType:!this.formType ? patientCertType : guardianCertType
                        })
                        this.patientMobileNo = mobileNo || ''
                        this.$u.toast('验证码已发送');
                        // 通知验证码组件内部开始倒计时
                        this.$refs.uCode.start();
                    }catch (e) {
                        console.log(e)
                    }
                })
            },
            onVerificationEnd(){

            }
        }
    }
</script>

<style scoped>
    .link-wrapper{
        margin-top: 40px;
        height: 25px;
    }
</style>

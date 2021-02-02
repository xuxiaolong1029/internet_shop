<template>
    <view class="online-file form-common-wrapper">
        <u-form :model="form" ref="uForm" label-width="180">
            <jd-form-item-card>
                <u-form-item label="医院">
                    <view style="padding: 10rpx">{{hospitalInfo.orgName}}</view>
                </u-form-item>
                <jd-form-item
                        ref="formItemStaff"
                        @onLabelChange="getPopupValue"
                              actionSheetTitle="选择建档类型"
                              :isItemRightAction="false"
                              right-icon="arrow-right"
                              label="建档类型" :options="actionSheetStaffOptions"
                              :actionSheetValue="form.staffType">
                    <u-input v-model="form.staffType" :custom-style="{display:'none'}" />
                    <view @click="showStaffTypeActionSheet" style="padding: 5px 5px">{{staffTypeName}}</view>
                </jd-form-item>
            </jd-form-item-card>
            <jd-form-item-card is-margin>
                <u-form-item label="姓名" prop="realName">
                    <u-input :disabled="originBind" v-model="form.realName"placeholder="请在此输入姓名" />
                </u-form-item>
                <jd-form-item
                            prop="certNo"
                            @onLabelChange="selectIdType"
                            actionSheetTitle="选择身份类型"
                            itemRightIcon="arrow-down"
                            :label="cardTypeLabel" :options="actionSheetCardOptions"
                            :actionSheetValue="form.certType">
                    <u-input v-model="form.certNo" placeholder="请在此输入证件号" />
                </jd-form-item>
            </jd-form-item-card>
            <jd-form-item-card is-margin>
                <u-form-item label="手机号">
                    <u-input v-model="form.mobile" type="number" placeholder="请在此输入手机号" />
                </u-form-item>
                <jd-form-item label="居住地"
                             :right-icon-style="{color:'#ccc'}"
                             right-icon="arrow-right"
                             isMask
                             @onMaskClick="showAddressPicker = !showAddressPicker"
                >
                    <u-input v-model="form.address" placeholder="请在此输入地址" />
                </jd-form-item>
                <u-form-item label="详细地址" prop="intro">
                    <u-input v-model="form.addressDtl" :height="30" placeholder="请在此输入详细地址"/>
                    <view class="place-subtext">例：xxx路xxx号xxx小区xxx楼xxx室</view>
                </u-form-item>
            </jd-form-item-card>
        </u-form>
        <view style="padding:30px 18px">
            <jd-button @submit="addSubmit" type="primary" size="lg" :borderRadius="0">在线建档</jd-button>
        </view>
        <u-picker mode="region"
                  v-model="showAddressPicker"
                  @confirm="onAddressPicker"
        />
        <jd-action-sheet-popup-wrapper title="建档类型" ref="jdActionSheetPopupWrapper" @onChange="getPopupValue" :options="actionSheetStaffOptions" :current="form.staffType" />
        <jd-modal ref="jdModal"></jd-modal>
    </view>
</template>

<script>
    import jdButton from '@/customComponents/jd-button'
    import jdFormItemCard from '@/customComponents/jd-form-item/card'
    import jdFormItem from '@/customComponents/jd-form-item'
    import jdActionSheetPopupWrapper from '@/customComponents/jd-action-sheet-popup/select-type'
    import jdModal from '@/customComponents/jd-modal'
    import CONS from './config'

    import {mapState,mapGetters} from 'vuex'
    import config from '@/config'
    const {common} = config
    export default {
        name: 'onlineFile',
        components: {
            jdButton,
            jdFormItemCard,
            jdFormItem,
            jdActionSheetPopupWrapper,
            jdModal
        },
        data () {
            return {
                form: {
                    [CONS.CERT_NO]:'',
                    [CONS.REAL_NAME]:'',
                    staffType: common.STAFF_TYPE[0].value,
                    certType:common.CARD_TYPE[0].value
                },
                radio: '',
                switchVal: false,
                actionSheetCardOptions: common.CARD_TYPE,
                actionSheetStaffOptions:common.STAFF_TYPE,
                hospitalInfo:uni.getStorageSync('hospital_info') || {},
                showAddressPicker:false,
                userInfo:uni.getStorageSync('userInfo') || {},
                query:{}
            }
        },
        /**
         * @param origin 来源类型 bind绑卡页面 add添加就诊人页面
         * @param outpatientId 就诊人ID
         * @param staffType 建档类型 0在线建档 1医保建档
         * @param realName 用户名
         * @param certNo   证件号
         * @param certType 证件类型
         */
        onLoad (query) {
            this.query = query
            this.getInitData(query)
        },
        computed:{
            // ...mapState(['orgCode','userInfo']),
            ...mapState({
                orgCode:state =>state.orgCode,
            }),
            cardTypeLabel(){
                if(this.form.certType){
                    let item = this.actionSheetCardOptions.find(item => item.value === this.form.certType) || {}
                    return item.label
                }
                else return common.CARD_TYPE[0].label
            },
            staffTypeName(){
                const item = common.STAFF_TYPE.find(item => item.value === this.form.staffType) || {}
                return item.label
            },
            originBind(){
                return this.query.origin === 'bind'
            }
        },
        methods:{
            async getInitData({name,certNo,certType}){
                if(this.originBind){
                    await this.getOutpatientInfo()
                }else {
                    let obj = {mobile:this.userInfo.mobileNo,address:this.hospitalInfo.address,realName:name,certNo,certType}
                    for(let key in obj){
                        if(obj.hasOwnProperty(key)){
                            this.$set(this.form,key,obj[key])
                        }
                    }
                    this.setMobile()
                    this.setLocation()
                }
            },
            async getOutpatientInfo(){
                const res = await this.$api.outpatient_info_query({
                    sensitiveEncFlag:0,
                    outpatientId:this.query.outpatientId || "12088332729901342720"
                })
                let setArr = [
                        {value:CONS.REAL_NAME,key:'name'},
                        {value:'certType',key:'certType'},
                        {value:CONS.CERT_NO,key:CONS.CERT_NO},
                        {value:'mobile',key:'mobileNo'},
                        {value:CONS.ADDRESS,key:'location'},
                        {value:'addressDtl',key:'detailAddress'},
                    ]
                for (let key in res){
                    if (res.hasOwnProperty(key)){
                        setArr.forEach(item=>{
                            if(key === item.key){
                                if(key === 'mobileNo' && !res[key]){
                                    this.setMobile()
                                }else if(key === 'location' && !res[key]){
                                    this.setLocation()
                                }else {
                                    this.$set(this.form,item.value ,res[key])
                                }
                            }
                        })
                    }
                }
            },
            async addSubmit(){
                try {
                    const {userId} = uni.getStorageSync('userInfo') || {}
                    let params ={
                        orgCode:this.orgCode,
                        userId,
                        ...this.form,
                    }
                    const res = await this.$api.user_archives_create(params)
                    this.$refs.jdModal._success({
                        title:`在线建档成功`,
                        content:`${this.form.realName}的登记号是${res.registNum}`,
                        confirmText:'好的',
                        success:async(res)=>{
                            if (res.confirm) {
                                uni.navigateBack({
                                    delta:1
                                })
                            }
                        }
                    })
                }catch (e) {
                    this.$refs.jdModal._warning({
                        title:`在线建档失败`,
                        content:`请前往医院服务窗口办理建档`,
                        confirmText:'好的',
                        showCancel:false
                    })
                }

            },
            async selectIdType(item){
                this.$set(this.form,'certType',item.value)
            },
            getPopupValue(item){
                this.$set(this.form,'staffType',item.value)
            },
            showStaffTypeActionSheet(){
                this.$refs.formItemStaff.toggleShow()
            },
            onAddressPicker(addressObj){
                let address = ''
                for(let key in addressObj){
                    let item = addressObj[key]
                    address += item.label
                }
                this.$set(this.form,'address',address)
            },
            setMobile(){
                this.$set(this.form,'mobile' ,this.userInfo.mobileNo)
            },
            setLocation(){
                this.$set(this.form,CONS.ADDRESS ,this.hospitalInfo.address)
            },
        }
    }
</script>
<style lang="scss">
</style>
<style scoped lang="scss">
    .online-file {
        padding: 18rpx 0 100px 0;

        .place-subtext {
            color: $text-color-placeholder;
            margin: -6px 0 0 18rpx;
        }
    }
</style>

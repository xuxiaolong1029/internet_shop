<template>
    <view class="patients-edit" :style="{opacity:opacity}">
        <u-tabs active-color="#3071EA"
                inactive-color="#333"
                bar-height="4"
                :bar-style="{backgroundColor:'#3071ea'}"
                :list="tabList"
                :is-scroll="false"
                :current="tabValue"
                @change="tabsChange"/>
        <view v-if="tabValue === 0" class="form-common-wrapper">
            <u-form :model="form" ref="uForm" label-width="190">
                <jd-form-item-card is-margin>
                    <jd-form-item
                            isMask
                            label="姓名">
                        <u-input v-model="form.name" />
                    </jd-form-item>
                    <jd-form-item
                            ref="actionSheetRelation"
                            label="关系"
                            @onLabelChange="selectIdType($event,'relation')"
                            :right-icon-style="leftIconStyle"
                            isMask
                            itemRightIcon="1"
                            actionSheetTitle="选择关系类型"
                            @onMaskClick="showActionSheetRelation"
                            :options="actionSheetRelationOptions"
                            :actionSheetValue="form.relation"
                            right-icon="arrow-right">
                        <u-input :value="relationName" placeholder="请选择关系"/>
                    </jd-form-item>
                    <jd-form-item @onLabelChange="selectIdType($event,'certType')"
                                  actionSheetTitle="选择身份类型"
                                  itemRightIcon="arrow-down"
                                  :label="cardTypeLabel" :options="actionSheetCardOptions"
                                :actionSheetValue="form.certType">
                        <u-input v-model="form.certNo"/>
                    </jd-form-item>
                    <u-form-item label="性别">
                        <jd-sex-tag v-model="form.sex" />
                    </u-form-item>
                    <jd-form-item label="出生日期"
                                 isMask
                                 @onMaskClick="showDatePicker = !showDatePicker"
                                 right-icon="arrow-right">
                        <u-input v-model="form.birthDate" placeholder="请选择出生日期" />
                    </jd-form-item>
                    <jd-form-item
                                 label="籍贯"
                                 :right-icon-style="leftIconStyle"
                                 isMask
                                 @onMaskClick="showNativePlacePicker=!showNativePlacePicker"
                                 right-icon="arrow-right">
                        <u-input v-model="form.nativePlace" placeholder="请选择籍贯"/>
                    </jd-form-item>
                </jd-form-item-card>
                <jd-form-item-card is-margin>
                    <u-form-item label="手机号">
                        <u-input v-model="form.mobileNo" type="number" placeholder="请在此输入手机号"/>
                    </u-form-item>
                    <jd-form-item label="居住地"
                                 :right-icon-style="leftIconStyle"
                                 right-icon="arrow-right"
                                  isMask
                                  @onMaskClick="showAddressPicker=!showAddressPicker"
                    >
                        <u-input v-model="form.location" placeholder="请选择居住地" />
                    </jd-form-item>
                    <u-form-item label="详细地址" prop="intro">
                        <u-input v-model="form.detailAddress" placeholder="请在此输入详细地址"/>
                    </u-form-item>
                </jd-form-item-card>

                <jd-form-item-card is-margin v-if="form.guardianCertType">
                    <u-form-item label="监护人姓名">
                        <u-input v-model="form.guardianName" placeholder="请在此输入监护人姓名" />
                    </u-form-item>
                    <jd-form-item @onLabelChange="selectIdType($event,'guardianCertType')"
                                  actionSheetTitle="选择监护人身份类型"
                                  itemRightIcon="arrow-down"
                                  :label="guardianLabel"
                                  :options="actionSheetCardOptions"
                                  :actionSheetValue="form.guardianCertType">
                        <u-input v-model="form.guardianCertNo" placeholder="请在此输入监护人证件号"/>
                    </jd-form-item>
                </jd-form-item-card>

            </u-form>
            <view class="add-info" v-if="!form.guardianCertType">
                <link-icon-btn @onClick="addGuardianForm">添加监护人</link-icon-btn>
            </view>
            <view class="btn-control flex-r-center">
                <jd-button @submit="deleteAction"
                           size="lg" style="flex: 1"
                           border-radius="0"
                           :btn-style="{flex:1}">删除就诊人</jd-button>
                <jd-button @submit="saveAction"
                           size="lg" style="flex: 1"
                           border-radius="0"
                           :btn-style="{flex:1}" type="primary">保存就诊人信息</jd-button>
            </view>
        </view>
        <card v-if="tabValue === 1"
              :cardInfoList="cardInfoList"
              :outpatientId="outpatientId"
              :name="form.name"
              @updateCard="getCardList" />
        <u-picker mode="region"
                  v-model="showAddressPicker"
                  @confirm="onAddressPicker($event,'location')"
        />
        <u-picker mode="provinces"
                  v-model="showNativePlacePicker"
                  @confirm="onAddressPicker($event,'nativePlace')"
        />
        <u-picker mode="date"
                  @confirm="onChangeDate"
                  :end-year="endYear"
                  :defaultTime="defaultTime"
                  v-model="showDatePicker" />
        <jd-modal ref="jdModal" />
    </view>
</template>

<script>
    import jdFormItemCard from '@/customComponents/jd-form-item/card'
    import jdSexTag from '@/customComponents/jd-tag/sex-tag'
    import jdButton from '@/customComponents/jd-button/index'
    import linkIconBtn from '@/customComponents/jd-button/link-icon-btn'
    import card from './components/card'
    import jdFormItem from '@/customComponents/jd-form-item'
    import jdModal from '@/customComponents/jd-modal'
    import mixins from '@/mixins'
    import config from '@/config'
    import {mapState} from 'vuex'

    const {common} = config
    const {CARD_TYPE,RELATION_TYPE} = common
    const RELATION_TYPE_ARR =  Object.keys(RELATION_TYPE).map(key=> ({value:key,label:RELATION_TYPE[key]}))
    export default {
        name: 'patients-edit',
        mixins:[mixins.datePicker],
        components: {
            jdFormItemCard,
            jdSexTag,
            jdButton,
            card,
            linkIconBtn,
            jdFormItem,
            jdModal
        },
        data () {
            return {
                provinceShow:false,
                tabList: [{ name: '个人信息' }, { name: '就诊凭证' }],
                tabValue: 0,
                form: {

                },
                leftIconStyle: { color: '#ccc' },
                actionSheetCardOptions: CARD_TYPE,
                actionSheetRelationOptions: RELATION_TYPE_ARR,
                showGuardianForm:false,
                showAddressPicker:false,
                showNativePlacePicker:false,
                cardInfoList:[],
                outpatientId:'',
                endYear:this.$u.date(new Date().getTime(), 'yyyy'),
                opacity:0,
            }
        },
        onLoad (query) {
            this.outpatientId = query.outpatientId || ''
            this.userInfo = uni.getStorageSync('userInfo');
            this.initData(query)
        },
        onShow(){
            this.getCardList()
        },
        computed: {
            ...mapState(['orgCode']),
            cardTypeLabel(){
               if(this.form.certType){
                   let item = this.actionSheetCardOptions.find(item => item.value === this.form.certType) || {}
                   return item.label
               }
                else return CARD_TYPE[0].label
            },
            guardianLabel(){
                const str = '监护人'
                if(this.form.guardianCertType){
                    let item = this.actionSheetCardOptions.find(item => item.value === this.form.guardianCertType) || {}
                    return str +item.label
                }else {
                    return str + CARD_TYPE[0].label
                }
            },
            relationName(){
                if(this.form.relation){
                    let item = RELATION_TYPE_ARR.find(item => item.value === this.form.relation) || {}
                    return item.label
                }else {
                    return ''
                }
            }
        },
        methods: {
            addGuardianForm(){
                this.$set(this.form,'guardianCertType',CARD_TYPE[0].value)
            },
            initData(form){
                this.$nextTick(()=>{
                    this.tabValue = form.tabValue ? Number(form.tabValue) : 0
                    this.opacity = 1
                })
                const formSrc = ['name','certNo','certType','sex','relation','birthDate','nativePlace','mobileNo','location','detailAddress','guardianCertType','guardianCertNo','guardianName']
                for(let value of formSrc){
                    this.$set(this.form,value,form[value] || '')
                }

            },
            async getOutpatientInfo(outpatientId){
                const { outpatientList=[] } = await this.$api.outpatient_user_query({outpatientId})
                this.outpatientList = outpatientList

            },
            async getCardList(){
                let {cardInfoList = []} = await this.$api.user_card_query({
                    orgCode:this.orgCode,
                    outpatientId:this.outpatientId,
                    sensitiveEncFlag:0 // 不加密
                })
                // {
                //     cardForm:'广东省(市)卫生健康委员会',
                //       certNo: "09092332576",
                //   outpatientName:'李海',cardNo:'4401**********4424',
                //   cardType:'12',cardLogo:require('../../../static/img/home/card_logo.png'),
                //   des:'中华人民共和国国家卫生健康委员会监制'
                // },
                this.cardInfoList = Array.isArray(cardInfoList)&& cardInfoList.map(item=>({
                    cardForm:item.issuerName,
                    cardNo: item.cardNo,
                    cardType:item.cardType,
                    outpatientName:item.outpatientName,
                    outpatientId:item.outpatientId,
                    cardId:item.cardId,
                    orgCode:item.orgCode,
                }))
            },
            tabsChange (index) {
                this.tabValue = index
            },
            selectIdType (item,type) {
                this.$set(this.form,type,item.value)
            },
            async saveAction(){
                let params = {
                    outpatientId:this.outpatientId,
                    sensitiveEncFlag: 0,
                    ...this.form
                }
                const {result} = await this.$api.outpatient_info_update(params)
                this.$refs.jdModal._success({
                    title:`修改成功`,
                    confirmText:'返回',
                    success:async(res)=>{
                        if (res.confirm) {
                            uni.navigateBack({
                                delta:1
                            })
                        }
                    }
                })
            },
            async deleteAction(){
                this.$refs.jdModal._warning({
                    title:`删除就诊人`,
                    content:`删除<span class="primary">${this.form.name}</span>就诊人和卡信息`,
                    confirmText:'删除',
                    success:async(res)=>{
                        if (res.confirm) {
                            await this.$api.outpatient_info_remove({outpatientId:this.outpatientId})
                            setTimeout(()=>{
                                this.$refs.jdModal._success({
                                    title:`删除成功`,
                                    content:`已删除<span class="primary">${this.form.name}</span>就诊人和卡信息`,
                                    confirmText:'返回',
                                    success:async(res)=>{
                                        if (res.confirm) {
                                            uni.navigateBack({
                                                delta:1
                                            })
                                        }
                                    }
                                })
                            },1000)
                        }
                    }
                })
            },
            onAddressPicker(obj,type){
                let address = ''
                for(let key in obj){
                    let item = obj[key]
                    address += item.label
                }
                this.$set(this.form,type,address)
            },
            onChangeDate(val){
                this.defaultTime = this._filterTime(val)
                this.form['birthDate'] = this._filterTime(val)
            },
            showActionSheetRelation(){
                this.$refs.actionSheetRelation.toggleShow()
            }
        }
    }
</script>

<style scoped lang="scss">
    .patients-edit {
        @include border-1px();
        padding-bottom:50px;
        ::v-deep.u-form-item--left__content__icon {
            margin-right: 0;
        }


        .add-info {
            margin-top: 18px;
            margin-left: 10px;
        }

        .btn-control {
            @include border-1px();
            z-index: 1000;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }
</style>

<template>
    <view class="patients-bind form-common-wrapper">
        <u-form :model="form" ref="uForm" label-width="190">
            <jd-form-item-card is-margin>
                <jd-form-item label="就诊人" is-mask>
                    <u-input  v-model="query.name"/>
                </jd-form-item>
                <jd-form-item @onLabelChange="getPopupValue"
                              actionSheetTitle="选择卡类型"
                              :label="cardTypeLabel" :options="cardTypeOptions"
                              :itemRightIcon="isAddType ? 'arrow-down' : ''"
                              :actionSheetValue="form.cardType">
                    <u-input maxlength="25" :placeholder="`请在此输入${cardTypeLabel}`" focus v-model="form.cardNo"/>
                </jd-form-item>
            </jd-form-item-card>
        </u-form>
        <view class="tips-wrapper">
            <u-image width="100%" height="300" :src="imgHost + '/img/bind-qrcode.png'"></u-image>
            <view class="tips-alert">
                <u-icon name="error-circle-fill" color="#FF9C00"></u-icon>
                <text style="margin-left: 5px">红框内是登记号</text>
            </view>
        </view>
        <view style="padding:30px 18px" v-if="query.type">
            <jd-button @submit="btnAction" type="primary" size="lg" :disabled="!form.cardNo" :borderRadius="0">{{btnActionName}}</jd-button>
        </view>
        <view class="link-wrapper flex-r-center" v-if="isAddType">
            <u-link @onClick="noHasRegistrationAction" under-line>没有登记号？</u-link>
        </view>
        <jd-modal ref="jdModal" />
    </view>
</template>

<script>
    import jdFormItemCard from '@/customComponents/jd-form-item/card'
    import jdButton from '@/customComponents/jd-button'
    import jdFormItem from '@/customComponents/jd-form-item'
    import jdModal from '@/customComponents/jd-modal'
    import config from '@/config'
    import {getImgHost} from '@/utils'
    import { mapState } from 'vuex'
    const {common} = config

    const ADD = 'add'
    const cardTypeOptions = ()=>{
        let arr = []
        for(let key in common.CARD_TYPE_NAME){
            const label = common.CARD_TYPE_NAME[key]
            arr.push({label,value:key})
        }
        return arr
    }
    export default {
        name: 'patients-bind',
        components: {
            jdFormItemCard,
            jdButton,
            jdFormItem,
            jdModal
        },
        data () {
            return {
                form: {
                    cardType:cardTypeOptions()[0].value,
                    cardNo:'',
                },
                cardTypeOptions:cardTypeOptions(),
                query:{},
                imgHost:getImgHost()
            }
        },
        /**
         * type: edit(编辑卡),add(添加卡),
         * name: 姓名,
         * outpatientId: 就诊人ID，
         * cardNo:卡号 （type:edit状态下必填）
         * cardId:卡号 （type:edit状态下必填）
         * cardType:卡类型 （type:edit状态下必填）
         * */
        onLoad(query){
            this.query = query
            this.getInitData(query)
        },
        onShow(){

        },
        computed:{
            ...mapState(['orgCode']),
            cardTypeLabel(){
                if(this.form.cardType){
                    let item = cardTypeOptions().find(item => item.value === this.form.cardType) || {}
                    return item.label
                }
                else return cardTypeOptions()[0].label
            },
            btnActionName(){
                return this.query.type === ADD ? '绑定' : '保存'
            },
            isAddType(){
                return this.query.type === ADD
            }
        },
        methods:{
            getInitData(query ){
                this.query = query
                this.outpatientId = query.outpatientId
                if(!this.isAddType){
                    uni.setNavigationBarTitle({title:'我的就诊人'})
                    this.$set(this.form,'cardNo',query.cardNo)
                    this.$set(this.form,'cardType',query.cardType)
                }
            },
            getPopupValue(item){
                if(!this.isAddType) return
                this.$set(this.form,'cardType',item.value)
            },
            noHasRegistrationAction(){
                this.$u.route({
                    url:'/pages/archives/onlineFile/index',
                    params:{
                        outpatientId:this.outpatientId,
                        origin:'bind',
                    }
                })
            },
            btnAction(){
                if(this.isAddType) this.bindCard()
                else this.updateCard()
            },
            showLoading(){
                const {jdModal} = this.$refs
                jdModal._loading({
                    title:`患者信息验证`,
                    content:`正在验证患者信息，请稍等...`,
                    confirmText:'好的',
                })
            },
            async bindCard(){
                const {jdModal} = this.$refs

                try {
                    this.showLoading()
                    const {outpatientId} =this.query
                    await this.$api.user_card_bind({
                        sensitiveEncFlag:0,
                        orgCode:this.orgCode,
                        outpatientId,
                        ...this.form
                    },{isShowLoading:false})
                    jdModal.cancel()
                    jdModal._success({
                        title:`验证通过`,
                        content:`已成功绑定此${this.cardTypeLabel}`,
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
                    jdModal.cancel()
                }
            },
            async updateCard(){
                const {jdModal} = this.$refs
                try {
                    this.showLoading()
                    const {outpatientId,cardId} =this.query
                    await this.$api.user_card_update({
                        orgCode:this.orgCode,
                        outpatientId,
                        cardId,
                        sensitiveEncFlag:0,
                        ...this.form
                    })
                    jdModal.cancel()
                    jdModal._success({
                        title:`患者信息验证成功`,
                        content:`卡信息已更新`,
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

                }
            },
            async toVerifyCard(){

            }

        }
    }
</script>

<style scoped lang="scss">
    .tips-wrapper {
        background: $white;
        margin-top: 10px;
        padding: 30rpx;

        .tips-alert {
            margin-top: 10px;
            align-self: flex-start;
        }
        .link-wrapper{
            margin-top: 80px;
        }
    }
</style>

<template>
    <view>
        <u-form-item
                :prop="prop"
                @onItemClick="toggleShow" :label="label"
                :item-right-icon="itemRightIcon"
                :right-icon-style="leftIconStyle"
                :right-icon="rightIcon"
                :label-style="labelStyle"
                :left-icon-style="leftIconStyle">
                <jdFormMask v-if="isMask" @onClick="maskClick"></jdFormMask>
                <slot></slot>
        </u-form-item>
        <jd-action-sheet-popup-wrapper :title="actionSheetTitle" ref="jdActionSheetPopupWrapper" @onChange="onChange" :options="options" :current="actionSheetValue" />
    </view>

</template>

<script>

    import jdActionSheetPopupWrapper from '@/customComponents/jd-action-sheet-popup/select-type'
    import jdFormMask from '@/customComponents/jd-form-item/mask'
    export default {
        name: 'index',
        components:{jdActionSheetPopupWrapper,jdFormMask},
        props:{
            label:{
                type:String,
                default:''
            },
            options:{
                type:Array,
                default:()=>[]
            },
            actionSheetValue:{
                type:[String,Number],
                default:''
            },
            actionSheetTitle:{
                type:String,
                default:''
            },
            isItemRightAction:{
                type:Boolean,
                default:true
            },
            rightIcon:{
                type:String,
                default:''
            },
            itemRightIcon:{
                type:String,
                default:''
            },
            isMask:{
                type:Boolean,
                default:false
            },
            prop:{
                type:String,
                default:''
            },
            labelStyle:{
                type:Object,
                default:()=>({lineHeight:'40rpx'})
            }
        },
        data(){
            return{
                leftIconStyle:{ color: '#ccc' },
            }
        },
        methods:{
            onChange(item){
                this.$emit('onLabelChange',item)
                this.toggleShow()
            },
            toggleShow(){
                if(!this.itemRightIcon) return
                this.$refs.jdActionSheetPopupWrapper._toggleShow()
            },
            maskClick(){
                this.$emit('onMaskClick')
            }
        }
    }
</script>

<style scoped>

</style>

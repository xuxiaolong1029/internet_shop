<template>
        <u-popup :value="value" @close="close" @onPopupShow="onPopupShow" :mode="mode" :borderRadius="borderRadius">
            <view class="pay-popup-wrapper">
                <slot name="top"></slot>
                <slot name="middle"></slot>
                <view class="flex-r" :class="{'border-t':btnBorder}">
                        <jd-button style="flex: 1" v-if="showCancelBtn" @submit="cancel" :btnStyle="bgnStyle" size="lg" borderRadius="0">取消</jd-button>
                        <jd-button style="flex: 1" v-if="showConfirmBtn" @submit="btnSubmit" :btnStyle="bgnStyle" size="lg" borderRadius="0" type="primary">确认</jd-button>
                </view>
            </view>
        </u-popup>
</template>

<script>
    import jdButton from '@/customComponents/jd-button/index';
    export default {
        name: "jd-action-sheet-popup",
        components:{jdButton},
        props:{
            btnBorder:{
                type:Boolean,
                default:false
            },
            mode:{
                type:String,
                default:'bottom'
            },
            borderRadius:{
                type:[Number,String],
                default:20
            },
            value:{
              type:Boolean,
              default:false
            },
            showConfirmBtn:{
                type:Boolean,
                default:true
            },
            showCancelBtn:{
                type:Boolean,
                default:true
            },

        },
        data(){
            return{
                bgnStyle:{flex:1},
            }
        },
      watch:{

      },
      methods:{
            btnSubmit(){
                this.$emit('confirm')
            },
            onPopupShow(val){
                this.$emit('onPopupShow',val)
            },
            close(){
                this.$emit('input',false)
            },
            cancel(){
                this.$emit('input',false)
                this.$emit('cancel')
          }
        }
    }
</script>

<style scoped>
    .pay-popup-wrapper{
        background: #f5f5f5;
    }
</style>

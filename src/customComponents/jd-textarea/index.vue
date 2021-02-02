<template>
    <view class="textarea-wrapper">
        <u-input :value="value"
                 @input="onChange"
                 :maxlength="maxlength"
                 :placeholder="placeholder"
                 :custom-style="{background:'#f5f5f5',padding:20}"
                 height="140"
                 :disabled="disabled"
                 type="textarea" />
        <text class="text-num">{{`${value.length}/${maxlength}`}}</text>
    </view>

</template>

<script>
    export default {
        props:{
            value:{
                type:String,
                default:''
            },
            maxlength:{
                type:[Number,String],
                default:50
            },
            placeholder:{
                type:String,
                default:''
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{

            }
        },
        watch:{
            // value(val){
            //     if(val){
            //         this.$emit('input',val)
            //     }
            // }
        },
        methods: {
            onChange(val) {
                this.$emit('input',val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .textarea-wrapper{
        background: #f5f5f5;
        padding: 10rpx 10rpx 5rpx 20rpx;
        box-sizing: border-box;
        border-radius: 10rpx;
        margin-right: 40rpx;
        position: relative;
        flex: 1;
        .text-num{
            position: absolute;
            right: 20rpx;
            bottom: -5rpx;
            color: $text-color-grey;
        }
    }
</style>

<template>
    <jd-action-sheet-popup v-model="show"
                        ref="payTypePopup"
                        mode="bottom"
                        borderRadius="20"
                        :showConfirmBtn="false"
                        @confirm="confirm"
                        btnBorder z-index="998">
        <template v-slot:top>
            <view class="wrapper-title flex-r-s-center">{{title}}</view>
        </template>
        <template v-slot:middle>
            <view class="content">
                <scroll-view class="scroll-view" scroll-y="true">
                <u-cell-group>
                    <u-cell-item @click="cellClick(item)" :arrow="false"
                                 :title="item.label" v-for="(item, index) in options"
                                 :key="index" :title-style="{
							color: current == item.value ? activeColor : inactiveColor
						}">
                        <u-icon v-if="current == item.value" name="checkbox-mark" :color="activeColor"
                                size="32"></u-icon>
                    </u-cell-item>
                </u-cell-group>
                </scroll-view>
            </view>
        </template>
    </jd-action-sheet-popup>
</template>

<script>
    import jdActionSheetPopup from '@/customComponents/jd-action-sheet-popup'
    import jdFormItemCard from '@/customComponents/jd-form-item/card'
    import jdButton from '@/customComponents/jd-button/index'
    export default {
        name: 'jd-action-sheet-popup-wrapper',
        components: {
            jdFormItemCard,
            jdButton,
            jdActionSheetPopup
        },
        props:{
            title:{
                type:[String,Number],
                default:''
            },
            current:{
                type:[String,Number],
                default:1
            },
            options:{
                type:[Object,Array],
                default:()=>{}
            },
        },
        data () {
            return {
                show:false,
                activeColor: '#2979ff', // 激活时左边文字和右边对勾图标的颜色
                inactiveColor: '#606266' // 未激活时左边文字和右边对勾图标的颜色
            }
        },
        methods:{
            cellClick(item){
                this.$emit('onChange',item)
                this.$emit('input',false)
            },
            _toggleShow(){
                this.show = !this.show
            }
        }
    }
</script>

<style scoped lang="scss">

    .wrapper-title {
        height: 44px;
        padding-left: 30rpx;
        border-bottom: 1px solid $u-border-color;
        font-size: $font-s-lg;
        color: $text-color-grey;
        background: $white;
    }
    .content{
        margin-bottom: 15px;
        .scroll-view{
            height: 420rpx;
        }
    }
</style>

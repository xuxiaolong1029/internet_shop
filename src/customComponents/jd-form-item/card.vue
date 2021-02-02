<template>
    <view class="form-wrapper" :class="{'is-margin':isMargin}">
        <slot />
    </view>
</template>
<script>
  export default {
    name: 'jd-form-wrapper',
    props:{
      isMargin:{
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style lang="scss">
    .form-wrapper{
        padding-left: 40rpx;
        background: #fff;
        box-sizing: border-box;
        &.is-margin{
            margin-top: 10px;
        }
    }
</style>

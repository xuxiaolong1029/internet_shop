<template>
    <u-button
			class="jd-btn"
            :shape="shape"
            :custom-style="{...customStyle,...this.highlightStyle}"
            :disabled="disabled"
            :type="type"
            :size="size"
            @click="submit"
            :plain="plain"
            :loading="loading"
            ripple>
        <slot/>
    </u-button>
</template>

<script>
    /**
     *size: default    medium / mini:fontSize:28rpx;
     *type:default primary / success / info/ warning / error
     */
    export default {
        name:'jdButton',
        props: {
            type: {
                type: String,
                default: 'default'
            },
            size: {
                type: String,
                default: 'default'
            },
            shape: {
                type: String,
                default: 'square'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            btnStyle: {
                type: Object,
                default: () => {
                }
            },
            borderRadius:{
                type: [String,Number],
                default: '3px'
            },
            plain:{
                type: Boolean,
                default: false
            },
            loading:{
                type: Boolean,
                default: false
            },
              //文字高亮
              highlightType:{
                type: String,
                default: ''
              }
        },
        computed: {
            customStyle() {

                if (this.size === 'mini') {

                    return {
                        fontSize: '28rpx',
                        height: '55rpx',
						...this.btnStyle
                    }
                }
                if (this.size === 'lg') {
                    return {
                        fontSize: '32rpx',
                        height: '88rpx',
                        borderRadius: this.borderRadius,
						...this.btnStyle
                    }
                }
              return {
                    ...this.btnStyle,
                }
            },
            highlightStyle(){
              let obj = {
                primary:'#3071EA',
                success:'#12CE8A',
                warning:'#FF9C00',
                error:'#FF4949'
              }
            return this.highlightType ? {color:obj[this.highlightType]} : {}
            },

        },
        methods: {
            submit() {
                if(this.disabled) return
                this.$emit('submit')
            }
        }
    }
</script>

<style lang="scss">
	.u-btn--primary--plain{
		background-color: rgba(48, 113, 234, 0.1) !important;
	}

	/* #ifdef H5 */
	.u-hairline-border::after{
		border:none;
	}
	/* #endif */

</style>

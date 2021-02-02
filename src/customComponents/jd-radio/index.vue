<template>
    <u-radio-group @change="onChange" :value="value" icon-size="20">
        <u-radio :class="{'active':item.value === active}" v-for="(item, index) in radioList" :key="index"
                 :name="item.value" :disabled="item.disabled">
            {{ item.name }}
        </u-radio>
    </u-radio-group>
</template>

<script>
    export default {
        props:{
            value:{
                type:[Number,String,],
                default:''
            },
            radioList:{
                type:[Array],
                default:()=>[]
            },
            active:{
                type:[Number,String],
                default:''
            }
        },
        methods:{
            onChange(val){
                this.$emit('input',val)
            }
        }
    }
</script>

<style lang="scss">
</style>

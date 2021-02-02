<template>
    <view>
        <jd-result marginTop="100" :text='text'>
            <view class="res-card-no" v-if="placeholInfo.cardNo">{{placeholInfo.cardNo}}</view>
            <view class="res-org-name" v-if="isNotCardNo">{{orgName}}</view>
            <jd-button
                    shape="circle"
                    @submit="resultBtn"
                    :btn-style="{border:'1px solid #3071EA'}"
                    plain type="primary" size="mini" font-size="28">{{placeholInfo.btnName}}</jd-button>
        </jd-result>
        <jd-select-patients-list-wrapper @onHead="onHead">
            <jd-select-patients-list :notCardNoColor="notCardNoColor" :list="list" :current="current" @chooseList="chooseList" />
        </jd-select-patients-list-wrapper>
    </view>
</template>

<script>
    import jdButton from '@/customComponents/jd-button'
    import jdSelectPatientsListWrapper from '@/viewComponents/jd-select-patients-list/wrapper';
    import jdSelectPatientsList from '@/viewComponents/jd-select-patients-list';
    import jdResult from '@/customComponents/jd-result'

    export default {
        name: 'index',
        components:{jdButton,jdSelectPatientsListWrapper,jdSelectPatientsList,jdResult},
        props:{
            text:{
                type:String,
                default:''
            },
            placeholInfo:{
                type:Object,
                default:()=>{}
            },
            isNotCardNo:{
                type:Boolean,
                default:false
            },
            notCardNoColor:{
                type:String,
                default:''
            },
            list:{
                type:Array,
                default:()=>[]
            },
            current:{
                type:Number,
                default:0
            },
            orgName:{
                type:String,
                default:''
            }
        },
        computed:{

        },
        methods:{
            onHead(){
                this.$emit('onHead')
            },
            chooseList(item){
                this.$emit('chooseList',item)
            },
            resultBtn(){
                this.$emit('resultBtn')
            }
        }
    }
</script>

<style scoped lang="scss">
    .res-card-no{
        margin-top: -10px;
        color: $primary;
        margin-bottom: 10px;
    }
    .res-org-name{
        margin-bottom:15px ;
        color: $text-color-grey;
    }
</style>

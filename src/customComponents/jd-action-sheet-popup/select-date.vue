<template>
    <view class="query-date">
        <jd-action-sheet-popup v-model="show"
                               mode="top"
                               showConfirmBtn
                               :btnBorder="true"
                               borderRadius="0"
                               @confirm="btnSubmit"
                               @cancel="cancel"
                               btnBorder z-index="998">
            <template v-slot:top>
                <view class="top">
                    <view class="hub-t">查询时间</view>
                    <view @click="onRecentTime(item.value)" v-for="item in recentTimeData" :key="item.value" class="tap-w">
                        <u-tag  :type="recentTimeValue === item.value ? 'primary' : 'info'"
                                mode="plain" :text="item.label" />
                    </view>
                    <view class="date-scope flex-r-s-center">
                        <view @click="showCalendar('start')" class="date flex-r-s-center"
                              :class="{'has':!!start}">
                            {{start || '开始时间'}}
                        </view>
                        <text class="delimiter">/</text>
                        <view @click="showCalendar('end')" class="date flex-r-s-center"
                              :class="{'has':!!end}">
                            {{end || '结束时间'}}
                        </view>
                    </view>
                </view>
            </template>
        </jd-action-sheet-popup>
        <uni-calendar
                ref="startCalendar"
                :insert="false"
                :clearDate="false"
                :startDate="defaultStartDate"
                :endDate="defaultEndDate"
                @confirm="onCalendar($event,'start')"
        />

        <uni-calendar
                ref="endCalendar"
                :insert="false"
                :clearDate="false"
                :startDate="defaultStartDate"
                :endDate="defaultEndDate"
                @confirm="onCalendar($event,'end')"
        />
    </view>
</template>

<script>
    /**
     * 选择日期组件 确认返回的数据结构
     * {value:1,label:'最近1个月',[START]:last1Month.last,[END]:last3Month.now}
     * 其中value label 不返回的情况下表示自定义时间 start与end必返回
     */
    import jdActionSheetPopup from '@/customComponents/jd-action-sheet-popup'
    import mixins from '@/mixins'
    import { getLast1Month,getLast3Month,getLast6Month } from '@/utils'
    const last1Month = getLast1Month()
    const last3Month = getLast3Month()
    const last6Month = getLast6Month()

    const START = 'start',END = 'end'
    export default {
        name: 'query-date',
        mixins:[mixins.datePicker],
        components:{jdActionSheetPopup},
        props:{
            recentTimeData:{
                type:Array,
                default:()=>[
                    {value:1,label:'最近1个月',[START]:last1Month.last,[END]:last3Month.now},
                    {value:3,label:'最近3个月',[START]:last3Month.last,[END]:last3Month.now},
                    {value:6,label:'最近6个月',[START]:last6Month.last,[END]:last3Month.now},
                ]
            },
            currentTimeDate:{
                type:Object,
                default:()=>{
                    return {
                        value:3
                    }
                },
            }
        },
        data(){
            return{
                show:false,
                recentTimeValue:3,
                showDatePicker:false,
                defaultStartDate: last6Month.last,
                defaultEndDate: last6Month.now,
                [START]:'',
                [END]:'',
            }
        },
        watch:{
            currentTimeDate:{
                handler:function(obj) {
                    if(obj.value){
                        this.recentTimeValue = obj.value;
                    }else {
                        this[START] = obj[START]
                        this[END] = obj[END]
                    }
                },
                deep:true,
                immediate:true
            },
        },
        computed:{
            // defaultEndDate(){
            //
            // }
        },
        created () {

        },
        methods:{
            onRecentTime(value){
                this.recentTimeValue = value;
                this[START] = ''
                this[END] = ''
            },
            showCalendar(type){
                this.type = type
                this.$refs[`${type}Calendar`].open();
            },
            onCalendar(event,type){
                if(type === START){
                    this[START] = event.fulldate
                }else {
                    this[END] = event.fulldate
                }
                if(event.fulldate){
                    this.recentTimeValue = ''
                }
            },
            setDate({start='',end=''}){
                // if(start) this.$set(this.dateObj,START,start)
                // else this.$set(this.dateObj,END,end)
                this.$set(this.dateObj,START,start)
                this.$set(this.dateObj,END,end)
            },
            btnSubmit(){
                let item = null
                if(this.recentTimeValue){
                    item = this.recentTimeData.find(item => item.value === this.recentTimeValue) || {}
                }else {
                    const start = new Date(this[START]).getTime()
                    const end = new Date(this[END]).getTime()
                    if(end <start){
                        uni.showModal({
                            title:'温馨提示',
                            content:'选择的日期开始时间需小于结束时间',
                            showCancel:false,
                        })
                        return
                    }
                    item = {[START]:this[START],[END]:this[END]}
                }
                this.$emit('confirm',item)
                this._toggleShow()
            },
            _toggleShow(){
                this.show = !this.show
            },
            cancel(){
                if(this.currentTimeDate.value){
                    this.recentTimeValue = this.currentTimeDate.value;
                        this[START] = ''
                        this[END] = ''
                }else {
                    this.recentTimeValue = ''
                    this[START] = this.currentTimeDate[START]
                    this[END] = this.currentTimeDate[END]
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .query-date{

        ::v-deep .u-size-default{
            font-size: $font-s-base!important;
            padding: 10px;
        }

        .top{
            border-top: 1px solid #E3E3E3;
            padding:30rpx;
            box-sizing: border-box;
            .hub-t{
                color: $text-color-grey;
                margin-bottom: 15px;
            }
            .tap-w{
                display: inline-block;
                margin-right:20rpx;
            }


            .date-scope{
                margin-top: 15px;
                .date{
                    color: $text-color-grey;
                    padding-left: 20rpx;
                    background: #FFFFFF;
                    border: 1px solid #D9D9D9;
                    box-sizing: border-box;
                    border-radius: 1px;
                    width: 310rpx;
                    height: 69rpx;
                    &.has{
                        color: $text-color;
                    }
                }
                .delimiter{
                    margin: 0 20rpx;
                }
            }
        }

    }

</style>

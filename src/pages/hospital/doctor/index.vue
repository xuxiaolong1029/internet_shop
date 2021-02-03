<template>
    <view class="doctor set-bg-com"
          :class="{'no-scroll':onDropdownShow}"
          :style="{backgroundImage: `url(${bgUrl})`}"
    >
        <u-card :show-head="false" :head-border-bottom="false" border-radius="20" :border="false" :body-style="bodyStyle">
            <view slot="body">
                <view class="search-wrapper">
                    <u-search shape="square" search-icon-color="#BBBBBB" placeholder-color="#BBBBBB" :show-action="false" placeholder="搜索医生姓名" :inputStyle="{marginLeft:-2}" v-model="searchKey" @search="getDoctorList" @clear="clear" />
                </view>
                <view class="dropdown-w">
                    <u-dropdown @open="onDropdownOpen" @close="onDropdownClose" border-bottom title-size="32" height="88">
                        <u-dropdown-item v-model="deptValue" @change="getDoctorList" height="500" :title="deptTitle" :options="deptOptions" />
                        <u-dropdown-item v-model="dictValue" @change="getDoctorList" :title="dictTitle" :options="dictOptions" />
                    </u-dropdown>
                </view>

                <view class="doctor-wrapper">
                    <doctor-item :docList="docList" />
                </view>
            </view>
        </u-card>
    </view>
</template>

<script>
    import doctorItem from '../components/doctor-item'
    import mixinsBgUrl from '../mixins/bgUrl'
    import {debounce} from '@/utils'
    import { mapState } from 'vuex'
    const deptOptionsInit = {}
    export default {
        name: 'hospital',
        mixins:[mixinsBgUrl],
        components:{doctorItem},
        data(){
            return{
                bodyStyle:{paddingRight:0,paddingLeft:0},
                searchKey:'',
                docList:[],
                deptValue: '',
                dictValue: '',
                deptOptions: [],
                dictOptions: [],
                onDropdownShow:false,
                // scrollTop:0,
            }
        },
        onLoad(){
            this.getDoctorList()
            this.getDeptData()
            this.getDict()
        },
        computed:{
            ...mapState(['orgCode']),
            deptTitle(){
                if(this.deptOptions.length){
                    let item = this.deptOptions.find(item => item.value === this.deptValue) || {}
                    return item.label
                }else {
                    return '全部科室'
                }
            },
            dictTitle(){
                if(this.dictOptions.length){
                    let item = this.dictOptions.find(item => item.value === this.dictValue) || {}
                    return item.label
                }else {
                    return '全部职称'
                }
            },

        },
        watch:{
            searchKey:{
                handler:debounce(function (val) {
                    if(val){
                        this.getDoctorList()
                    }else {
                        this.clear()
                    }
                },800)
            }
        },
        // onPageScroll(e){
        //     this.pageY = e.scrollTop
        // },
        methods:{
            async getDoctorList(){
                const {result={}} = await this.$api.basedata_orgemp_page_list({
                    orgCode:this.orgCode,
                    searchKey:this.searchKey,
                    deptCode:this.deptValue, // 部门
                    title:this.dictValue, // 职称
                    isExpert:1, // 员工类型（1.医生）
                    empType:1, // 是否专家 0 否 1是
                    pageNo:1,
                    pageSize:500,
                })
                this.docList = result.records || []
            },
            async getDeptData(){
                const {result=[]} = await this.$api.basedata_orgdept_list({
                    orgCode:this.orgCode,
                    recommend:1,
                    // level:2
                })
                this.deptOptions = result.reduce((acc,item)=>{
                    return [...acc,{ label:item.deptName, value:item.deptCode}]
                },[{label:'全部科室',value:''}])
            },
            async getDict(){
                const {result=[]} = await this.$api.basedata_sysdict_dict({
                    dictTypeId:13,// 人员职称类
                })

                this.dictOptions = result.reduce((acc,item)=>{
                    return [...acc,{ label:item.dictValue, value:item.dictKey}]
                },[{label:'全部职称',value:''}])
            },
            onDropdownOpen(){
                this.onDropdownShow = true
                this.scrollTop = this.pageY
            },
            onDropdownClose(){
                this.onDropdownShow = false
            },
            clear(){
                this.docList=[]
            },
            moveHandle(e){
                return false
            }
        }
    }
</script>

<style scoped lang="scss">
    .doctor{
        &.no-scroll{
                height: 100vh;
                overflow: hidden;
        }
    }
    .search-wrapper{
        padding:0 20rpx;
        background: $white;
    }
    .dropdown-w{
        ::v-deep.u-dropdown__content__mask{
            /*background: transparent;*/
        }
    }
    .doctor-wrapper{
        padding: 0 30px;
        padding-top: 20px;
        min-height: 400px;
    }
</style>

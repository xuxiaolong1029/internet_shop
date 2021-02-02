const LOADING_STATUS = 'loading'
export default {
    data(){
        return{
            pageNo:1,
            pageSize:15,
            loadmoreStatus:'',
            isReachBottom:true,
            list: [],
            apiListName:'',
        }
    },
    onReachBottom() {
        if (this.isReachBottom) {
            if( this.loadmoreStatus===LOADING_STATUS) return
            this.getList(true)
        }else {
            this.loadmoreStatus = 'nomore'
        }
    },
    methods:{
        async getList(isReach) {
            if(isReach) this.loadmoreStatus=LOADING_STATUS
            let {result: {records=[]}} = await this.$api[this.apiListName]({
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                ...this.getListParams
            },{isShowLoading:this.loadmoreStatus!==LOADING_STATUS})
            // 更换机构编码重新赋值做请求
            // orgCode = this.orgCode
            this.isReachBottom = records.length === this.pageSize
            records = this._filterList(records)
            if (this.list.length > 0 && isReach && this.pageNo !==1) {
                this.loadmoreStatus=""
                this.list = [...this.list, ...records]
            } else {
                this.list = records;
            }
            this.pageNo++
        },
        initListParams(){
            this.loadmoreStatus = ''
            this.pageNo=1
        },
    },

}

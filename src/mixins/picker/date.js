const getTimestamp = ()=> new Date().getTime()

export default {
    data(){
        return{
            defaultTime:this.$u.timeFormat(getTimestamp(), 'yyyy/mm/dd'),
            showDatePicker:false,
            // setPickerDate:''
        }
    },
    /*
    watch:{
        showDatePicker(val){
            if(val){
                this.$nextTick(()=>{
                    this.defaultTime = this.getDefaultTime()
                })
            }
        }
    },
    */
    methods:{
        /*
        getDefaultTime(){
            return this.setPickerDate || this.defaultTime
        },*/
        _filterTime(val,type='/'){
            return `${val.year}${type}${val.month}${type}${val.day}`
        },
    },
}

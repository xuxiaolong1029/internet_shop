export default {
    data(){
        return{
            bgUrl:''
        }
    },
    created(){
        this.getHospitalBgUrl()
    },
    methods: {
        getHospitalBgUrl () {
            uni.getStorage({
                key: 'hospital_info',
                success: (res) => {
                    if (res.data) this.bgUrl = res.data.imgUrl
                }
            })
        },
    }
}

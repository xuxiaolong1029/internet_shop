
export default {
    data() {
        const phoneRules = this.$u.deepClone([
            {required: true,message: '选择输入手机号', trigger: 'blur'},
            {
                validator: (rule, value) => this.$u.test.mobile(value),
                message: '请输入正确的手机号',
                trigger: ['change','blur'],
            }
        ])
        return {
            rules: {
                mobile: phoneRules,
            }
        }
    }

}


import utils from '@/utils/util.js'

export const threeNumDeal = (data) => {
    if (!data) return 0
    // 将数据处理成 1,000,000这种形式
    let result
    if (/\./.test(String(data))) {
    // 有小数
        result = Number(data).toFixed(2)
    } else {
    // 无小数
        result = data
    }
    const arr = String(result).split('.')
    const integer = arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return integer + (arr[1] ? '.' + arr[1] : '')
}

export const buildNum = (val, precision, multiply) => {
    return utils.buildNum(val, precision, multiply)
}

export const moneyFormat = (value, str = '￥') => {
    // str  规定 货币类型
    if (!value) return str + '0.00'
    var value = Number(value).toFixed(2)// 提前保留两位小数
    const intPart = Number(value).toFixed(0) // 获取整数部分
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断 ？？？
    let floatPart = '.00' // 预定义小数部分
    value = value.toString()// 将number类型转为字符串类型，方便操作
    const value2Array = value.split('.')
    if (value2Array.length === 2) { // =2表示数据有小数位
        floatPart = value2Array[1].toString() // 拿到小数部分
        if (floatPart.length === 1) { // 补0,实际上用不着
            return str + intPartFormat + '.' + floatPart + '0'
        } else {
            return str + intPartFormat + '.' + floatPart
        }
    } else {
        return str + intPartFormat + floatPart
    }
}

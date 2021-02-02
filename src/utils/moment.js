export const getTimestamp = ()=> new Date().getTime()
/**
 * 最近一个月时间范围
 */
export const getLast1Month = ()=> {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();
    var dateObj = {};
    dateObj.now = year + '-' + month + '-' + day;
    var nowMonthDay = new Date(year, month, 0).getDate();    //当前月的总天数
    if(month - 1 <= 0){ //如果是1月，年数往前推一年<br>　　　　
        dateObj.last = (year - 1) + '-' + 12 + '-' + day;
    }else{
        var lastMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();
        if(lastMonthDay < day){    //1个月前所在月的总天数小于现在的天日期
            if(day < nowMonthDay){        //当前天日期小于当前月总天数
                dateObj.last = year + '-' + (month - 1) + '-' + (lastMonthDay - (nowMonthDay - day));
            }else{
                dateObj.last = year + '-' + (month - 1) + '-' + lastMonthDay;
            }
        }else{
            dateObj.last = year + '-' + (month - 1) + '-' + day;
        }
    }
    return dateObj
}
/**
 * 最近三个月时间范围
 */
export const getLast3Month =()=> {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();
    var dateObj = {};
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    if (parseInt(day) < 10) {
        day = "0" + day;
    }

    dateObj.now = year + '-' + month + '-' + day;

    if (parseInt(month) == 1) {//如果是1月份，则取上一年的10月份
        dateObj.last = (parseInt(year) - 1) + '-10-' + day;
        return dateObj;
    }
    if (parseInt(month) == 2) {//如果是2月份，则取上一年的11月份
        dateObj.last = (parseInt(year) - 1) + '-11-' + day;
        return dateObj;
    }
    if (parseInt(month) == 3) {//如果是3月份，则取上一年的12月份
        dateObj.last = (parseInt(year) - 1) + '-12-' + day;
        return dateObj;
    }

    var preSize = new Date(year, parseInt(month) - 3, 0).getDate();//开始时间所在月的总天数
    if (preSize < parseInt(day)) {
        // 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
        let resultMonth = parseInt(month) - 2 < 10 ? ('0' + parseInt(month) - 2) : (parseInt(month) - 2);
        dateObj.last = year + '-' + resultMonth + '-01';
        return dateObj;
    }

    if (parseInt(month) <= 10) {
        dateObj.last = year + '-0' + (parseInt(month) - 3) + '-' + day;
        return dateObj;
    } else {
        dateObj.last = year + '-' + (parseInt(month) - 3) + '-' + day;
        return dateObj;
    }
}

/**
 * 最近半年时间
 * @returns {{last:开始时间；now：结束时间}}
 */
export const getLast6Month = ()=>{
    var now = new Date();
    var year = now.getFullYear();
    //0-11表示1-12月
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var dateObj = {};
    dateObj.now = year + '-' + month + '-' + day;
    //当前月的总天数
    var nowMonthDay = new Date(year, month, 0).getDate();
    //如果是1、2、3,4,5,6月，年数往前推一年
    if(month - 6 <= 0){
        //6个月前所在月的总天数
        var last3MonthDay = new Date((year - 1), (12 - (6 - parseInt(month))), 0).getDate();
        //6个月前所在月的总天数小于现在的天日期
        if(last3MonthDay < day){
            dateObj.last = (year - 1) + '-' + (12 - (6 - month)) + '-' + last3MonthDay;
        }else{
            dateObj.last = (year - 1) + '-' + (12 - (6 - month)) + '-' + day;
        }
    }else{
        //6个月前所在月的总天数
        var last3MonthDay = new Date(year, (parseInt(month) - 6), 0).getDate();
        //6个月前所在月的总天数小于现在的天日期
        if(last3MonthDay < day){
            //当前天日期小于当前月总天数,2月份比较特殊的月份
            if(day < nowMonthDay){
                dateObj.last = year + '-' + (month - 6) + '-' + (last3MonthDay - (nowMonthDay - day));
            }else{
                dateObj.last = year + '-' + (month - 6) + '-' + last3MonthDay;
            }
        }else{
            dateObj.last = year + '-' + (month - 6) + '-' + day;
        }
    }

    return dateObj

}

/**
 * 日期格式化
 * @returns {{fmt:日期格式（YYYY-mm-dd HH:MM:SS）；date：要转换的日期对象}}
 */
export const dateFormat = (fmt, date)=>{
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

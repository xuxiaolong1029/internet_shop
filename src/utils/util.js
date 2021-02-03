

/**
 * 判断JSON
 * */
export const isJSON=(str) =>{
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            return false;
        }
    }
}
/**
 * JSON转对象
 * */
export const filterJSON = (item)=>{
    if(isJSON(item) && !!item){
        return JSON.parse(item);
    } else {
        return item
    }
}
/**
 * 点击防抖
 * */
export const throttle = (func, delay) => {
    let prev = Date.now();
    return function () {
        const context = this;
        const args = arguments;
        const now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }
}
/**
 * 字符串截取
 * */
export const substrFn =  (value,length =10)=> {
    if(value&& value.length > length) {
        value= value.substring(0,length)+ '...';
    }
    return value;
}
/**
 * 截流
 * */
export const debounce = (fn, delay, scope) => {
    let timer = null;
    return function () {
        let context = scope || this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

/**
 * 根据传入字段分组
 * */
export const groupBy = (objectArray, property) => {
	return objectArray.reduce(function (acc, obj) {
		let key = obj[property]
		if (!acc[key]) {
			acc[key] = []
		}
		acc[key].push(obj)
		return acc
	}, {})
}

/**
 * 获得时间差
 * */
export const timeDifference = (date, startDate) => {
	if (!(date instanceof Date))
	    return undefined;
	//先获得开始时间
	let nowDate = startDate || new Date()
	//计算时间差
	let timeDis = date - nowDate * 1
	let millisDay = 1000 * 60 * 60 * 24
	return Math.ceil(timeDis / millisDay);
}
/**
 * 金额格式化
 * */
export const fmoney = (num) => {
	if(num){
		let amount = num.split('.')[0]
		if(amount && amount.length >= 4){
		  amount = amount.split('')
		  amount.splice(-3,0,',')
		  amount = amount.join('')
		  let ss = num.split('.')[1] || ''
		  ss = ss!=''?'.'+ss:''
		  return amount +ss
		}else {
		  return num
		}
	}
	 return ''
}

export const timestampToTime = (timestamp,length,link='/')=>{
    if(!timestamp) return '';
    let date = new Date(timestamp);
    let Y = date.getFullYear() + link;
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + link;
    let D = date.getDate()<10?'0'+date.getDate():date.getDate();
    let h = (date.getHours()<10?'0'+date.getHours():date.getHours())+':';
    let m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+':';
    let s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    return length?(Y+M+D+' '+h+m+s).substr(0,length):Y+M+D+' '+h+m+s
}

/**
 * 过滤字符串两边空格
 * @param str
 * @returns {string}
 */
export const trim = (str='')=>{
    try {
        str = `${str}`
        let type = typeof str
        let result = str.replace(/(^\s*)|(\s*$)/g, "")
        return type === 'string' ? result : type === 'number' ? Number(str) : str
    }catch (e) {
       return str
    }
}

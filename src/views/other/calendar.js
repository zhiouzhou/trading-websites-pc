//2018-12-21 14:31:00 == >   2018-12-21
export const formatDateyymmss = function(time){

    time = new Date(time);
    const year = time.getFullYear();//2018
    const month = time.getMonth()+1;//12
    const day = time.getDate();//21

    var y = year;
    var m = month;
    if (m < 10) m = "0" + m;
    var d = day;
    if (d < 10) d = "0" + d;
    return y + "-" + m + "-" + d;
}


export const formatDate = function(year, month, day){
    var y = year;
    var m = month;
    if (m < 10) m = "0" + m;
    var d = day;
    if (d < 10) d = "0" + d;
    return y + "-" + m + "-" + d;
}
export const calculateMonthDays = function(currentYear, month){
    let monthDays = 30;
    switch (month) {
        case 1 :
            monthDays = 31;
            break;
        case 3 :
            monthDays = 31;
            break;
        case 5 :
            monthDays = 31;
            break;
        case 7 :
            monthDays = 31;
            break;
        case 8 :
            monthDays = 31;
            break;
        case 10 :
            monthDays = 31;
            break;
        case 12 :
            monthDays = 31;
            break;
        case 2 :
            if (currentYear % 4 == 0) {
                monthDays = 29;
            } else {
                monthDays = 28;
            }
            break;
        default :
            monthDays = 30;
            break;
    }
    return monthDays
}
export  const initCalendar = function(cur){
    let now = new Date();
    let Days = [];
    if(cur){
        now = new Date(cur);
    }
    const currentYear = now.getFullYear();//2018
    const currentMonth = now.getMonth()+1;//12
    const currentDate = now.getDate();//21
    const currentWeek = now.getDay();//5
    //本月第一天
    const firstDay = formatDate(currentYear,currentMonth, 1)
    //本月第一天是周几
    const firstWeek = new Date(firstDay).getDay();
    //本月共多少天
    const  monthDays = calculateMonthDays(currentYear, currentMonth)
    //本月最后一天
    const lastDay = formatDate(currentYear, currentMonth, monthDays)
    //本月最后一天是周几
    const lastWeek = new Date(lastDay).getDay();
    //计算上个月落在当前calendar的days 
    for(var i = firstWeek; i > 0; i--){
        var o = {};
        var d = new Date(firstDay)
        d.setDate(d.getDate() - i)
        o.date = d //Sat Dec 15 2018 16:33:02 GMT+0800 (中国标准时间)
        o.day = d.getDate()
        Days.push(o)
    }
    // 计算当前月落在当前calendar的days 
    for (var i = 0; i < monthDays; i++) {//monthDays为本月总天数 
        var o = {};
        var d = new Date(firstDay);
        d.setDate(d.getDate() + i);
        o.date = d;
        o.day = d.getDate()
        o.current = true;
        Days.push(o);
    }
    // 计算下个月落在当前calendar的days 
    for (var i = 1; i <= 6 - lastWeek; i++) {
        var o = {};
        var d = new Date(lastDay);
        d.setDate(d.getDate() + i);
        o.date = d
        o.day = d.getDate()
        Days.push(o);
    }
    return Days;
}
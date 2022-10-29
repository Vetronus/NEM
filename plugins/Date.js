function fromTime(dateTime) {
    let date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
}

function addDate(dateTime, days){
    let date = new Date(dateTime);
    let years = Math.floor(days/365);
    days = Math.max(0, (days-(365*years)));
    let months = Math.floor(days/30);
    days = Math.max(0, (days-(30*months)));
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return fromTime(date);
}

function today(){
    return fromTime(new Date());
}

function todayPlus(days){
    return addDate(today(), days);
}

function todayMinus(days){
    return addDate(today(), (days*-1));
}

function todayPlusWeeks(weeks){
    return addDate(today(), (weeks*7));
}

function todayPlusMonths(months){
    return addDate(today(), (months*30));
}

function todayPlusYears(years){
    return addDate(today(), (years*365));
}

function addWeeks(dateTime, weeks){
    return addDate(dateTime, (weeks*7));
}

function addMonths(dateTime, months){
    return addDate(dateTime, (months*30));
}

function addYears(dateTime, years){
    return addDate(dateTime, (years*365));
}



module.exports = {fromTime, addDate, today, todayPlus, todayMinus, todayPlusWeeks, todayPlusMonths, todayPlusYears, addWeeks, addMonths, addYears};
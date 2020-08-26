export default function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' detik yang lalu';   
    }else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' menit yang lalu';   
    }else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' jam yang lalu';   
    }else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' hari yang lalu';   
    }else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' bulan yang lalu';   
    }else {
        return Math.round(elapsed/msPerYear ) + ' tahun yang lalu';   
    }
}
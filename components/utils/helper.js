export const curdate = () => {
	var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   

    var dateTime = year+''+month+''+day; //+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

export const titleCase = (string) => {
    var splitStr = string.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
           // You do not need to check if i is larger than splitStr length, as your for does that for you
           // Assign it back to the array
           splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
       // Directly return the joined string
    return splitStr.join(' '); 
}

//conver yyyy-mm-dd to dd/mm/yyyy
export const convertDate = (date) => {
    const values = date.split('-');
    const year = values[0];
    const month = values[1];
    const day = values[2];
    return `${day}/${month}/${year}`;
}

export const convertDataFromRek = (string) => {
    const res = string.split('|');
    console.log(string);
    const result = {
        nmLengkap: res[0],
        nmPanggilan: res[1],
        gender: res[2],
        jenisIdentitas: res[3],
        nomorIdentitas: res[4],
        masaLaku: res[5],
        alamat: res[6],
        rt: res[7],
        rw: res[8],
        kelurahan: res[9],
        kec: res[10],
        kab: res[11],
        prov: res[12],
        kodePos: res[13],
        motherName: res[14],
        noHp: res[15],
        email: res[16]
    };

    return result;
}
import { SUCCESS_ORDER, GET_ORDER, FETCH_DETAIL_ORDER } from "../types";
import api from "../components/api";
import apiBaru from "../components/apiBaru";

//dataorder 
// QOB122299: {
//	 idorder: QOB122299,
// 	 jeniskiriman: '',
//   namapenerima: '',
// 	 namapengirim: '',
//   tanggal: ''
// }

export const oderIsAdded = (id, dataorder) => ({
	type: SUCCESS_ORDER,
	dataorder,
	id
})

export const orderAdded = (id, dataorder) => dispatch => dispatch(oderIsAdded(id, dataorder))

export const orderFetched = (response, tanggal) => ({
	type: GET_ORDER,
	response,
	tanggal
})

export const getOrder = (payload, tanggal) => dispatch => 
	api.qob.listOrder(payload)
		.then(res => dispatch(orderFetched(res, tanggal)))

export const detailFetched = (other, pickup, daterange) => ({
	type: FETCH_DETAIL_ORDER,
	other,
	pickup,
	daterange
})

export const getDetailOrder = (payload) => dispatch => 
	apiBaru.qob.getDetailOrder(payload)
		.then(res => {
			const daterange = `${convertDate(payload.startdate)}-${convertDate(payload.enddate)}`;
			const { data } 	= res;
			const pickup 	= data.filter(x => x.status_terakhir === 'Order');
			const other 	= data.filter(x => x.status_terakhir !== 'Order');
			dispatch(detailFetched(other, pickup, daterange))
		})

export const convertDate = (date) => {
	var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('/');
}
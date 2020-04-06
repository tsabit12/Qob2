import { SUCCESS_ORDER, GET_ORDER, FETCH_DETAIL_ORDER, PICKUP_SUKSES } from "../types";
import api from "../components/api";
import apiBaru from "../components/apiBaru";
import apiWs from "../components/apiWs";
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

export const detailFetched = (other, pickup, date) => ({
	type: FETCH_DETAIL_ORDER,
	other,
	pickup,
	date
})

export const getDetailOrder = (payload) => dispatch => 
	apiBaru.qob.getDetailOrder(payload)
		.then(res => {
			// const daterange = convertDate(payload.startdate);
			const { data } 	= res;
			const pickup 	= data.filter(x => x.laststatus === 'Order');
			// const other 	= data.filter(x => x.laststatus !== 'Order');
			dispatch(detailFetched(data, pickup, convertDate(payload.startdate)))
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

export const suksesPickup = (response, newState, date) => ({
	type: PICKUP_SUKSES,
	pickupNumber: response.pickup_number,
	listPickup: newState,
	date
})

export const addPickupBaru = (payload, date, newState) => dispatch => 
	apiWs.qob.addPickup(payload)
		.then(res => {
			dispatch(suksesPickup(res, newState, date));
		})
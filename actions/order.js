import { SUCCESS_ORDER, GET_ORDER } from "../types";
import api from "../components/api";

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
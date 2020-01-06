import { SUCCESS_ORDER } from "../types";

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
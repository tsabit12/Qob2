import api from "../components/api";
import { GET_REKENING } from "../types";

export const rekeningFetched = (res, rekening) => ({
	type: GET_REKENING,
	rekening,
	res
}) 

export const getRekening = (rek) => dispatch => 
	api.search.rekening(rek)
		.then(res => {
			const { response_data1 } = res;
			const values = response_data1.split('|');
			// const initialBalance = values[0].split(':');
			// const finalBalance = values[1].split(':');
			// const valTransaction = values[2].replace('Transaksi : ', '');
			// const transaction = valTransaction.split('~');
			// const toObj = {
			// 	initialBalance: initialBalance[1].replace(/ /g, ''),
			// 	finalBalance: finalBalance[1].replace(/ /g, ''),
			// 	transaction: transaction
			// }
			dispatch(rekeningFetched(values, rek))
			// console.log(toObj);
		})
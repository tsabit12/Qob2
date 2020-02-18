import api from "../components/api";
import { GET_REKENING, REMOVE_REKENING, GET_TRACE, REMOVE_HISTORY_LACAK, LACAK_HAS_ERROR, REMOVE_HAS_ERROR } from "../types";

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
			dispatch(rekeningFetched(values, rek))
		})

export const removed = (rek) => ({
	type: REMOVE_REKENING,
	rek
})

export const removeRek = (keyShouldRemove) => dispatch => {
	dispatch(removed(keyShouldRemove));
	// return Promise.resolve(keyShouldRemove);	
}

export const getDataKiriman = (res, extId) => ({
	type: GET_TRACE,
	result: res,
	extId
})

export const lacakHasError = (err) => ({
	type: LACAK_HAS_ERROR,
	err
})

export const lacakKiriman = (extId) => dispatch => 
	api.qob.lacakKiriman(extId)
		.then(res => dispatch(getDataKiriman(res, extId)))
		.catch(err => dispatch(lacakHasError(err)))

export const removeHistoryLacak = (extId) => dispatch => {
	dispatch({
		type: REMOVE_HISTORY_LACAK,
		extId
	})
}

export const removeErrors = () => dispatch => dispatch({
	type: REMOVE_HAS_ERROR
})
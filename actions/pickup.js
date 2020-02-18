import apiWs from "../components/apiWs";
import { GET_ADD_POSTING, PICKUP_SUKSES, FETCH_HISTORY_PICKUP } from "../types";

export const addPostingFetched = (result) => ({
	type: GET_ADD_POSTING,
	result
})

export const suksesPickup = (result, newState) => ({
	type: PICKUP_SUKSES,
	pickupNumber: result.pickup_number,
	listPickup: newState
}) 

export const getAddPosting = (userid) => dispatch =>
	apiWs.fetch.getAddPosting(userid)
		.then(res => dispatch(addPostingFetched(res.result)))

export const addPickup = (payload, newState) => dispatch => 
	apiWs.qob.addPickup(payload)
		.then(res => {
			console.log(res);
			dispatch(suksesPickup(res, newState));
		})

export const historyFetched = (result) => ({
	type: FETCH_HISTORY_PICKUP,
	result
})

export const fetchHistoryPickup = (userid) => dispatch =>
	apiWs.fetch.getHistoryPickup(userid)
		.then(res => {
			dispatch(historyFetched(res.result))
		})
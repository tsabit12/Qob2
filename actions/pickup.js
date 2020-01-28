import apiWs from "../components/apiWs";
import { GET_ADD_POSTING } from "../types";

export const addPostingFetched = (result) => ({
	type: GET_ADD_POSTING,
	result
})

export const getAddPosting = (userid) => dispatch =>
	apiWs.fetch.getAddPosting(userid)
		.then(res => dispatch(addPostingFetched(res.result)))

export const addPickup = (payload) => dispatch => 
	apiWs.qob.addPickup(payload)
		.then(res => {
			console.log(res);
		})
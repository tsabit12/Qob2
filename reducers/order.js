import { SUCCESS_ORDER, GET_ORDER, GET_ADD_POSTING } from "../types";

const initialState = {
	dataOrder: {},
	searchParam: null,
	listPickup: []
}

export default function order(state=initialState, action={}){
	switch(action.type){
		case GET_ORDER:
			return{
				...state,
				dataOrder: {
					...state.dataOrder,
					[action.tanggal] : action.response
				},
				searchParam: action.tanggal
			}
		case GET_ADD_POSTING:
			return{
				...state,
				listPickup: action.result
			}
		default: return state;
	}
}
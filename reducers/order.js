import { SUCCESS_ORDER, GET_ORDER, GET_ADD_POSTING, PICKUP_SUKSES } from "../types";

const initialState = {
	dataOrder: {},
	searchParam: null,
	listPickup: [],
	pickupNumber: null
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
				listPickup: action.result,
				pickupNumber: null
			}
		case PICKUP_SUKSES:
			return{
				...state,
				listPickup: action.listPickup,
				pickupNumber: action.pickupNumber
			}
		default: return state;
	}
}
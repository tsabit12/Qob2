import { SUCCESS_ORDER, GET_ORDER, GET_ADD_POSTING, PICKUP_SUKSES, FETCH_HISTORY_PICKUP, FETCH_DETAIL_ORDER } from "../types";

const initialState = {
	dataOrder: {},
	searchParam: null,
	listPickup: [],
	pickupNumber: null,
	historyPickup: [],
	detailOrder: {
		pickup: {},
		other: {},
	}
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
		case FETCH_HISTORY_PICKUP:
			return{
				...state,
				historyPickup: action.result
			}
		case FETCH_DETAIL_ORDER:
			return{
				...state,
				detailOrder: {
					...state.detailOrder,
					pickup: {
						...state.detailOrder.pickup,
						[action.daterange]: action.pickup
					},
					other: {
						...state.detailOrder.other,
						[action.daterange]: action.other
					}
				}
			}
		default: return state;
	}
}
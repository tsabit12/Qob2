import { SUCCESS_ORDER, GET_ORDER } from "../types";

const initialState = {
	dataOrder: {},
	searchParam: null
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
		default: return state;
	}
}
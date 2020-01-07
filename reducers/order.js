import { SUCCESS_ORDER } from "../types";
//'idOrder': {
	//id:
	//jenis:
	//nama:
	//tgl:
	//dll
//}

const initialState = {
	dataOrder: {}
}

export default function order(state=initialState, action={}){
	switch(action.type){
		case SUCCESS_ORDER: 
			return{
				...state,
				dataOrder: {
					...state.dataOrder,
					[action.id]: action.dataorder
				}
			}
		default: return state;
	}
}
import { GET_REKENING, REMOVE_REKENING } from "../types";

const intialState = {
	rekening: {}
}

export default function search(state=intialState, action={}){
	switch(action.type){
		case GET_REKENING:
			return{
				...state,
				rekening: {
					[action.rekening] : action.res
				}
			}
		case REMOVE_REKENING:
			const newState = delete state.rekening[action.rek]; 
			return{
				...state,
				rekening: newState
			}
		default: return state;
	}
}
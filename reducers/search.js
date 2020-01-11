import { GET_REKENING, REMOVE_REKENING, GET_TRACE } from "../types";

const intialState = {
	rekening: {},
	trace: {} 
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
		case GET_TRACE:
			return{
				...state,
				trace: {
					...state.trace,
					[action.extId] : action.result
				}
			}
		default: return state;
	}
}
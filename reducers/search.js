import { GET_REKENING, REMOVE_REKENING, GET_TRACE, REMOVE_HISTORY_LACAK } from "../types";
import { omit } from 'lodash';

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
			// const newState = delete state.rekening[action.rek]; 
			return{
				...state,
				rekening: omit(state.rekening, action.rek)
			}
		case GET_TRACE:
			return{
				...state,
				trace: {
					...state.trace,
					[action.extId] : action.result
				}
			}
		case REMOVE_HISTORY_LACAK:
			return{
				...state,
				trace: omit(state.trace, action.extId)
			}
		default: return state;
	}
}
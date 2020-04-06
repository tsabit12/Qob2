import { GET_REKENING, REMOVE_REKENING, GET_TRACE, REMOVE_HISTORY_LACAK, LACAK_HAS_ERROR, REMOVE_HAS_ERROR } from "../types";
import { omit } from 'lodash';

const intialState = {
	rekening: {},
	trace: {},
	errors: {},
	version: '1.0.4'
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
				trace: omit(state.trace, action.extId),
				errors: {}
			}
		case LACAK_HAS_ERROR:
			return{
				...state,
				errors: {
					global: 'Whopps, data dengan external id tersebut tidak ditemukan'
				}
			}
		case REMOVE_HAS_ERROR:
			return{
				...state,
				errors: {}
			}
		default: return state;
	}
}
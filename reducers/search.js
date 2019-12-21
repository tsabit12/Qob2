import { GET_REKENING } from "../types";

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
		default: return state;
	}
}
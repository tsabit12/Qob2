import { USER_LOGGED_IN } from "../types";

const initialState = {
	logged: false
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case USER_LOGGED_IN:
			return{
				...state,
				logged: true
			}
		default: return state;
	}
}
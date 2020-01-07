import { USER_LOGGED_IN, GET_DETAIL_USER } from "../types";

const initialState = {
	logged: false,
	user: {}
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case USER_LOGGED_IN:
			return{
				...state,
				logged: true
			}
		case GET_DETAIL_USER:
			return{
				...state,
				user: action.user
			}
		default: return state;
	}
}
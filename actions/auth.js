import { USER_LOGGED_IN } from "../types"; 

export const setLoggedIn = () => dispatch => {
	dispatch({
		type: USER_LOGGED_IN
	})
}
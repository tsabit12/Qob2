import { combineReducers } from "redux";
import register from "./reducers/register";
import search from "./reducers/search";
import order from "./reducers/order";
import auth from "./reducers/auth";

export default combineReducers({
	register,
	search,
	order,
	auth
});
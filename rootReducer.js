import { combineReducers } from "redux";
import register from "./reducers/register";
import search from "./reducers/search";
import order from "./reducers/order";

export default combineReducers({
	register,
	search,
	order,
});
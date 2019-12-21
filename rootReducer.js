import { combineReducers } from "redux";
import register from "./reducers/register";
import search from "./reducers/search";

export default combineReducers({
	register,
	search
});
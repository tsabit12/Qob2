import api from "../components/api";
import { UPDATE_PROFILE } from "../types";

export const profileUpdated = (alamat) => ({
	type: UPDATE_PROFILE,
	alamat
})

export const updateProfil = (string, object) => dispatch =>
	api.user.updateProfil(string)
		.then(res => {
			dispatch(profileUpdated(object));
			console.log(res);
		})
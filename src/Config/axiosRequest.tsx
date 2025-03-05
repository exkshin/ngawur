import axios from "axios";
import globalVariables from "./globalVariables";

/**
 * @description untuk mendapatkan axios
 * @returns axios
 */
export default axios.create({
	baseURL: globalVariables.urlAPI,

	headers: {
		// "Content-Type": "*",
		"Content-Type": "*",
	},
});

/**
 * @description untuk mendapatkan axios dengan header yang sudah ada accesstoken
 * @returns axios
 */
export const AxiosAuth = () => {
	let token = localStorage.getItem("AuthToken") ?? "";
	token = token !== "" ? token.slice(1, token.length - 1) : "";
	return axios.create({
		baseURL: globalVariables.urlAPI,
		headers: {
			// "Content-Type": "multipart/form-data",
			"Content-Type": "*",
			"access_token": token,
		},
	});
}
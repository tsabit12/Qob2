import md5 from "react-native-md5";
import getCurdate from "../getCurdate";

const getHashing = (messtype, param1) => {
	const key1 = 'c67536e59042f4f7049d441a3a5f71e1';
	const key2 = 'cd187b9bff4a84415908698f9793098d';
	const hash = md5.hex_md5(key1+getCurdate()+messtype+param1+key2);
	return hash;
}

export default getHashing;
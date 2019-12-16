import axios from "axios";

let config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Accept': 'application/json'
	},
	auth: {
	    username: 'ecom',
	    password: '05144f4e12aaa402aeb51ef2c7dde527'
	}
}

export default{
	registrasi: {
		cekKtp2: (nik) =>
			axios.post('https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb', {
				headers: {
					"Accept": "application/json",
      				"Content-Type": "application/json"
				},
				auth: {
			      UserName: "ecom",
			      password: "05144f4e12aaa402aeb51ef2c7dde527"
			  	}
			}).then(res => console.log("pkle")),
		cekKtp: () =>
			axios.post('https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb', {
			    withCredentials: true,
			    headers: {
					"Accept": "application/json",
      				"Content-Type": "application/x-www-form-urlencoded"
				},
				auth: {
			      UserName: "ecom",
			      password: "05144f4e12aaa402aeb51ef2c7dde527"
			  	}
			}).then(() => console.log("oke"))
				.catch(err => console.log(err))
	}
}


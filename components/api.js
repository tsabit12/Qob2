import axios from "axios";

const url = 'https://magenpos.posindonesia.co.id:6466/a767e8eec95442bda80c4e35e0660dbb';
let config = {	
	headers: { 
  		'content-type': 'application/x-www-form-urlencoded',
  		'accept': 'application/json'
  	},
  	auth: {
		username: 'ecom',
		password: '05144f4e12aaa402aeb51ef2c7dde527'
	}
} 

export default{
	registrasi: {
		cekKtp: (nik) =>
			axios.post(url, {
				messtype: '201',
				param1: '3171030101710005',
				userid: '',
				param2: '',
				param3: '',
				param4: '',
				param5: '',
				hashing: 'd61d087c7a7ebf87ebca7ad7634444df'
			}, config).then(res => res.data.response_data1)
	}
}
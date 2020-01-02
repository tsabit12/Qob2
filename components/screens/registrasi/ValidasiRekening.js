import React from "react";
import { View } from "react-native";
import { Input, Text, Button } from '@ui-kitten/components';
import api from "../../api";

class ValidasiRekening extends React.Component{
	noRekRef = React.createRef();

	state = {
		noRek: '',
		loading: false
	}

	componentDidMount(){
		setTimeout(() => this.noRekRef.current.focus(), 500);	
	}

	onSubmit = (e) => {
		api.registrasi.validasiRekening(this.state.noRek)
			.then(res => {
				let value = res.response_data1.split('|');
				const response = {
					alamat: value[0],
					ibu: value[1],
					nama: value[2],
					nohp: value[3],
					agama: value[4],
					skip1: value[5],
					skip2: value[6],
					noGiro: value[7],
					kota: value[8],
					namaLengkap: value[9],
					cip: value[10],
					nik: value[11],
					skip3: value[12],
					prov: value[13],
					skip4: value[14],
					skip5: value[15],
					kodePos: value[16],
					skip6: value[17],
					skip7: value[18],
					kotaLahir: value[19],
					skip8: value[20],
					skip9: value[21],
					skip10: value[22],
					tglLahir: value[23],
					kel: value[24],
					skip11: value[25],
					rt: value[26],
					skip12: value[27],
					skip13: value[28],
					skip14: value[29],
					jk: value[30],
					expKtp: value[31],
					saldo: value[32],
					kec: value[33],
					mataUang: value[34],
					saldo: value[35],
					email: value[36],
					tipeRek: value[37],
					status: value[38]
				}
				this.props.navigation.navigate({
					routeName: 'ValidasiRegRek',
					params: {
						responseRek: response
					}
				})
			})
			.catch(err => alert(err.desk_mess));
	}

	render(){
		const { noRek } = this.state;
		return(
			<View style={{margin: 10}}>
				<Input 
					ref={this.noRekRef}
					name='noRek'
					value={noRek}
					placeholder="Masukan nomor rekening giro"
					label='Rekening'
					onChangeText={(e) => this.setState({ noRek: e })}
					onSubmitEditing={this.onSubmit}
				/>
				<Button status='info' onPress={this.onSubmit}>Selanjutnya</Button>
			</View>
		);
	}
}

export default ValidasiRekening;
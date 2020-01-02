import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Input, Button } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import api from "../../api";
import Loader from "../../Loader";

class ValidasiRegRek extends React.Component{
	state = {
		validasi: {
			ibu: this.props.navigation.state.params.responseRek.ibu,
			tempatLahir: this.props.navigation.state.params.responseRek.kotaLahir,
			tglLahir: this.props.navigation.state.params.responseRek.tglLahir,
		},
		data: {
			ibu: '',
			tempatLahir: '',
			tglLahir: ''
		},
		namaOlshop: '',
		jenisOl: '',
		npwp: '',
		imei: '',
		success: false,
		errors: {},
		errors2: {},
		loading: false
	}
	// componentDidMount(){
	// 	console.log(this.props.navigation.state.params);
	// 	console.log(this.props.navigation.state.params.responseRek.ibu);
	// }

	onSubmit = () => {
		// console.log(this.state.validasi);
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ success: true });
		}
	}

	validate = (data) => {
		const errors = {};
		const { validasi } = this.state;
		if (!data.ibu) errors.ibu = "Harap diisi";
		if (!data.tempatLahir) errors.tempatLahir = "Harap diisi";
		if (!data.tglLahir) errors.tglLahir = "Harap diisi";
		if (data.ibu !== '') {
			if (data.ibu.toLowerCase() !== validasi.ibu.toLowerCase()) errors.ibu = "Salah";
		}
		if (data.tempatLahir !== '') {
			if (data.tempatLahir.toLowerCase() !== validasi.tempatLahir.toLowerCase()) errors.tempatLahir = "Salah";
		}
		if (data.tglLahir !== '') {
			if (data.tglLahir !== validasi.tglLahir) errors.tglLahir = "Salah";
		}
		return errors;
	}

	onRegistrasi = () => {
		const errors2 = this.validate2(this.state.namaOlshop, this.state.jenisOl, this.state.npwp, this.state.imei)
		this.setState({ errors2 });
		if (Object.keys(errors2).length === 0) {
			this.setState({ loading: true });
			const { responseRek } = this.props.navigation.state.params;
			const { npwp, imei, namaOlshop, jenisOl } = this.state;
			const payload = {
				param1: `-|-|${responseRek.namaLengkap}|${responseRek.nama}|${responseRek.nohp}|${responseRek.email}|${npwp}|${imei}`,
				param2: `${responseRek.noGiro}`,
				param3: `${namaOlshop}|${jenisOl}|${responseRek.alamat}|${responseRek.kel}|${responseRek.kec}|${responseRek.kota}|${responseRek.prov}|${responseRek.kodePos}`,
				param4: `${responseRek.nik}`
			}
			api.registrasi.registrasiGiro(payload)
				.then(res => {
					console.log(res);
					this.setState({ loading: false });
				})
				.catch(err => {
					this.setState({ loading: false });
					if (Object.keys(err).length === 10) {
						alert(err.desk_mess);
					}else{
						alert(err);
					}
				});

			console.log(payload);
		}
	}

	validate2 = (nama, jenis, npwp, imei) => {
		const errors = {};
		if (!nama) errors.nama = "Harap diisi";
		if (!jenis) errors.jenis = "Harap diisi";
		if (!npwp) errors.npwp = "Harap diisi";
		if (!imei) errors.imei = "Harap diisi";
		return errors;
	}

	render(){
		const { responseRek } = this.props.navigation.state.params;
		const { data, errors, success, errors2 } = this.state;
		return(
			<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					enabled
				>
				<ScrollView keyboardShouldPersistTaps='always' style={{marginTop: 40}}>
					<Loader loading={this.state.loading} />
					<View style={{padding: 10}}>
						<Input 
							label='Nama ibu'
							value={data.ibu}
							onChangeText={(e) => this.setState({ data: { ...this.state.data, ibu: e}})}
							status={errors.ibu && 'danger'}
							disabled={success}
						/>
						{ errors.ibu && <Text style={{color: 'red'}}>{errors.ibu}</Text>}
						<Input 
							label='Kota Kelahiran'
							value={data.tempatLahir}
							onChangeText={(e) => this.setState({ data: { ...this.state.data, tempatLahir: e}})}
							status={errors.tempatLahir && 'danger'}
							disabled={success}
						/>
						{ errors.tempatLahir && <Text style={{color: 'red'}}>{errors.tempatLahir}</Text>}
						<Input 
							label='Tanggal Lahir'
							value={data.tglLahir}
							onChangeText={(e) => this.setState({ data: { ...this.state.data, tglLahir: e}})}
							status={errors.tglLahir && 'danger'}
							disabled={success}
						/>
						{ errors.tglLahir && <Text style={{color: 'red'}}>{errors.tglLahir}</Text>}
						<Button status='info' onPress={this.onSubmit} disabled={success}>Validasi</Button>

						{ success && <View>
							<Input 
								label='Nama Online Shop'
								value={this.state.namaOlshop}
								placeholder='Masukan nama online shop anda'
								onChangeText={(e) => this.setState({ namaOlshop: e })}
							/>
							<Input 
								label='Nama Online Shop'
								value={this.state.jenisOl}
								placeholder='Masukan jenis oline shop anda'
								onChangeText={(e) => this.setState({ jenisOl: e })}
							/>
							<Input 
								label='Npwp'
								value={this.state.npwp}
								placeholder='Masukan npwp anda'
								onChangeText={(e) => this.setState({ npwp: e })}
							/>
							<Input 
								label='IMEI'
								value={this.state.imei}
								placeholder='Masukan imei smartphone anda'
								onChangeText={(e) => this.setState({ imei: e })}
							/>
							<Input 
								label='Nama Lengkap'
								value={responseRek.namaLengkap}
								disabled={true}
							/>
							<Input 
								label='Nomor Hp'
								value={responseRek.nohp}
								disabled={true}
							/>
							<Input 
								label='Alamat'
								value={responseRek.alamat}
								disabled={true}
							/>
							<Input 
								label='Kelurahan'
								value={responseRek.kel}
								disabled={true}
							/>
							<Button status='info' onPress={this.onRegistrasi}>Registrasi</Button>
						</View> }
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default ValidasiRegRek;
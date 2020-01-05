import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, AsyncStorage } from "react-native";
import { Input, Button } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import api from "../../api";
import Loader from "../../Loader";
import styles from "./styles";
import Dialog from "react-native-dialog";
import Modal from "../../Modal";

const Judul = ({ navigation }) => (
	<View>
		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, fontWeight: '700'}}>Validasi Rekening</Text>
	</View>
);


class ValidasiRegRek extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	}) 

	ibuRef = React.createRef();
	tmpLRef = React.createRef();
	tglLRef = React.createRef();
	nmOlRef = React.createRef();
	jenisOlRef = React.createRef();
	npwpRef = React.createRef();
	imeiRef = React.createRef();

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
		imei: '12345678',
		success: false,
		errors: {},
		errors2: {},
		loading: false,
		saved: 0,
		payloadRes: {},
		desk_mess: ''
	}

	async componentDidMount(){
		setTimeout(() => this.ibuRef.current.focus(), 500);	
		// const value = await AsyncStorage.getItem('@MySuperStore:key');
		// console.log(value);
		console.log(this.state.validasi);
	}

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ success: true });
			setTimeout(() => this.nmOlRef.current.focus(), 500);	
		}else{
			if (errors.ibu) {
				this.ibuRef.current.focus();
			}else if (errors.tempatLahir) {
				this.tmpLRef.current.focus();
			}else{
				this.tglLRef.current.focus();
			}
		}
	}

	validate = (data) => {
		const errors = {};
		const { validasi } = this.state;
		if (!data.ibu) errors.ibu = "Harap diisi";
		if (!data.tempatLahir) errors.tempatLahir = "Harap diisi";
		if (!data.tglLahir) errors.tglLahir = "Harap diisi";
		if (data.ibu !== '') {
			if (data.ibu.toLowerCase() !== validasi.ibu.toLowerCase()) errors.ibu = "Tidak valid";
		}
		if (data.tempatLahir !== '') {
			if (data.tempatLahir.toLowerCase() !== validasi.tempatLahir.toLowerCase()) errors.tempatLahir = "Tidak valid";
		}
		if (data.tglLahir !== '') {
			if (data.tglLahir !== validasi.tglLahir) errors.tglLahir = "Tidak valid";
		}
		return errors;
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

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
					const { response_data1 } = res;
					let parsing = response_data1.split('|');
					const payloadRes = {
						userid: parsing[0],
						pin: parsing[1],
						nama: parsing[2],
						nohp: parsing[3],
						email: parsing[4],
						imei: parsing[5],
						norek: parsing[6],
					};
					this.setState({ payloadRes });
					this.saveToStorage(payloadRes)
						.then(() => this.setState({ loading: false, saved: 200, desk_mess: res.desk_mess }))
						.catch(err => {
							this.setState({ loading: false, saved: 500, errors: {global: err} });
							console.log(err);
						});
				})
				.catch(err => {
					this.setState({ loading: false });
					if (Object.keys(err).length === 10) {
						alert(err.desk_mess);
					}else{
						alert(err);
					}
				});

			// console.log(payload);
		}
	}

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
	}

	validate2 = (nama, jenis, npwp, imei) => {
		const errors = {};
		if (!nama) errors.namaOlshop = "Harap diisi";
		if (!jenis) errors.jenisOl = "Harap diisi";
		if (!npwp) errors.npwp = "Harap diisi";
		// if (!imei) errors.imei = "Harap diisi";
		return errors;
	}

	trySaveAgain = () => {
		const { payloadRes } = this.state;
		this.setState({ loading: true, errors: {} });
		this.saveToStorage(payloadRes)
			.then(() => this.setState({ loading: false, saved: 200 }))
			.catch(err => this.setState({ loading: false, saved: 500, errors: {global: err} }));
	}

	render(){
		const { responseRek } = this.props.navigation.state.params;
		const { data, errors, success, errors2, saved, desk_mess } = this.state;
		return(
			<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					enabled
					keyboardVerticalOffset = {Header.HEIGHT + 40}
				>
				{ saved === 200 && <Modal loading={true} text={desk_mess} handleClose={() => this.setState({ saved: 0 })} />}
				<ScrollView keyboardShouldPersistTaps='always'>
					<Loader loading={this.state.loading} />
					<View style={{padding: 10}}>
						<Input 
							label='Nama ibu'
							value={data.ibu}
							name='ibu'
							ref={this.ibuRef}
							placeholder='Masukan nama ibu'
							onChangeText={(e) => this.onChange(e, this.ibuRef.current.props)}
							status={errors.ibu && 'danger'}
							disabled={success}
							labelStyle={errors.ibu ? styles.labelRed : styles.label }
							onSubmitEditing={() => this.tmpLRef.current.focus() }
						/>
						{ errors.ibu && <Text style={styles.labelErr}>{errors.ibu}</Text>}
						<Input 
							label='Kota Kelahiran'
							value={data.tempatLahir}
							name='tempatLahir'
							ref={this.tmpLRef}
							onChangeText={(e) => this.onChange(e, this.tmpLRef.current.props)}
							status={errors.tempatLahir && 'danger'}
							disabled={success}
							labelStyle={errors.tempatLahir ? styles.labelRed : styles.label }
							placeholder='Masukan kota kelahiran'
							onSubmitEditing={() => this.tglLRef.current.focus() }
						/>
						{ errors.tempatLahir && <Text style={styles.labelErr}>{errors.tempatLahir}</Text>}
						<Input 
							label='Tanggal Lahir'
							ref={this.tglLRef}
							name='tglLahir'
							value={data.tglLahir}
							onChangeText={(e) => this.onChange(e, this.tglLRef.current.props)}
							status={errors.tglLahir && 'danger'}
							disabled={success}
							labelStyle={errors.tglLahir ? styles.labelRed : styles.label }
							placeholder='Masukan tanggal tahir YYYY/MM/DD'
							onSubmitEditing={() => this.onSubmit() }
						/>
						{ errors.tglLahir && <Text style={styles.labelErr}>{errors.tglLahir}</Text>}
						<Button status='info' onPress={this.onSubmit} disabled={success} style={{marginTop: 5}}>Validasi</Button>

						{ success && <View>
							<Input 
								label='Nama Lengkap'
								value={responseRek.namaLengkap}
								disabled={true}
								status='success'
								labelStyle={styles.labelSuccess}
							/>
							<Input 
								label='Nomor Hp'
								value={responseRek.nohp}
								disabled={true}
								status='success'
								labelStyle={styles.labelSuccess}
							/>
							<Input 
								label='Alamat'
								value={responseRek.alamat}
								disabled={true}
								status='success'
								labelStyle={styles.labelSuccess}
							/>
							<Input 
								label='Kelurahan'
								value={responseRek.kel}
								disabled={true}
								status='success'
								labelStyle={styles.labelSuccess}
							/>
							<Input 
								label='Nama Online Shop'
								ref={this.nmOlRef}
								name='namaOlshop'
								labelStyle={errors2.namaOlshop ? styles.labelRed : styles.label }
								value={this.state.namaOlshop}
								placeholder='Masukan nama online shop anda'
								onChangeText={(e) => this.setState({ namaOlshop: e })}
								onSubmitEditing={() => this.jenisOlRef.current.focus() }
							/>
							<Input 
								label='Jenis Online Shop'
								ref={this.jenisOlRef}
								value={this.state.jenisOl}
								placeholder='Toko baju, sepatu dll'
								labelStyle={errors2.jenisOl ? styles.labelRed : styles.label }
								onChangeText={(e) => this.setState({ jenisOl: e })}
								onSubmitEditing={() => this.npwpRef.current.focus() }
							/>
							<Input 
								label='Npwp'
								ref={this.npwpRef}
								value={this.state.npwp}
								keyboardType='numeric'
								placeholder='Masukan npwp anda'
								onChangeText={(e) => this.setState({ npwp: e })}
								labelStyle={errors2.npwp ? styles.labelRed : styles.label }
								onSubmitEditing={this.onRegistrasi}
							/>
							{/*<Input 
								label='IMEI'
								ref={this.imeiRef}
								keyboardType='numeric'
								value={this.state.imei}
								placeholder='Masukan imei smartphone anda'
								onChangeText={(e) => this.setState({ imei: e })}
								labelStyle={errors2.imei ? styles.labelRed : styles.label }
								onSubmitEditing={() => this.onRegistrasi() }
							/>*/}
							<Button status='info' onPress={this.onRegistrasi}>Registrasi</Button>
						</View> }
					</View>
				</ScrollView>

				{ errors.global && <View>
					<Dialog.Container visible={!!errors.global}>
						<Dialog.Title>Terdapat kesalahan!</Dialog.Title>
				        <Dialog.Description>
				          	<Text>Something is wrong with your smartphone</Text>
				        </Dialog.Description>
			          <Dialog.Button label="Coba lagi" onPress={this.trySaveAgain} />
			        </Dialog.Container>
				</View> }
			</KeyboardAvoidingView>
		);
	}
}

export default ValidasiRegRek;
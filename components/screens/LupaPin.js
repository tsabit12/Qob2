import React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, AsyncStorage } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import api from "../api";
import Modal from "../Modal";
import Dialog from "react-native-dialog";
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { saveRegister } from "../../actions/register";
import { Header } from 'react-navigation-stack';
import { curdate } from "../utils/helper";

const Judul = ({ navigation }) => (
	<View>
		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, fontWeight: '700'}}>{navigation.state.params.titlePemulihan}</Text>
	</View>
);

const MessageSucces = ({ message, visible, onPress, backHome }) => (
	<View>
        <Dialog.Container visible={true}>
          <Dialog.Description>
          	{ message }
          </Dialog.Description>
          <Dialog.Button label="Tutup" onPress={() => onPress()} />
          <Dialog.Button 
          	label="Login" 
          	onPress={() => backHome() } />
        </Dialog.Container>
    </View>
);

// const optionsData = [
//   { text: 'Lupa pin', value: 1 },
//   { text: 'Pulihkan Akun', value: 2 },
//   { text: 'Buka Blokir', value: 3 },
// ];

class LupaPin extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	}) 

	useridRef = React.createRef();
	namaRef = React.createRef();
	nohpRef = React.createRef();
	emailRef = React.createRef();
	kodeRef = React.createRef();

	state = {
		data: {
			userid: '',
			nama: '',
			nohp: '',
			email: '',
			imei: Constants.deviceId
		},
		errors: {},
		loading: false,
		success: {
			status: false,
			message: '',
			statusVer: false,
			messageVer: ''
		},
		visible: false,
		kode: '',
		jenis: this.props.navigation.state.params.jenis
	}

	async componentDidMount(){
		const curdateVal = curdate();
		const { jenis, titlePemulihan } = this.props.navigation.state.params;
		const value 	= await AsyncStorage.getItem(`${curdateVal}`);
		const toJson 	= JSON.parse(value); 

		if (toJson !== null) { //check session in storage
			let curdateStorage 	= toJson.curdate;
			let jenisStorage 	= toJson.jenis;
			let statusStorage 	= toJson.status;
			if (curdateStorage === curdateVal && jenisStorage === jenis && statusStorage === true) {
				let valueStorage = toJson.value;
				this.setState({ 
					success: {
						...this.state.success,
						status: true,
						message: `Kami mendeteksi bahwa anda sudah melakukan request ${titlePemulihan} sebelumnya. Silahkan masukan kode verifikasi dibawah ini`
					},
					data: {
						...this.state.data,
						userid: valueStorage.userid,
						email: valueStorage.email,
						nama: valueStorage.nama,
						nohp: valueStorage.nohp
					}
				})
			}
		}
	}


	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onSubmit = () => {
		let jenis		= this.state.jenis;
		const errors = this.validate(this.state.data, jenis);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });

			const { data } 	= this.state;
			const valueSession = {
				userid: data.userid,
				nama: data.nama,
				nohp: data.nohp,
				email: data.email,
				jenis: jenis
			};
			//need to detect if user
			//alerady submit request form 1 (request pemulihan)
			this.saveSessionRequest(valueSession)
				.then(res => {
					console.log("oke");
					this.setState({ loading: false });
				})
				.catch(err => {
					this.setState({ loading: false });
					console.log("gagal");
				});


			// const payload = {
			// 	param1: `${data.userid}|${data.nama}|${data.nohp}|${data.email}|${data.imei}|${jenis}`	
			// };
			// api.registrasi.lupaPin(payload)
			// 	.then(res => {
			// 		// console.log(res);
			// 		// console.log(payload);
			// 		this.setState({ loading: false, visible: true, success: { status: true, message: res.desk_mess }});
			// 	}).catch(err => {
			// 		// console.log(err);
			// 		// console.log(payload);
			// 		if (Object.keys(err).length === 10) {
			// 			this.setState({ loading: false, errors: { global: err.desk_mess } });
			// 		}else{
			// 			this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
			// 		}
			// 	})
		}
	}

	validate = (data, jenis) => {
		const errors = {};
		if (jenis === 0) errors.jenis = "Jenis belum dipilih";
		if (!data.userid) errors.userid = "Masukan userid";
		if (!data.nama) errors.nama = "Masukan nama";
		if (!data.nohp) errors.nohp = "Masukan nomor handphone";
		if (!data.email) errors.email = "Masukan email";
		return errors;
	}

	onBackHome = () => {
		this.setState({ visible: false });
		this.props.navigation.navigate({
			routeName: 'Home'
		})
	}

	onChangeKode = (e) => this.setState({ kode: e })

	//save session request
	//and set expire one day
	//by variable storage it self
	async saveSessionRequest(value){
		try{
			const curdateVal 	= curdate();
			const { jenis } 	= this.state;
			const payload 		= {
				jenis: jenis,
				status: true,
				curdate: curdateVal,
				value: value
			};
			await AsyncStorage.setItem(`${curdateVal}`, JSON.stringify(payload));
			return Promise.resolve(true);
		}catch(errors){
			return Promise.resolve(false);
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

	async removeSession(){
		try{
			const curdateVal 	= curdate();
			await AsyncStorage.removeItem(`${curdateVal}`);
      		return Promise.resolve(true);
		}catch(errors){
			return Promise.reject(errors);
		}
	}

	onVerfikasi = () => {
		this.removeSession()
			.then(() => console.log("removed"))
			.catch(() => console.log("not removed"));
		// const errors = this.validateKode(this.state.kode);
		// this.setState({ errors });
		// if (Object.keys(errors).length === 0) {
		// 	this.setState({ loading: true });
		// 	const { data, kode } = this.state;
		// 	let jenis = this.state.jenis;
 	// 		const payload = {
		// 		param1: `${data.userid}|${data.nama}|${data.nohp}|${data.email}|${data.imei}|${kode}|${jenis}`
		// 	};
		// 	api.auth.verifikasi(payload)
		// 		.then(res => {
		// 			const { response_data2 } = res;
		// 			let parsing = response_data2.split('|');
		// 			const payloadRes = {
		// 				userid: parsing[0],
		// 				username: parsing[1],
		// 				pinMd5: parsing[2],
		// 				nama: parsing[3],
		// 				nohp: parsing[4],
		// 				email: parsing[5]
		// 			};
		// 			this.saveToStorage(payloadRes)
		// 				.then(() => {
		// 					this.setState({ 
		// 						loading: false, 
		// 						success: {
		// 							...this.state.success,
		// 							statusVer: true,
		// 							messageVer: res.response_data1
		// 						},
		// 						visible: true
		// 					})
		// 					this.props.saveRegister(payloadRes);
		// 				}).catch(() => alert("Oppps, something wrong with storage"));
		// 		}).catch(err => {
		// 			if (Object.keys(err).length === 10) {
		// 				this.setState({ loading: false });
		// 				alert(err.desk_mess);
		// 			}else{
		// 				alert("Terdapat kesalahan harap cobalagi nanti");
		// 			}
					
		// 		});	
		// }
	}

	validateKode = (kode) => {
		const errors = {};
		if (!kode) errors.kode = "Masukan kode verifikasi";
		return errors;
	}

	onsetSelectedOption = (e) => this.setState({ jenis: e.value })


	render(){
		const { data, errors, loading, success, visible } = this.state;
		return(
			<View style={{flex: 1}}>
				<Loader loading={loading} />
				{ success.statusVer && <MessageSucces 
						message={success.messageVer} 
						visible={visible} 
						onPress={() => this.setState({ visible: false })}
						backHome={this.onBackHome}
					/> }
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
				<KeyboardAvoidingView 
					behavior="padding" 
					enabled
					style={{flexGrow:1}} 
					keyboardVerticalOffset = {Header.HEIGHT + 20}
				>
				<ScrollView>
					<View style={{padding: 10}}>
						{ !success.status ? <React.Fragment>
							<View>
								<Input 
									label='Userid'
									ref={this.useridRef}
									labelStyle={styles.label}
									placeholder='Masukan userid anda'
									onChangeText={(e) => this.onChange(e, this.useridRef.current.props)}
									style={styles.input}
									value={data.userid}
									name='userid'
									keyboardType='numeric'
									onSubmitEditing={() => this.namaRef.current.focus() }
									status={errors.userid && 'danger'}
								/>
								{ errors.userid && <Text style={styles.labelErr}>{errors.userid}</Text>}
								<Input 
									label='Nama Lengkap'
									ref={this.namaRef}
									labelStyle={styles.label}
									placeholder='Masukan nama lengkap'
									onChangeText={(e) => this.onChange(e, this.namaRef.current.props)}
									style={styles.input}
									value={data.nama}
									name='nama'
									onSubmitEditing={() => this.nohpRef.current.focus() }
									status={errors.nama && 'danger'}
								/>
								{ errors.nama && <Text style={styles.labelErr}>{errors.nama}</Text>}
								<Input 
									label='Nomor Handphone'
									ref={this.nohpRef}
									labelStyle={styles.label}
									placeholder='Masukan nomor handphone'
									onChangeText={(e) => this.onChange(e, this.nohpRef.current.props)}
									style={styles.input}
									value={data.nohp}
									name='nohp'
									onSubmitEditing={() => this.emailRef.current.focus() }
									status={errors.nohp && 'danger'}
									keyboardType='numeric'
								/>
								{ errors.nohp && <Text style={styles.labelErr}>{errors.nohp}</Text>}
								<Input 
									label='Email'
									ref={this.emailRef}
									labelStyle={styles.label}
									placeholder='Masukan email anda'
									onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
									style={styles.input}
									value={data.email}
									name='email'
									onSubmitEditing={() => this.onSubmit() }
									status={errors.email && 'danger'}
								/>
								{ errors.email && <Text style={styles.labelErr}>{errors.email}</Text>}
							</View>
							<Button status='danger' onPress={this.onSubmit}>
								{ this.state.jenis === 1 && 'Dapatkan PIN Baru' }
								{ this.state.jenis === 2 && 'Pulihkan' }
								{ this.state.jenis === 3 && 'Buka kembali akun saya' }
							</Button>
						</React.Fragment> : <React.Fragment>
							<View style={{backgroundColor: '#c7e4eb', padding: 5, borderRadius: 3}}>
								<Text style={{fontFamily: 'open-sans-reg'}}>{success.message}</Text>
							</View>
							<Input 
								ref={this.kodeRef}
								labelStyle={styles.label}
								placeholder='Masukan kode verifikasi disini'
								style={{ marginTop: 20 }}
								value={this.state.kode}
								name='kode'
								keyboardType='numeric'
								maxLength={6}
								onChangeText={this.onChangeKode}
								status={errors.kode && 'danger'}
							/>
							{ errors.kode && <Text style={{fontSize: 12, color: 'red'}}>{errors.kode}</Text>}
							<Button status='info' style={{marginTop: 4}} onPress={this.onVerfikasi}>Verifikasi</Button>
						</React.Fragment> }
					</View>
				</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}


export default connect(null, { saveRegister })(LupaPin);

const styles = StyleSheet.create({
	label: {
		color: 'black',
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	input: {
		paddingBottom: 10
	},
	labelErr: {
		color: 'red',
		fontSize: 12,
		marginTop: -10,
		paddingBottom: 5
	}
});
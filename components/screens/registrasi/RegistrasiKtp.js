import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Image } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { connect } from "react-redux";
import styles from "./styles";
import { Input, Button, Select } from '@ui-kitten/components';
import kepercayaan from "../../json/agama";
import pekerjaan from "../../json/pekerjaan";
import status from "../../json/status";
import penghasilan from "../../json/penghasilan";
import sumber from "../../json/sumber";
import tujuan from "../../json/tujuan";
import Loader from "../../Loader";
import md5 from "react-native-md5";
import { convertDate } from "../../utils/helper";
import { registerKtp, removeError } from "../../../actions/register";
import Modal from "../../Modal";


const SubTitle = ({ judul }) => (
		<Text>
			{!judul.judulHeader ? "Data tidak ditemukan" : judul.judulHeader }
		</Text>
	)
const Judul = ({ navigation }) => {
	const { state } = navigation;	
	return(
		<View>
			<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
			{ !state.params ? <Text>Loading..</Text> : <SubTitle judul={state.params} /> }			
		</View>
	);
}

class RegistrasiKtp extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	}) 

	state = {
		'validateMother': {
			text: '',
			success: false,
			loading: false
		},
		bug: {},
		data: {
			namaPanggilan: '',
			noHp: '',
			npwp: '',
			email: '',
			imei: '',
			kodepos: '',
			gender: '',
			kepercayaan: '',
			pekerjaan: '',
			status: '',
			penghasilan: '',
			sumber: '',
			tujuan: '',
			username: '',
			password: '',
			nmOlshop: ''
		},
		secureTextEntry: true,
		errorsState: {},
		loading: false,
		modal: true
	}

	componentDidMount(){
		const { ktp } = this.props.dataktp;
		const errors = this.props.errr;
		if (Object.keys(ktp).length > 0 && Object.keys(errors).length === 0) {
			this.props.navigation.setParams({
				judulHeader: ktp.nik
			});
			// console.log("oke");
		}else{
			this.props.navigation.setParams({
				judulHeader: undefined
			});
		}
	}

	onChange = (e) => this.setState({ validateMother: { ...this.state.validateMother, text: e }})

	onValidate = (e) => {
		const bug = this.validate(this.state.validateMother.text);
		this.setState({ bug });
		if (Object.keys(bug).length === 0) {
			this.setState({ validateMother: { ...this.state.validateMother, success: true }})
		}
	}

	validate = (name) => {
		const bug = {};
		const { motherName } = this.props.dataktp.ktp;
		
		if (!name) bug.validate = "Harap validasi data ktp anda";
		if (name) {
			if (name.toLowerCase() !== motherName.toLowerCase()) bug.validate = "Nama ibu tidak valid";
		}
		return bug;
	}

	onChangeNama = (e) => this.setState({ data: { ...this.state.data, namaPanggilan: e }})
	onChangePhone = (e) => this.setState({ data: { ...this.state.data, noHp: e }})
	onChangeNpwp = (e) => this.setState({ data: { ...this.state.data, npwp: e }})
	onChangeEmail = (e) => this.setState({ data: { ...this.state.data, email: e }})
	onChangeImei = (e) => this.setState({ data: { ...this.state.data, imei: e }})
	onChangeKodePos = (e) => this.setState({ data: { ...this.state.data, kodepos: e }})
	onChangeUsername = (e) => this.setState({ data: { ...this.state.data, username: e }})
	onChangePassword = (e) => this.setState({ data: { ...this.state.data, password: e }})
	onChangeOlshop = (e) => this.setState({ data: { ...this.state.data, nmOlshop: e }})

	onSelectText = ({ name, value }) => {
		// const key = this.getKeyByName(name, value);
		this.setState({ 
			data: { ...this.state.data, [name]: value },
			// selectedOption: {
			// 	...this.state.selectedOption,
			// 	[name]: key
			// }
		})
	}

	renderIcon = (style) => {
		const { secureTextEntry } = this.state;
		return(
			<Image
		      style={style} 
		      source={ secureTextEntry ? require('../../icons/eye-off-outline.png') : require('../../icons/eye-outline.png')}
		    />
		);
	}

	onIconPress = () => {
		const { secureTextEntry } = this.state;
		if (secureTextEntry) {
			this.setState({ secureTextEntry: false });
		}else{
			this.setState({ secureTextEntry: true });
		}
	}

	onSubmit = () => {
		const errorsState = this.validateBiodata(this.state.data);
		this.setState({ errorsState });
		if (Object.keys(errorsState).length === 0) {
			this.setState({ loading: true, modal: true });
			const { ktp } 	= this.props.dataktp;
			const { data }	= this.state;
			const pass 		= md5.hex_md5(data.password);
			const tglLahir 	= convertDate(ktp.birtDate);
			const gender 	= ktp.gender === 'Perempuan' ? 'W' : 'P';
			const param1	= `${data.username}|${pass}|${ktp.fullname}|${data.namaPanggilan}|${data.noHp}|${data.email}|${data.npwp}|${data.imei}`;
			const param2 	= `${ktp.birthPlace}|${tglLahir}|${gender}|${data.kepercayaan}|${data.pekerjaan}|${data.status}|1|${ktp.nik}|30/12/2050|${ktp.alamat}|${ktp.rt}|${ktp.rw}|${ktp.desa}|${ktp.kec}|${ktp.city}|${ktp.prov}|${data.kodepos}|${data.tujuan}|${data.sumber}|${data.penghasilan}|${ktp.motherName}`;
			const param3 	= `${data.nmOlshop}|qwerty|${ktp.alamat}|${ktp.desa}|${ktp.kec}|${ktp.city}|${ktp.prov}|${data.kodepos}`;
			const payload	= {
				params1: param1,
				params2: param2,
				params3: param3
			}

			console.log(payload);

			this.props.registerKtp(payload)
				.then(res => this.setState({ loading: false }))
				.catch(err => {
					console.log(err);
					this.setState({ loading: false })
				})
		}
	}

	closeModal = () => {
		this.setState({ modal: false });
		this.props.removeError();
	}

	validateBiodata = (data) => {
		const errorsState = {};
		if (!data.username) errorsState.username = "Username tidak boleh kosong";
		if (!data.password) errorsState.password = "Password tidak boleh kosong";
		if (!data.noHp) errorsState.noHp = "Nomor handphone tidak boleh kosong";
		if (!data.npwp) errorsState.npwp = "Npwp tidak boleh kosong";
		if (!data.email) errorsState.email = "Npwp tidak boleh kosong";
		if (!data.nmOlshop) errorsState.nmOlshop = "Nama online shop tidak boleh kosong";
		if (!data.namaPanggilan) errorsState.namaPanggilan = "Nama panggilan tidak boleh kosong";
		if (!data.imei) errorsState.imei = "Imei tidak boleh kosong";
		return errorsState;
	}

	render(){
		const { ktp } = this.props.dataktp;
		const { validateMother, bug, data, secureTextEntry, errorsState, loading } = this.state;
		const errors  = this.props.errr; 
		const { errr2 } = this.props;
		return(
			<SafeAreaView>
				{ Object.keys(errors).length > 0 && <View style={styles.message}>
					<View style={{margin: 8}}>
						<Text>{errors.ktp.text}!</Text>
						<Text>Harap pastikan bahwa nomor ktp yang dientri sudah benar</Text>
					</View>
				</View>}
				<Loader loading={loading} />
				<KeyboardAvoidingView behavior="padding" style={styles.container}>
				<ScrollView>
					{Object.keys(ktp).length > 0 && Object.keys(errors).length === 0 && 
						<View style={styles.centerForm}>
							<Input
								label='Validasi'
								placeholder='Masukan nama ibu kandung anda disinii'
								labelStyle={styles.labelRed}
								value={validateMother.text}
								onChangeText={this.onChange}
								autoFocus
								size='small'
								status={bug.validate && 'danger' }
							/>
							{ bug.validate && <Text style={styles.labelErr}>{bug.validate}</Text> }
							<Input
								placeholder='Nama Lengkap'
								label='Nama'
								labelStyle={styles.label}
								value={ktp.fullname}
								disabled={true}
								size='small'
							/>
							<Button 
								size='small' 
								style={styles.button}
								onPress={this.onValidate}
								disabled={validateMother.success}
							>Validasi</Button>
							{ validateMother.success && <View style={{paddingTop: 10}}>
									<Input
								    	ref='username'
										placeholder='Masukan username'
										label='Username'
										value={data.username}
										labelStyle={styles.label}
										onChangeText={this.onChangeUsername}
										size='small'
										status={errorsState.username && 'danger' }
										onSubmitEditing={() => this.refs.password.focus() }
									/>
									{ errorsState.username && <Text style={styles.labelErr}>{errorsState.username}</Text> }
									<Input
									  value={data.password}
									  labelStyle={styles.label}
									  label='Password'
									  ref='password'
									  size='small'
									  placeholder='********'
									  icon={this.renderIcon}
									  status={errorsState.password && 'danger'}
									  secureTextEntry={secureTextEntry}
									  onIconPress={this.onIconPress}
									  onChangeText={this.onChangePassword}
									  onSubmitEditing={() => this.refs.nmOlshop.focus() }
									/>
									{ errorsState.password && <Text style={styles.labelErr}>{errorsState.password}</Text> }
									<Input
								    	ref='nmOlshop'
										placeholder='Masukan nama online shop'
										label='Nama Online Shop'
										value={data.nmOlshop}
										labelStyle={styles.label}
										onChangeText={this.onChangeOlshop}
										status={errorsState.nmOlshop && 'danger'}
										size='small'
										onSubmitEditing={() => this.refs.namaPanggilan.focus() }
									/>
									{ errorsState.nmOlshop && <Text style={styles.labelErr}>{errorsState.nmOlshop}</Text> }
									<Input
								    	ref='namaPanggilan'
										placeholder='Masukan nama panggilan'
										label='Nama Panggilan'
										value={data.namaPanggilan}
										labelStyle={styles.label}
										onChangeText={this.onChangeNama}
										status={errorsState.namaPanggilan && 'danger'}
										size='small'
										onSubmitEditing={() => this.refs.noHp.focus() }
									/>
									{ errorsState.namaPanggilan && <Text style={styles.labelErr}>{errorsState.namaPanggilan}</Text> }
									<Input
								    	ref='noHp'
										placeholder='628/08 XXXX'
										label='Nomor Hp *'
										value={data.noHp}
										labelStyle={styles.label}
										onChangeText={this.onChangePhone}
										keyboardType='numeric'
										status={errorsState.noHp && 'danger'}
										size='small'
										onSubmitEditing={() => this.refs.npwp.focus() }
									/>
									{ errorsState.noHp && <Text style={styles.labelErr}>{errorsState.noHp}</Text> }
									<Input
									  ref='npwp'
									  label='NPWP'
									  labelStyle={styles.label}
									  placeholder='Masukan nomor NPWP'
									  value={data.npwp}
									  onChangeText={this.onChangeNpwp}
									  status={errorsState.npwp && 'danger'}
									  size='small'
									  onSubmitEditing={() => this.refs.email.focus() }
									/>
									{ errorsState.npwp && <Text style={styles.labelErr}>{errorsState.npwp}</Text> }
									<Input
									  value={data.email}
									  ref='email'
									  label='Email'
									  labelStyle={styles.label}
									  placeholder='example@example.com'
									  onChangeText={this.onChangeEmail}
									  size='small'
									  status={errorsState.email && 'danger'}
									  onSubmitEditing={() => this.refs.imei.focus() }
									/>
									 { errorsState.email && <Text style={styles.labelErr}>{errorsState.email}</Text> }
									<Input
									  value={data.imei}
									  label='IMEI phone'
									  placeholder='Masukan imei smartphone anda'
									  keyboardType='numeric'
									  labelStyle={styles.label}
									  onChangeText={this.onChangeImei}
									  status={errorsState.imei && 'danger'}
									  ref='imei'
									  size='small'
									  onSubmitEditing={() => this.refs.kodepos.focus() }
									/>
									{ errorsState.imei && <Text style={styles.labelErr}>{errorsState.imei}</Text> }
									<Input
									  value={data.kodepos}
									  label='Kodepos'
									  placeholder='Masukan kodepos'
									  keyboardType='numeric'
									  labelStyle={styles.label}
									  onChangeText={this.onChangeKodePos}
									  ref='kodepos'
									  size='small'
									/>
									<Select
								    	label='Kepercayaan'
								        data={kepercayaan}
								        labelStyle={styles.label}
								        placeholder='Pilih Kepercayaan'
								        onSelect={this.onSelectText}
								    />
								    <Select
								    	label='Pekerjaan'
								        data={pekerjaan}
								        placeholder='Pilih Jenis Pekerjaan'
								        labelStyle={styles.label}
								        onSelect={this.onSelectText}
								    />
								    <Select
								    	label='Status Perkawinan'
								        data={status}
								        placeholder='Pilih Status'
								        labelStyle={styles.label}
								        onSelect={this.onSelectText}
								    />
								    <Select
								    	label='Penghasilan'
								        data={penghasilan}
								        placeholder='Pilih penghasilan pertahun'
								        onSelect={this.onSelectText}
								        labelStyle={styles.label}
								    />
								    <Select
								    	label='Sumber Penghasilan'
								        data={sumber}
								        placeholder='Pilih Sumber Penghasilan'
								        labelStyle={styles.label}
								        onSelect={this.onSelectText}
								    />
								    <Select
								    	label='Tujuan'
								        data={tujuan}
								        placeholder='Pilih Tujuan Penggunaan Dana'
								        onSelect={this.onSelectText}
								        labelStyle={styles.label}
								    />
									<Button 
										size='small' 
										style={styles.button}
										onPress={this.onSubmit}
									>Daftar</Button>
								</View> }
						</View> }
				</ScrollView>
				</KeyboardAvoidingView>
				{ Object.keys(errr2).length > 0 && 
					<Modal 
						loading={this.state.modal} 
						text={errr2.message} 
						handleClose={this.closeModal}
					/>}
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataktp: state.register,
		errr: state.register.errors.ktp,
		errr2: state.register.errors.register
	}
}


export default connect(mapStateToProps, { registerKtp, removeError })(RegistrasiKtp);
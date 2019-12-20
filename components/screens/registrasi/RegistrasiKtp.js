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
import tujuan from "../../json/tujuan"

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
		errorsState: {}
	}

	componentDidMount(){
		const { ktp, errors } = this.props.dataktp;
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
	}

	validateBiodata = (data) => {
		const errorsState = {};
		if (!data.username) errorsState.username = "Username tidak boleh kosong"
		return errorsState;
	}

	render(){
		const { errors, ktp } = this.props.dataktp;
		const { validateMother, bug, data, secureTextEntry, errorsState } = this.state;
		return(
			<SafeAreaView>
				{ Object.keys(errors).length > 0 && <View style={styles.message}>
					<View style={{margin: 8}}>
						<Text>{errors.ktp}!</Text>
						<Text>Harap pastikan bahwa nomor ktp yang dientri sudah benar</Text>
					</View>
				</View>}
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
									  secureTextEntry={secureTextEntry}
									  onIconPress={this.onIconPress}
									  onChangeText={this.onChangePassword}
									  onSubmitEditing={() => this.refs.namaPanggilan.focus() }
									/>
									<Input
								    	ref='nmOlshop'
										placeholder='Masukan nama online shop'
										label='Nama Online Shop'
										value={data.nmOlshop}
										labelStyle={styles.label}
										onChangeText={this.onChangeOlshop}
										size='small'
										onSubmitEditing={() => this.refs.namaPanggilan.focus() }
									/>
									<Input
								    	ref='namaPanggilan'
										placeholder='Masukan nama panggilan'
										label='Nama Panggilan'
										value={data.namaPanggilan}
										labelStyle={styles.label}
										onChangeText={this.onChangeNama}
										size='small'
										onSubmitEditing={() => this.refs.noHp.focus() }
									/>
									<Input
								    	ref='noHp'
										placeholder='628/08 XXXX'
										label='Nomor Hp *'
										value={data.noHp}
										labelStyle={styles.label}
										onChangeText={this.onChangePhone}
										keyboardType='numeric'
										size='small'
										onSubmitEditing={() => this.refs.npwp.focus() }
									/>
									<Input
									  ref='npwp'
									  label='NPWP'
									  labelStyle={styles.label}
									  placeholder='Masukan nomor NPWP'
									  value={data.npwp}
									  onChangeText={this.onChangeNpwp}
									  size='small'
									  onSubmitEditing={() => this.refs.email.focus() }
									/>
									<Input
									  value={data.email}
									  ref='email'
									  label='Email'
									  labelStyle={styles.label}
									  placeholder='example@example.com'
									  onChangeText={this.onChangeEmail}
									  size='small'
									  onSubmitEditing={() => this.refs.imei.focus() }
									/>
									<Input
									  value={data.imei}
									  label='IMEI phone'
									  placeholder='Masukan imei smartphone anda'
									  keyboardType='numeric'
									  labelStyle={styles.label}
									  onChangeText={this.onChangeImei}
									  ref='imei'
									  size='small'
									  onSubmitEditing={() => this.refs.kodepos.focus() }
									/>
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
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataktp: state.register
	}
}


export default connect(mapStateToProps, null)(RegistrasiKtp);
import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Image, Platform, AsyncStorage, StatusBar } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { connect } from "react-redux";
import styles from "./styles";
import { Input, Button, Icon, TopNavigation, TopNavigationAction, CheckBox } from '@ui-kitten/components';
import Loader from "../../Loader";
import { convertDate } from "../../utils/helper";
import { registerKtp, saveRegister } from "../../../actions/register";
import Modal from "../../Modal";
import IsMemberForm from "./IsMemberForm";
import NotMemberForm from "./NotMemberForm";
import api from "../../api";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='black'/>
);


const ValidateForm = ({ onValidate, onChangeValidate, textValue, errors, fullName, isMember, onChangeIsMember }) => (
	<React.Fragment>
		<Input
			label='Validasi'
			placeholder='Masukan nama ibu kandung anda disinii'
			labelStyle={styles.labelRed}
			value={textValue}
			onChangeText={onChangeValidate}
			autoFocus
			status={errors.validate && 'danger' }
			onSubmitEditing={() => onValidate(textValue)}
		/>
		{ errors.validate && <Text style={styles.labelErr}>{errors.validate}</Text> }
		<Input
			placeholder='Nama Lengkap'
			label='Nama'
			labelStyle={styles.label}
			value={fullName}
			disabled={true}
		/>
		<CheckBox
	        status='info'
	        text='Registrasi sebagai pebisol/member'
	        checked={isMember}
	        onChange={onChangeIsMember}
	    />
		<Button style={styles.button} onPress={() => onValidate(textValue)}>Validasi</Button>
	</React.Fragment>
);	

class RegistrasiKtp extends React.Component{
	nmOlshopRef = React.createRef();
	namaPanggilanRef = React.createRef();
	noHpRef = React.createRef();
	npwpRef = React.createRef();
	emailRef = React.createRef();
	kodeposRef = React.createRef();
	
	state = {
		'validateMother': {
			text: '',
			success: false,
			loading: false
		},
		isMember: false,
		bug: {},
		loading: false,
		modal: true,
		visible: false,
		saved: null,
		responseText: '',
		resError: {}
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

			this.props.registerKtp(payload)
				.then(res => {
					console.log(res);
					const { response_data1 } = res;
					const x = response_data1.split('|');
					const toSave = {
						userid: x[0],
						username: x[1],
						pinMd5: x[2],
						nama: x[3],
						nohp: x[4],
						email: x[5],
						kecamatan: ktp.kec,
						provinsi: ktp.prov,
						kelurahan: ktp.desa 
					};

					this.saveToStorage(toSave)
						.then(() => {
							this.setState({ 
								loading: false, 
								errorsState: {}, 
								visible: false, 
								saved: 200,
								responseText: res.desk_mess
							});
							//save to redux store
							this.props.saveRegister(toSave);
						}).catch(err => alert("failed saving data to storage"));

				})
				.catch(err => {
					console.log(err);
					this.setState({ 
						loading: false, 
						errorsState: {
							global: `${err.desk_mess} \nTerdapat kesalahan saat registrasi. Harap cobalagi nanti`
						}, 
						visible: true 
					})
				})
		}else{
			this.usernameRef.current.focus();
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

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmitIsMember = (data) => {
		this.setState({ loading: true });
		const { ktp } 	= this.props.dataktp;
		const tglLahir 	= convertDate(ktp.birtDate);
		const gender 	= ktp.gender === 'Perempuan' ? 'W' : 'P';
		const param1	= `-|-|${ktp.fullname}|${data.namaPanggilan}|${data.noHp}|${data.email}|${data.npwp}|${data.imei}`;
		const param2 	= `${ktp.birthPlace}|${tglLahir}|${gender}|${data.kepercayaan}|${data.pekerjaan}|${data.status}|1|${ktp.nik}|30/12/2050|${ktp.alamat}|${ktp.rt}|${ktp.rw}|${ktp.desa}|${ktp.kec}|${ktp.city}|${ktp.prov}|${data.kodepos}|${data.tujuan}|${data.sumber}|${data.penghasilan}|${ktp.motherName}`;
		const param3 	= `${data.nmOlshop}|-|${ktp.alamat}|${ktp.desa}|${ktp.kec}|${ktp.city}|${ktp.prov}|${data.kodepos}`;
		const payload	= {
			params1: param1,
			params2: param2,
			params3: param3
		}

		this.props.registerKtp(payload)
		.then(res => {
			const { response_data1 } = res;
			const x = response_data1.split('|');
			const toSave = {
				userid: x[0],
				username: x[1],
				pinMd5: x[2],
				nama: x[3],
				nohp: x[4],
				email: x[5]
			};

			this.saveToStorage(toSave)
				.then(() => {
					this.setState({ 
						loading: false, 
						visible: false, 
						saved: 200,
						responseText: res.desk_mess,
						resError: {}
					});
					//save to redux store
					this.props.saveRegister(toSave);
				}).catch(err =>{
					alert("failed saving data to storage");
					this.setState({ loading: false });
				});

		})
		.catch(err => {
			console.log(err);
			this.setState({ 
				loading: false, 
				resError: {
					global: `${err.desk_mess} \nTerdapat kesalahan saat registrasi. Harap cobalagi nanti`
				}, 
				visible: true 
			})
		})
	}

	onSubmitNonMember = (e) => {
		const { ktp } 	= this.props.dataktp;
		const payload = {
			param1: `-|-|${ktp.fullname}|${e.namaPanggilan}|${e.noHp}|${e.email}|-|${e.imei}`,
			param2: '',
			param3: `||${ktp.alamat}|${ktp.desa}|${ktp.kec}|${ktp.city}|${ktp.prov}|${e.kodePos}`,
			param4: `${ktp.nik}`
		};
		this.setState({ loading: true });
		api.registrasi.registrasiNonMember(payload)
			.then(res => {
				const { response_data1 } = res;
				const x = response_data1.split('|');
				const toSave = {
					userid: x[0],
					username: x[1],
					pinMd5: x[2],
					nama: x[3],
					nohp: x[4],
					email: x[5]
				};
				this.saveToStorage(toSave)
					.then(() => {
						this.setState({ 
							loading: false, 
							visible: false, 
							saved: 200,
							responseText: res.desk_mess,
							resError: {}
						});
						this.props.saveRegister(toSave);
					}).catch(err => {
						alert(`Gagal menyimpan cache, silahkan ke menu pulihkan akun dengan useriid anda adalah ${toSave.userid}`);
						this.setState({ loading: false });
					})
			}).catch(err => {
				if (err.desk_mess) {
					this.setState({ 
						loading: false, 
						resError: {
							global: `${err.desk_mess}`
						}, 
						visible: true 
					});
				}else{
					this.setState({ 
						loading: false, 
						resError: {
							global: `Terdapat kesalahan saat registrasi. Harap cobalagi nanti`
						}, 
						visible: true 
					});
				}
			})
	}

	render(){
		const { ktp } = this.props.dataktp;
		const { validateMother, bug, loading, saved, resError } = this.state;
		// console.log(ktp);
		return(
			<View style={{flex: 1}}>
				<Loader loading={loading} />
				{ saved === 200 && 
					<Modal 
						loading={true}
						text={this.state.responseText}
						handleClose={() => {
							this.setState({ saved: null });
							this.props.navigation.navigate({
								routeName: 'Home'
							});
						}}
					/> }

				{ resError.global && 
					<Modal 
						loading={this.state.visible} 
						text={resError.global} 
						handleClose={() => this.setState({ visible: false })}
					/> }

				<React.Fragment>
					<MyStatusBar/>
					<TopNavigation
					    leftControl={this.BackAction()}
					    title='Registrasi'
					    subtitle={this.props.navigation.state.params.judulHeader}
					    alignment='start'
					    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
					    subtitleStyle={{color: 'black'}}
					    style={{backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}}
					/>
				</React.Fragment>

				<KeyboardAvoidingView 
					behavior="padding" 
					enabled
					style={{flex:1}}
				>
				<ScrollView>
					{Object.keys(ktp).length > 0 && 
						<View style={{padding: 10}}>
							{ !validateMother.success ? 
								<ValidateForm 
									onValidate={this.onValidate}
									onChangeValidate={this.onChange}
									textValue={validateMother.text}
									errors={bug}
									fullName={ktp.fullname}
									isMember={this.state.isMember}
									onChangeIsMember={() => this.setState({ isMember: !this.state.isMember })}
								/> :  
								<React.Fragment>
									{ this.state.isMember ? 
										<IsMemberForm 
											onSubmit={this.onSubmitIsMember}
										/>  : <NotMemberForm onSubmit={this.onSubmitNonMember} /> }
								</React.Fragment>
							}
						</View> }
				</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataktp: state.register
	}
}


export default connect(mapStateToProps, { registerKtp, saveRegister })(RegistrasiKtp);
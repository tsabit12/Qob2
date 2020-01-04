import React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, AsyncStorage } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import api from "../api";
import Modal from "../Modal";
import Dialog from "react-native-dialog";

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
)

class LupaPin extends React.Component{

	useridRef = React.createRef();
	namaRef = React.createRef();
	nohpRef = React.createRef();
	emailRef = React.createRef();

	state = {
		data: {
			userid: '',
			nama: '',
			nohp: '',
			email: ''
		},
		errors: {},
		loading: false,
		success: {
			status: false,
			message: ''
		},
		visible: false
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });

			const { data } 	= this.state;
			let jenis		= 1;
			const payload = {
				param1: `${data.userid}|${data.nama}|${data.nohp}|${data.email}|12345678|${jenis}`	
			};
			api.registrasi.lupaPin(payload)
				.then(res => {
					// console.log(res);
					//console.log("oke");
					this.setState({ loading: false, visible: true, success: { status: true, message: res.desk_mess }});
				}).catch(err => {
					if (Object.keys(err).length === 10) {
						this.setState({ loading: false, errors: { global: err.desk_mess } });
					}else{
						this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
					}
				})
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.userid) errors.userid = "Masukan userid";
		if (!data.nama) errors.nama = "Masukan nama";
		if (!data.nohp) errors.nohp = "Masukan nomor handphone";
		if (!data.email) errors.email = "Masukan email";
		return errors;
	}

	async getUserLocal(){
		try{
			const value = await AsyncStorage.getItem('qobUserPrivasi');
			return Promise.resolve(value);
		}catch(err){
			return Promise.reject(err);
		}
	}

	onBackHome = () => {
		this.setState({ visible: false });
		this.props.navigation.navigate({
			routeName: 'Home'
		})
	}

	render(){
		const { data, errors, loading, success, visible } = this.state;
		return(
			<KeyboardAvoidingView 
				behavior="padding"
				style={{flex:1, marginTop: 30}} 
				enabled
				// keyboardVerticalOffset = {40}
			>
				<ScrollView>
					{ success.status && 
						<MessageSucces 
							message={success.message} 
							visible={visible} 
							onPress={() => this.setState({ visible: false })}
							backHome={this.onBackHome}
						/> }
					<Loader loading={loading} />
					{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
					<SafeAreaView style={styles.container}>
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
						<Button status='danger' onPress={this.onSubmit}>Pulihkan</Button>
					</SafeAreaView>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}


export default LupaPin;

const styles = StyleSheet.create({
	container: {
	  // marginTop: Expo.Constants.statusBarHeight
	  justifyContent: 'center',
	  flex: 1,
	  padding: 20,
	  // backgroundColor: '#FFFFF0'
	},
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
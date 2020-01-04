import React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, AsyncStorage } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import api from "../api";

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
		loading: false
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onSubmit = () => {
		// this.getUserLocal()
		// 	.then(res => {
		// 		const 
		// 	})
		// 	.catch(err => alert("Opps"));
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			api.registrasi.lupaPin(this.state.data)
				.then(res => {
					// console.log(res);
					this.setState({ loading: false });
				}).catch(err => {
					console.log(err);
					this.setState({ loading: false });
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

	render(){
		const { data, errors, loading } = this.state;
		return(
			<KeyboardAvoidingView 
				behavior="padding"
				style={{flex:1, marginTop: 30}} 
				enabled
				// keyboardVerticalOffset = {40}
			>
				<ScrollView>
					<Loader loading={loading} />
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
import React from "react";
import { View, Text } from "react-native";
import { Input, Button } from '@ui-kitten/components';
import styles from "./styles";
import Constants from 'expo-constants';

class NotMemberForm extends React.Component{
	namaPanggilanRef = React.createRef();
	noHpRef = React.createRef();
	emailRef = React.createRef();
	kodePosRef = React.createRef();

	state = {
		data: {
			namaPanggilan: '',
			noHp: '',
			email: '',
			imei: Constants.deviceId,
			kodePos: ''
		},
		errors: {}
	}

	onChangeText = (e, ref) => {
		const { current: {props: { name }}} = ref;
		this.setState({ data: { ...this.state.data, [name]: e }})
	} 

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.onSubmit(this.state.data);
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.noHp) errors.noHp = "Nomor handphone tidak boleh kosong";
		if (!data.email) errors.email = "Email tidak boleh kosong";
		if (!data.namaPanggilan) errors.namaPanggilan = "Nama panggilan tidak boleh kosong";
		if (!data.kodePos){
			errors.kodePos = "Kodepos tidak boleh kosong";
		}else{
			const regexPos = /^\d{5}([\-]\d{4})?$/;
			if (!data.kodePos.match(regexPos)) errors.kodePos = "Kodepos tidak valid";
		}
		
		return errors;
	}



	render(){
		const { data, errors } = this.state;
		return(
			<View style={{borderWidth: 0.6, padding: 5, borderRadius: 5, borderColor: '#d5d7db'}}>
				<Input
			    	ref={this.namaPanggilanRef}
			    	name='namaPanggilan'
					placeholder='Masukan nama panggilan'
					label='Nama Panggilan'
					value={data.namaPanggilan}
					labelStyle={styles.label}
					onChangeText={(e) => this.onChangeText(e, this.namaPanggilanRef)}
					status={errors.namaPanggilan && 'danger'}
					caption={errors.namaPanggilan && `${errors.namaPanggilan}`}
					onSubmitEditing={() => this.noHpRef.current.focus() }
				/>
				<Input
			    	ref={this.noHpRef}
					placeholder='628/08 XXXX'
					label='Nomor Hp'
					name='noHp'
					value={data.noHp}
					labelStyle={styles.label}
					onChangeText={(e) => this.onChangeText(e, this.noHpRef)}
					keyboardType='phone-pad'
					status={errors.noHp && 'danger'}
					caption={errors.noHp && `${errors.noHp}`}
					onSubmitEditing={() => this.emailRef.current.focus() }
				/>
				{ data.noHp.length > 0 && !!errors.noHp === false && <Text style={{fontSize: 12, color: 'blue', marginTop: -5}}>Harap pastikan bahwa nomor handphone anda sudah terhubung dengan whats'app </Text>}
				<Input
				  ref={this.emailRef}
				  value={data.email}
				  name='email'
				  label='Email'
				  labelStyle={styles.label}
				  placeholder='example@example.com'
				  onChangeText={(e) => this.onChangeText(e, this.emailRef)}
				  status={errors.email && 'danger'}
				  onSubmitEditing={() => this.kodePosRef.current.focus() }
				  caption={errors.email && `${errors.email}`}
				/>
				<Input
				  ref={this.kodePosRef}
				  value={data.kodePos}
				  name='kodePos'
				  label='Kodepos'
				  keyboardType='phone-pad'
				  labelStyle={styles.label}
				  placeholder='Masukan kodepos'
				  onChangeText={(e) => this.onChangeText(e, this.kodePosRef)}
				  status={errors.kodePos && 'danger'}
				  caption={errors.kodePos && `${errors.kodePos}`}
				/>
				<Button 
					style={styles.button}
					onPress={this.onSubmit}
				>Daftar</Button>
			</View>
		);	
	}
}

export default NotMemberForm;
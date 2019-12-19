import React from "react";
import { View, StyleSheet, Image, Modal } from "react-native";
import { Input, Text, Button, Spinner } from '@ui-kitten/components';
import api from "../../api";

class RegisterUsername extends React.Component{
	state = {
		data: {
			username: '',
			password: '',
			rekening: ''
		},
		errors: {},
		secureTextEntry: true,
		loading: false,
		isNotGiro: false,
		message: ''
	}

	onChangeUsername = (e) => this.setState({ data: {...this.state.data, username: e }})
	onChangePassword = (e) => this.setState({ data: {...this.state.data, password: e }})
	onChangeRek = (e) => this.setState({ data: {...this.state.data, rekening: e }})

	onIconPress = () => {
		const { secureTextEntry } = this.state;
		if (secureTextEntry) {
			this.setState({ secureTextEntry: false });
		}else{
			this.setState({ secureTextEntry: true });
		}
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

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors, message: '', isNotGiro: false });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			if (!this.state.data.rekening) {
				this.props.submit(this.state.data);
			}else{ //validasi rekening
				api.registrasi.validasiRekening(this.state.data.rekening)
					.then(res => {
						if (res.rc_mess === '00') {
							this.setState({ loading: false });
						}else{
							this.setState({ 
								loading: false, 
								message: 'Data rekening tidak ditemukan. Jika anda belum memiliki akun giro harap lengkapi data dibawah ini',
								isNotGiro: true 
							});
						}

					})
					.catch(err => console.log(err))
			}
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.username) errors.username = "Username tidak boleh kosong";
		if (!data.password) errors.password = "Password tidak boleh kosong";
		return errors;
	}

	handleCancel = () => this.setState({ isNotGiro : false })

	render(){
		const { data, secureTextEntry, errors, loading, isNotGiro, message } = this.state;
		return(
			<View>
				<Modal 
					visible={loading}
					transparent={true}
					animationType={'none'}
				>
					<View style={styles.modalBackground}>
						<Spinner size='giant' status='basic'/>
					</View>
				</Modal>
				<Input
			    	ref='noRek'
					placeholder='Masukan no rekening giro'
					label='Rekening Giro (Jika ada)'
					labelStyle={{color: 'black'}}
					value={data.rekening}
					style={styles.input}
					keyboardType='numeric'
					onChangeText={this.onChangeRek}
					onSubmitEditing={() => this.refs.username.focus() }
				/>
				<Input
			    	ref='username'
					placeholder='Masukan username'
					labelStyle={{color: 'red'}}
					label='Username*'
					value={data.username}
					style={styles.input}
					onChangeText={this.onChangeUsername}
					status={errors.username && 'danger' }
					onSubmitEditing={() => this.refs.password.focus() }
				/>
				{ errors.username && <Text style={{color: 'red'}}>{errors.username}</Text>}
				<Input
				  value={data.password}
				  labelStyle={{color: 'red'}}
				  label='Password *'
				  ref='password'
				  placeholder='********'
				  icon={this.renderIcon}
				  secureTextEntry={secureTextEntry}
				  onIconPress={this.onIconPress}
				  style={styles.input}
				  status={errors.password && 'danger' }
				  onChangeText={this.onChangePassword}
				/>
				{ errors.password && <Text style={{color: 'red'}}>{errors.password}</Text>}

				{ isNotGiro && <View style={styles.alternativeContainer}>
					<Text style={styles.text}>{message}</Text>
				</View> }

				<Button style={styles.button} size='medium' onPress={this.onSubmit}>Daftar</Button>

			</View>
		);
	}
} 

const styles = StyleSheet.create({
  input: {
  	paddingTop: 7
  },
  button: {
    marginTop: 8,
  },
  text: {
    margin: 8,
    color: 'black'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  alternativeContainer: {
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: '#D3D3D3',
  },
});


export default RegisterUsername;
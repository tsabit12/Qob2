import React from "react";
import { View, Text, StatusBar, StyleSheet, KeyboardAvoidingView, AsyncStorage } from "react-native";
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction, Button, Input } from '@ui-kitten/components';
import { connect } from "react-redux";
import Loader from "../Loader";
import { updatePin } from "../../actions/user";
import md5 from "react-native-md5";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const RenderMessageErr = ({ message }) => (
	<View style={{minHeight: 50, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
		<Text style={{textAlign: 'center', color: 'white'}}>{message}</Text>
	</View>
);

const RenderSuccess = ({ message }) => (
	<View style={{minHeight: 50, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
		<Text style={{textAlign: 'center', color: 'white'}}>{message}</Text>
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


class ChangePinScreen extends React.Component{
	newPinRef = React.createRef();
	pinConfirmRef = React.createRef();

	state = {
		data: {
			newPin: '',
			pinConfirm: ''
		},
		errors: {},
		loading: false,
		succes: false
	}
	

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onChange = (e, name) => this.setState({ data: { ...this.state.data, [name]: e}, errors: {...this.state.errors, [name]: undefined }})

	onSubmit = () => {
		const { dataLogin } = this.props;
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { newPin } 	= this.state.data; 
			const { detail } 	= dataLogin;
			const rumusPin  	= md5.hex_md5(dataLogin.userid+newPin+detail.nohp+detail.email+Constants.deviceId+'8b321770897ac2d5bfc26965d9bf64a1')
			const payload 		= `${dataLogin.userid}|${rumusPin}`;

			this.setState({ loading: true, succes: false });
			//replace storage
			const saveToLocal 	= {
				userid: dataLogin.userid,
				username: '-',
				nama: dataLogin.detail.nama,
				nohp: dataLogin.detail.nohp,
				email: dataLogin.detail.email
			};
			
			this.props.updatePin(payload, newPin, saveToLocal, rumusPin)
				.then(() => this.setState({ 
					loading: false, 
					succes: true,
					data: {
						...this.state.data,
						newPin: '',
						pinConfirm: ''
					}
				}))
				.catch(err => {
					if (err.desk_mess) {
						this.setState({ loading: false, errors: { global: err.desk_mess } });
					}else{
						this.setState({ loading: false, errors: { global: 'Terdapat kesalahan, harap cobalagi' } });
					}
				})

		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.newPin) errors.newPin = "Pin baru harap diisi";
		if (!data.pinConfirm) errors.pinConfirm = "Konfirmasi pin harap diisi";
		if (data.pinConfirm) {
			if (data.pinConfirm !== data.newPin) errors.pinConfirm = "Pin tidak valid";
		}
		return errors;
	}

	render(){
		const { data, errors, loading, succes } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />			
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Ubah PIN'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				/>
				<Loader loading={loading} />
				<KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
					<View style={styles.container}>
						<View style={styles.card}>
							{errors.global && <RenderMessageErr message={errors.global} />}
							{succes && <RenderSuccess message='Sukses mengubah PIN' />}
							<Input 
								ref={this.newPinRef}
								name='newPin'
								label='PIN baru'
								labelStyle={styles.label}
								style={styles.input}
								value={data.newPin}
								placeholder='Masukkan pin baru'
								maxLength={6}
								secureTextEntry={true}
								onChangeText={(e) => this.onChange(e, 'newPin')}
								keyboardType='decimal-pad'
								returnKeyType='next'
								onSubmitEditing={() => this.pinConfirmRef.current.focus()}
								status={errors.newPin && 'danger'}
								caption={errors.newPin && `${errors.newPin}`}
							/>
							<Input 
								ref={this.pinConfirmRef}
								name='pinConfirm'
								label='Konfirmasi PIN baru'
								labelStyle={styles.label}
								style={styles.input}
								value={data.pinConfirm}
								placeholder='Masukkan kembali pin baru'
								maxLength={6}
								secureTextEntry={true}
								keyboardType='decimal-pad'
								onChangeText={(e) => this.onChange(e, 'pinConfirm')}
								onSubmitEditing={this.onSubmit}
								status={errors.pinConfirm && 'danger'}
								caption={errors.pinConfirm && `${errors.pinConfirm}`}
							/>
							<Button onPress={this.onSubmit}>Simpan</Button>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(240, 132, 0)'
  	},
  	container: {
  		flex: 1,
  		justifyContent: 'center',
  		alignItems: 'center',
  		margin: 10
  	},
  	card: {
  		borderWidth: 0.6,
  		width: '100%',
  		padding: 10,
  		borderRadius: 10,
  		borderColor: '#8c8b8b'
  	},
  	label: {
	  	color: 'black',
	  	fontSize: 15,
	  	fontFamily: 'open-sans-reg'
	},
	input: {
	  	paddingBottom: 7
	},
})

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { updatePin })(ChangePinScreen);
import React from "react";
import { View, Text, StyleSheet, StatusBar, Alert } from "react-native";
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction, Input, Button } from '@ui-kitten/components';
import Loader from "../Loader";
import api from "../api";
import { connect } from "react-redux";
import { updateLoginSes } from "../../actions/auth";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const RenderNotif = ({ response, onChenge, pin, errors, onValidate }) => (
	<View style={{flex: 1, padding: 5 }}>
		<View style={{backgroundColor: '#c7e4eb', borderRadius: 3, height: 60, justifyContent: 'center', alignItems: 'center' }}>
			<Text>{response.message}</Text>
		</View>
		<View style={{marginTop: 10}}>
			<Input 
				name=''
				value={pin}
				placeholder="Masukan kode verifikasi"
				label='Kode Verifikasi'
				labelStyle={{fontFamily: 'open-sans-reg', fontSize: 15, color: 'black'}}
				onChangeText={(e) => onChenge(e)}
				keyboardType='phone-pad'
				status={errors.pin && 'danger'}
				caption={errors.pin && `${errors.pin}`}
			/>
			<Button onPress={() => onValidate()}>Validasi</Button>
		</View>
	</View>
);


class ValidasiRekening extends React.Component{
	noRekRef = React.createRef();

	state = {
		noRek: '',
		errors: {},
		loading: false,
		responseRek: {},
		pin: ''
	}

	// componentDidMount(){
	// 	console.log(this.props.userid);
	// }

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = () => {
		const errors = this.validate(this.state.noRek);
		this.setState({ errors })
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			api.search.rekeningBaru(this.state.noRek, this.props.userid)
				.then(res => {
					// console.log(res);
					const { desk_mess, response_data1 } = res;
					const values = response_data1.split('|');
					//3 kali salah anda pembohong
					this.setState({ 
						loading: false,
						responseRek: {
							userid: values[0],
							nomorRekening: values[1],
							pin: values[2],
							message: desk_mess
						}
					});
				})
				.catch(err => {
					this.setState({ loading: false });
					if (err.desk_mess) { //handle undefined
						Alert.alert(
						  'Opppps!',
						  `${err.desk_mess}`,
						  [
						    {text: 'Ok'},
						  ],
						  {cancelable: false},
						);
					}else{
						Alert.alert(
						  'Opppps!',
						  'Internal Server Errors',
						  [
						    {text: 'Ok'},
						  ],
						  {cancelable: false},
						);
					}
				})
		}
	}

	validate = (noRek) => {
		const errors = {};
		if (!noRek) errors.noRek = "Masukan nomor rekening";
		return errors;
	}

	onChengePin = (values) => this.setState({ pin: values })

	onSucces = (nomorRekening, saldo) => {
		this.props.updateLoginSes(nomorRekening, saldo);
		setTimeout(() => {
			this.props.navigation.push('IndexMenu');
		}, 100);	
	}

	onValidate = () => {
		const errors = this.validatePin(this.state.pin);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			api.search.validateGiro(this.state.responseRek)
				.then(res => {
					const { response_data1, response_data5 } = res;
					// console.log(res);
					this.setState({ loading: false });
					Alert.alert(
					  'Berhasil',
					  'Akun giro berhasil dihubungkan',
					  [
					    {text: 'Tutup', onPress: () => this.onSucces(response_data1, response_data5)},
					  ],
					  {cancelable: false},
					);
				})
				.catch(err => {
					this.setState({ loading: false });
					if (err.desk_mess) {
						Alert.alert(
						  'Opppps!',
						  `${err.desk_mess}`,
						  [
						    {text: 'Ok'},
						  ],
						  {cancelable: false},
						);
					}else{
						Alert.alert(
						  'Opppps!',
						  'Internal Server Errors',
						  [
						    {text: 'Ok'},
						  ],
						  {cancelable: false},
						);
					}
				})
		}
	}

	validatePin = (pin) => {
		const errors = {};
		const { responseRek } = this.state;
		if (!pin) {
			errors.pin = "Masukan kode verifikasi";
		}else{
			if (pin !== responseRek.pin) errors.pin = "Kode verifikasi tidak valid";
		}
		return errors;
	}



	render(){
		const { errors, responseRek } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Hubungkan Akun Giro'
				    subtitle='Validasi rekening'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    subtitleStyle={{color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				/>
				<View style={{flex: 1, margin: 10}}>
					<Loader loading={this.state.loading} />
					{ Object.keys(responseRek).length > 0 ? 
						<RenderNotif 
							response={responseRek} 
							pin={this.state.pin} 
							onChenge={this.onChengePin} 
							errors={errors}
							onValidate={this.onValidate}
						/> :  <React.Fragment>
							<Input 
								ref={this.noRekRef}
								name='noRek'
								value={this.state.noRek}
								placeholder="Masukan nomor rekening giro"
								label='Rekening'
								labelStyle={{fontFamily: 'open-sans-reg', fontSize: 15, color: 'black'}}
								onChangeText={(e) => this.setState({ noRek: e })}
								onSubmitEditing={this.onSubmit}
								keyboardType='phone-pad'
								status={errors.noRek && 'danger'}
								caption={errors.noRek && `${errors.noRek}`}
							/>
							<Button onPress={this.onSubmit} style={{marginTop: 5}}>Hubungkan</Button>
						</React.Fragment> }
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
	    flex: 1,
	    justifyContent : 'center'
	},
	StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)'
    }
})

function mapStateToProps(state) {
	return{
		userid: state.auth.dataLogin.userid
	}
}

export default connect(mapStateToProps, { updateLoginSes })(ValidasiRekening);
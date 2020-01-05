import React from "react";
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { Text } from '@ui-kitten/components';
import api from "../api";
import { StyleSheet, View, Image, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { Button, Input } from '@ui-kitten/components';
import Loader from "../Loader";
import Modal from "../Modal";
class Home extends React.Component {
	static navigationOptions = {
		headerMode: 'none',
		header: null
	};

	state = {
		pin: '',
		loading: false,
		errors: {},
		localUser: {}
	}

	pinRef = React.createRef();

	async componentDidMount(){
		const value = await AsyncStorage.getItem('qobUserPrivasi');
		const toObje = JSON.parse(value);
		console.log(toObje);
		if (!value) { //handle null
			this.setState({
				localUser: {
					email: '-',
					nama: '-',
					nohp: '-',
					pin: '-',
					userid: '-',
					username: '-'
				}
			});
		}else{
			this.setState({
				localUser: {
					email: toObje.email,
					nama: toObje.nama,
					nohp: toObje.nohp,
					pin: toObje.pin,
					userid: toObje.userid,
					username: toObje.username
				}
			});
		}
		// let id = Constants.deviceId;
		// console.log(id);
	}

	onChange = (e, { name }) => this.setState({ [name]: e })

	onSubmit = () => {
		// this.props.navigation.navigate({
		// 	routeName: 'IndexSearch'
		// })
		const errors = this.validate(this.state.pin);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			const { userid, nohp, email  } = this.state.localUser;
			const payload = {
				param1: `${userid}|${this.state.pin}|085220135077|ikhsan.fanani@gmail.com|123456|0000000018`
			};
			api.auth.login(payload)
				.then(res => {
					this.setState({ loading: false });
					console.log(res);
				})
				.catch(err => {
					// console.log(err);
					setTimeout(() => {
						this.props.navigation.navigate({
							routeName: 'IndexSearch'
						});
					}, 1000);

					if (Object.keys(err).length === 10) { //handle undefined
						this.setState({ loading: false, errors: {global: err.desk_mess } });
					}else{
						this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, harap cobalagi nanti'}});
					}
				});
		}
	}

	validate = (pin) => {
		const errors = {};
		if (!pin) errors.pin = "PIN tidak boleh kosong";
		return errors;
	}

	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 
    	const { errors, loading, localUser } = this.state;

		return (
			<SafeAreaView style={styles.container}>
				<Loader loading={loading} />
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} />}
				<Image source={require('../../assets/logoQOB.png')} 
				style={{width: 125, height: 125, resizeMode: 'stretch', 
				alignSelf: 'center', marginBottom: 40}}/>
				
				<Input 
					placeholder='Masukan PIN'
					ref={this.pinRef}
					size='medium'
					style={styles.input}
					maxLength={6}
					name='pin'
					keyboardType='numeric'
					status={errors.pin && 'danger'}
					onChangeText={(e) => this.onChange(e, this.pinRef.current.props)}
					onSubmitEditing={this.onSubmit}
					secureTextEntry={true}
				/>
				{ errors.pin && <Text style={{fontSize: 12, color: 'red', marginTop: -10}}>{errors.pin}</Text> }
				<Button status='info' size='medium' onPress={this.onSubmit}>MASUK</Button>
				<Text 
					style={{color: 'blue', paddingTop: 5}}
					onPress={() => this.props.navigation.navigate({
						routeName: 'LupaPin'
					})}
				>Lupa pin saya</Text>
				<View style={styles.link}>
					<Text>Belum memiliki akun ? daftar </Text>
					<Text 
						style={{color: 'blue'}}
						onPress={() => this.props.navigation.navigate({
			        		routeName: 'IndexRegister'
			        	})}	
					>disini</Text>
				</View>
		   	</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  // marginTop: Expo.Constants.statusBarHeight
	  justifyContent: 'center',
	  padding: 20
	},
	input: {
		paddingBottom: 5,
		paddingTop: 5
	},
	link: {
		flexDirection: 'row'
	},
	title: {
		paddingBottom: 20,
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 20
	}
  });
  
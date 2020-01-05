// const response = '440000347|8a266d4bad3552473f2de193283a59c5|IKHSAN FANANI|085220135077|Ikhsan.fanani@gmail.com|12345678|0000000018';
// let parsing = response.split('|');
// const payload = {
// 	userid: parsing[0],
// 	pin: parsing[1],
// 	nama: parsing[2],
// 	nohp: parsing[3],
// 	email: parsing[4],
// 	imei: parsing[5],
// 	norek: parsing[6],
// };
// this.saveToStorage(payload)
// 	.then(() => console.log("oke"))
// 	.catch(err => console.log(err));
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
		if (!value) { //handle null
			this.setState({
				localUser: {
					email: '-',
					nama: '-',
					nohp: '-',
					pin: '-',
					userid: '-',
					imei: '-',
					norek: '-'
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
					imei: toObje.imei,
					norek: toObje.norek
				}
			});
		}
		// let id = Constants.deviceId;
		// console.log(id);
	}

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
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
			const { userid, nohp, email, imei, norek  } = this.state.localUser;
			const payload = {
				param1: `${userid}|${this.state.pin}|${nohp}|${email}|${imei}|${norek}`
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
  
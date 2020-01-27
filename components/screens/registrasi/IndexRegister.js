import React from "react";
import { View, StatusBar, Keyboard, Image, Dimensions, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import {Text, Button, ButtonGroup } from '@ui-kitten/components';
import styles from "./styles";
import { SafeAreaView } from 'react-navigation';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { searchKtp } from "../../../actions/register";
import Modal from "../../Modal";
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const device = Dimensions.get('window').width;

const MyStatusBar = () => (
	<View style={{
		height: Constants.statusBarHeight,
	  	backgroundColor: '#ed5007'
	}}>
		<StatusBar translucent barStyle="dark-content" />
	</View>
);

class IndexRegister extends React.Component{
	static navigationOptions = {
		// headerTitle: <Judul/>,
		headerTitle: null,
		headerMode: 'none',
		header: null
	};

	state = {
		nik: '',
		success: false,
		errors: {},
		loading: false,
		checked: false,
		visible: false,
		keyboardOpen: false,
		keyboardOffset: 0
	}

	UNSAFE_componentWillMount () {
	    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	componentWillUnmount () {
	    this.keyboardDidShowListener.remove();
	    this.keyboardDidHideListener.remove();
	}

	keyboardDidShow = (event) => this.setState({ 
		keyboardOpen: true, 
		errors:{...this.state.errors, nik: undefined },
		keyboardOffset: event.endCoordinates.height 
	})

	keyboardDidHide = () => this.setState({ keyboardOpen: false, keyboardOffset: 0 })


	onChange = (e) => this.setState({ nik: e })

	onSearchKtp = () => {
		const errors = this.validate(this.state.nik);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.searchKtp(this.state.nik)
				.then(() => {
					this.props.navigation.navigate({
						routeName: 'RegistrasiKtp',
						params: {
							judulHeader: this.state.nik
						}
					});
					this.setState({ loading: false })
				})
				.catch(err => {
					this.setState({ errors: {global: 'Data tidak ditemukan'}, visible: true, loading: false });
					console.log(err);
				})
		}
	}

	validate = (nik) => {
		const errors = {};
		if (!nik) errors.nik = "Nomor ktp belum dilengkapi";
		return errors;
	}

	onCheckedChange = () => {
		if (!this.state.checked) {
			this.setState({ checked: true });
		}else{
			this.setState({ checked: false });
		}
	}

	render(){
		// console.log(this.props.detail);
		const { nik, success, errors, loading, keyboardOpen } = this.state;
		return(
			<React.Fragment>
				<MyStatusBar />
				<Loader loading={loading} />
				
				<ImageBackground source={require('../../../assets/backgroundGradient.jpeg')} style={styles.backgroundImage}>
					{ errors.global && 
						<Modal 
							loading={this.state.visible} 
							text={errors.global} 
							handleClose={() => this.setState({ visible: false })} 
						/> }
						<View style={{flex: 1, alignItems: 'center', marginTop: 60}}>
						    <Image 
						    	source={require('../../../assets/q9/10.png')}
						    	style={{
								    width: device * 0.7,
								    height: device * 0.7 * 1.2,
								    resizeMode: 'stretch'
						    	}}
						    />
					    </View>
					    <View style={{padding: 10}}>
						    <LinearGradient
						    	colors={['#FFF', '#fffefc', '#e6e3df']}
						    	style={{
						    		flex: 1,
						    		margin: 10,
						    		borderRadius: 5,
						    		backgroundColor: '#ededed',
						    		position: 'absolute',
						    		bottom: this.state.keyboardOffset,
						    		width: '100%',
						    		padding: 10
						    	}}
						    >
								<TextInput 
									name='nik'
									id='nik'
									value={nik}
									style={{
										borderWidth: 0.6, 
										borderColor: errors.nik ? '#ff3b0f' : '#ffa600', 
										height: 40,
										fontSize: 15,
										fontFamily: 'open-sans-reg',
										color: 'black',
										borderRadius: 4,
										padding: 7
									}}
									onChangeText={this.onChange}
									keyboardType='phone-pad'
									placeholder='Masukkan nomor ktp anda'
									placeholderTextColor='#ffa600'
								/>
								<Button style={styles.button} status='warning' onPress={this.onSearchKtp}>Selanjutnya</Button>
								<TouchableOpacity
									onPress={() => {
										this.props.navigation.navigate({
							        		routeName: 'RegistrasiRek'
							        	});
							        	this.setState({ errors: {}});
									}}
									activeOpacity={0.7}
								>
									<Text style={{fontSize: 12, color: '#1361d4', fontFamily: 'Roboto-Regular'}}>Gunakan akun giro</Text>
								</TouchableOpacity>
							</LinearGradient>
						</View>
		        </ImageBackground>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		detail: state.register.ktp
	}
}	

export default connect(mapStateToProps, { searchKtp })(IndexRegister);
import React from "react";
import { View, Text, StatusBar, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView, Alert, AsyncStorage } from "react-native";
import Constants from 'expo-constants';
import NonPebisolForm from "./forms/NonPebisolForm";
import { Spinner, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import Loader from "../../Loader";
import api from "../../api";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const LoadingView = () => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
		<Spinner size='medium' />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

class NonPebisol extends React.Component{
	state = {
		form: false,
		keyboardOpen: false,
		loading: false,
		imei: Constants.deviceId
	}

	UNSAFE_componentWillMount () {
	    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	componentDidMount(){
		setTimeout(() => this.setState({ form: true }), 500);	
	}

	componentWillUnmount () {
	    this.keyboardDidShowListener.remove();
	    this.keyboardDidHideListener.remove();
	}

	keyboardDidShow = (event) => this.setState({ keyboardOpen: true })

	keyboardDidHide = () => this.setState({ keyboardOpen: false })

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (data) => {
		Alert.alert(
		  'Notifikasi',
		  'Apakah anda yakin data registrasi sudah valid?',
		  [
		  	{
		      text: 'Cancel',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Ya', onPress: () => this.onPost(data)},
		  ],
		  {cancelable: false},
		);
	}

	onPost = (data) => {
		this.setState({ loading: true });
		const namaPanggilan = data.nama.split(' ');
		const payload = {
			param1: `01|${data.nama}|${data.noHp}|${data.email}|${this.state.imei}`,
			param2: `${data.alamatUtama.toUpperCase()}|${data.provinsi.toUpperCase()}|${data.kabupaten.toUpperCase()}|${data.kecamatan.toUpperCase()}|${data.kelurahan.toUpperCase()}|${data.kodepos}`
		};
		api.registrasi.registrasiUserNonMember(payload)
			.then(res => {
				// console.log(res);
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
						this.setState({ loading: false });
						Alert.alert(
						  'Notifikasi',
						  `${res.desk_mess}`,
						  [
						    {text: 'OK', onPress: () => this.backToLogin()},
						  ],
						  {cancelable: false},
						);
					}).catch(err => {
						this.setState({ loading: false });
						Alert.alert(
						  'Oppps',
						  'Failed saving data',
						  [
						    {text: 'OK', onPress: () => console.log("presed")},
						  ],
						  {cancelable: false},
						);
					});
			}) //error api
			.catch(err => {
				this.setState({ loading: false });
				if (err.desk_mess) {
					Alert.alert(
					  'Oppps',
					  `${err.desk_mess}`,
					  [
					    {text: 'Pulihkan Akun', onPress: () => this.redirectToHelp()},
					    {text: 'Tutup', onPress: () => console.log("presed")},
					  ],
					  {cancelable: false},
					);
				}else{
					Alert.alert(
					  'Oppps',
					  'Internal Server Error, mohon cobalagi nanti',
					  [
					    {text: 'Tutup', onPress: () => console.log("presed")},
					  ],
					  {cancelable: false},
					);
				}
			})
	}

	async saveToStorage(payload){
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return Promise.resolve(payload);
		}catch(errors){
			return Promise.reject(errors);
		}
	}

	backToLogin = () => this.props.navigation.push('Home')

	redirectToHelp = () => {
		this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Pemulihan Akun',
				jenis: 2
			}
		})
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<Loader loading={this.state.loading} />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Non Pebisol'
				    title='Registrasi'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    // subtitle={this.props.navigation.state.params.namaLengkap}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ this.state.form ? 
					<KeyboardAvoidingView
						style={{flex:1}} 
						behavior="padding" 
						enabled={this.state.keyboardOpen}>
						<ScrollView keyboardShouldPersistTaps='always'>	
							<NonPebisolForm onSubmit={this.onSubmit} />
						</ScrollView>
					</KeyboardAvoidingView> : <LoadingView />}
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

export default NonPebisol;
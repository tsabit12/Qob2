import React from "react";
import { View, Text, StatusBar, TouchableOpacity, AsyncStorage, Alert } from "react-native";
import styles from "./styles";
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components';
import { curdate } from "../../utils/helper";
import { connect } from "react-redux";
import VerificationForm from "./forms/VerificationForm";
import RequestForm from "./forms/RequestForm";
import Loader from "../../Loader";
import Constants from 'expo-constants';
import api from "../../api";
import { setLocalUser } from "../../../actions/user";

const BackIcon = (style, navigation) => (
	<TouchableOpacity
		onPress={() => navigation.goBack()}
	>
  		<Icon {...style} name='arrow-back' fill='black' />
  	</TouchableOpacity>
);

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


class Pemulihan extends React.Component{
	state = {
		data: {},
		loading: false,
		jenis: this.props.navigation.state.params.jenis
	}
	
	/*handle if user was send request
	format data in storage or look like this
	[{curdate: 'YYYYMMDD', name: 'oke'},{curdate: '20200102', name: 'oke2'}] */
	async componentDidMount(){
		const value = await AsyncStorage.getItem('historyRequest');
		if (value !== null) {
			const toObj 	= JSON.parse(value);
			const getData 	= toObj.find(x => x.curdate === curdate());
			if (Object.keys(getData).length > 0) { //user was send request
				this.setState({ 
					data: {
						userid: getData.userid,
						email: getData.email,
						nama: getData.nama,
						nohp: getData.nohp
					}
				})
			}
		}
	}

	BackAction = () => (
  		<TopNavigationAction 
  			icon={(style) => BackIcon(style, this.props.navigation)}
  		/>
	)

	//last param is jenis 
	//1 = lupa pin
	//2 = pemulihan akun
	onSubmitRequest = async (payload) => {
		const param = {
			param1: `${payload.userid}|${payload.nama}|${payload.nohp}|${payload.email}|${Constants.deviceId}|${this.state.jenis}`	
		}

		this.setState({ loading: true });
		api.registrasi.lupaPin(param, payload.userid)
			.then(response => {
				console.log(response);
				//set data to show verification form
				this.setState({ 
					loading: false,
					data: {
						...payload
					}
				});
				//save request history to storage
				AsyncStorage.getItem('historyRequest')
					.then(res => {
						res = res == null ? [] : JSON.parse(res);
						res.push({
							curdate: curdate(),
							...payload
						});

						AsyncStorage.setItem('historyRequest', JSON.stringify(res))
					})
			})
			.catch(err => {
				this.setState({ loading: false });
				
				if (err.desk_mess) {
					this.showAlert('Notifikasi', err.desk_mess);
				}else{
					this.showAlert('Terdapat kesalahan', 'Untuk sementara kami mengalami masalah saat menghubungkan ke server, harap cobalagi nanti');
				}
			})
	}

	showAlert = (title, message) => {
		//wait until set state loading
		setTimeout(() => {
			Alert.alert(
			  `${title}`,
			  `${message}`,
			  [
			  	{
			      text: 'Tutup',
			      style: 'cancel',
			    },
			  ],
			  {cancelable: false},
			);
		}, 100);
	}

	onSetLoading = (bool) => this.setState({ loading: bool })

	onUpdateLocal = async (payload, message) => {
		this.props.setLocalUser(payload);
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			await AsyncStorage.removeItem('historyRequest'); //delete history request
			this.setState({ 
				loading: !this.state.loading,
				data: {}
			});

			setTimeout(() => {
				Alert.alert(
			      "SUKSES",
			      `${message}`,
			      [
			        {
			          text: "Tutup",
			          style: "cancel"
			        },
			        { text: "Login", onPress: () => this.props.navigation.push('Home') }
			      ],
			      { cancelable: false }
			    );
			}, 100);
			// this.showAlert('Notifikasi', message);
		}catch(errors){
			this.showAlert('Terdapat kesalahan', 'Cannot save data to your phone');	
		}
	}

	render(){
		const { data, loading } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title={this.props.navigation.state.params.title}
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
				    style={{backgroundColor: '#FFF', borderBottomWidth: 0.9, borderBottomColor: '#e6e6e6'}}
				/>
				<Loader loading={loading} />
				
				{ Object.keys(data).length > 0 ? 
					<VerificationForm 
						setLoading={this.onSetLoading} 
						data={this.state.data}
						imei={Constants.deviceId}
						setLocal={this.onUpdateLocal}
						showAlert={(title, message) => this.showAlert(title, message)}
						jenis={this.state.jenis}
					/> : <RequestForm 
							onRequest={this.onSubmitRequest} 
							jenis={this.state.jenis}
					/> }
			</View>
		);
	}
}

// function mapStateToProps(state) {
// 	return{
// 		historyReqStore: state.auth.request
// 	}
// }

export default connect(null, { setLocalUser })(Pemulihan);
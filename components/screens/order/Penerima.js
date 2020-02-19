import React from "react";
import { View, Text, StyleSheet, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";
import Constants from 'expo-constants';
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import PenerimaForm from "./forms/PenerimaForm";
import { connect } from "react-redux";
import { getDetailUser } from "../../../actions/auth";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const LoadingView = () => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Spinner size='medium' />
		<Text style={{fontFamily: 'open-sans-reg', marginTop: 5}}>Loading...</Text>
	</View>
);


class Penerima extends React.Component{
	state = {
		isLoading: true
	}

	componentDidMount(){
		this.getProfile();
		setTimeout(() => this.setState({isLoading: false}), 300);	
	}

	// UNSAFE_componentWillReceiveProps(nextProps){
	// 	if (nextProps.dataDetailUser) {
	// 		this.setState({ detail: nextProps.dataDetailUser });
	// 	}
	// }

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	getProfile = () => {
		const { userid } = this.props.dataLogin;
		// const userid = '440000123';
		this.props.getDetailUser(userid)
			.catch(err => {
				const { dataDetailUser } = this.props;
				if (Object.keys(dataDetailUser).length > 0) {
					alert("Whoppps, kami tidak dapat mengambil data anda. Tapi anda masih bisa tetap order dengan data yang sudah kami simpan sebelumnya");
				}else{
					alert("Whoppps, kami tidak dapat mengambil data anda. Harap pastikan koneksi internet anda, atau coba terlebih dahulu masuk ke halaman profil anda");
				}
			});
	}

	onSubmit = (data) => {
		const pengirimnya = {
			nama: data.pengirim.nama,
			alamat: data.pengirim.alamatUtama,
			kota: data.pengirim.kabupaten,
			kodepos: data.pengirim.kodepos,
			nohp: data.pengirim.nohp,
			alamatDet: '-',
			kel: data.pengirim.kelurahan,
			kec: data.pengirim.kecamatan,
			email: data.pengirim.email,
			provinsi: data.pengirim.provinsi
		};

		this.props.navigation.navigate({
			routeName: 'PilihTarif',
			params: {
				...this.props.navigation.state.params,
				deskripsiPenerima: data.penerima,
				pengirimnya
			}
		})
	}

	render(){
		const { isLoading } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola Tujuan Order'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ isLoading ? <LoadingView /> : 
					<KeyboardAvoidingView
						style={{flex:1}} 
						enabled
						behavior={'padding'}
					>
						<ScrollView keyboardShouldPersistTaps='always'>	
							<PenerimaForm 
								onGetProfile={this.getProfile}
								detailPengirim={this.props.dataDetailUser}
								onSubmit={this.onSubmit}
							/>
						</ScrollView>
					</KeyboardAvoidingView> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataDetailUser: state.auth.user,
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { getDetailUser })(Penerima);

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(240, 132, 0)'
  	}
});
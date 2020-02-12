import React from "react";
import { View, Text, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import PenerimaForm from "./forms/PenerimaForm";
import { connect } from "react-redux";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

class Penerima extends React.Component{
	state = {}

	// componentDidMount(){
	// 	console.log(this.props.dataLogin);
	// }

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (deskripsiPenerima) => {
		// const { dataLogin } = this.props;
		// const pengirimnya = {
		// 	nama: dataLogin.detail.nama,
		// 	alamat: dataLogin.detail.alamatOl,
		// 	kota: dataLogin.detail.kota,
		// 	kodepos: dataLogin.detail.kodepos,
		// 	nohp: dataLogin.detail.nohp,
		// 	alamatDet: '-',
		// 	kel: dataLogin.detail.kelurahan,
		// 	kec: dataLogin.detail.kecamatan,
		// 	email: dataLogin.detail.email,
		// 	provinsi: dataLogin.detail.provinsi
		// };
		
		this.props.navigation.navigate({
			routeName: 'PilihTarif',
			params: {
				...this.props.navigation.state.params,
				deskripsiPenerima
			}
		})
	}

	render(){
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
				<KeyboardAvoidingView
					style={{flex:1}} 
					behavior="padding" 
					enabled
				>
					<ScrollView keyboardShouldPersistTaps='always'>	
						<PenerimaForm onSubmit={this.onSubmit} />
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(Penerima);

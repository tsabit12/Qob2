import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, Keyboard } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import Constants from 'expo-constants';
import FormPengirim from "./forms/FormPengirim";
import { connect } from "react-redux";

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const LoadingView = () => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Spinner size='medium' />
		<Text style={{fontFamily: 'open-sans-reg', marginTop: 5}}>Loading...</Text>
	</View>
);

class Pengirim extends React.Component{
	state = {
		show: false,
		keyboardOpen: false
	}

	UNSAFE_componentWillMount () {
	    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	componentDidMount(){
		setTimeout(() => this.setState({ show: true }), 300);
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
		const pengirimnya = {
			nama: data.nama,
			alamat: data.alamatUtama,
			kota: data.kota,
			kodepos: data.kodepos,
			nohp: data.noHp,
			alamatDet: '-',
			kel: data.kelurahan,
			kec: data.kecamatan,
			email: data.email,
			provinsi: data.provinsi
		};


		this.props.navigation.navigate({
			routeName: 'OrderPenerimaNonMember',
			params: {
				...this.props.navigation.state.params,
				pengirimnya
			}
		})
	}

	render(){
		const { show } = this.state;
		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola Pengirim'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)', elevation: 10, paddingTop: Constants.statusBarHeight + 8}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ show ? <KeyboardAvoidingView
							style={{flex:1}} 
							behavior="padding" 
							enabled={this.state.keyboardOpen}
						>
						<ScrollView keyboardShouldPersistTaps='always'>	
							<View style={{margin: 7, flex: 1}}>
								<FormPengirim onSubmit={this.onSubmit} user={this.props.dataLogin} />
							</View>
						</ScrollView>
					</KeyboardAvoidingView> : <LoadingView /> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(Pengirim);
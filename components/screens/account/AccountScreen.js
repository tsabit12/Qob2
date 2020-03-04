import React from "react";
import {View, Text, AsyncStorage, SafeAreaView, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import styles from "./styles";
import api from "../../api";
import { connect } from "react-redux";
import { getDetailUser, loggedOut } from "../../../actions/auth";
import { getRekening } from "../../../actions/search";
import { Icon, Spinner, Button, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const imageIcon = require("../../icons/user.png");

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


const LoaderView = () => (
	<View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		<Spinner size='medium' />
	</View>
);

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const HasError = ({ errors }) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', margin: 5}}>
		<View style={{borderWidth: 0.5, borderRadius: 5, padding: 10}}>
			<Text style={{fontFamily: 'open-sans-reg'}}>{errors}</Text>
		</View>
	</View>
);

const ListRekening = ({ listdata }) => {
	const parsingPagar = listdata[2].split('#');
	// console.log(parsingPagar);
	return(
		<React.Fragment>
			<View style={{ margin: 5, paddingBottom: 7 }}>
				<View style={styles.oneRow}>
					<Text style={{fontFamily: 'Roboto-Regular', fontSize: 15, color: '#a6a3a2'}}>Initial Balance</Text>
					<Text style={{ marginLeft: 20, fontFamily: 'Roboto-Regular', fontSize: 15, color: '#a6a3a2' }}>: {numberWithCommas(listdata[0])}</Text>
				</View>
				<View style={styles.oneRow}>
					<Text style={{fontFamily: 'Roboto-Regular', fontSize: 15, color: '#a6a3a2'}}>Final Balance</Text>
					<Text style={{ marginLeft: 24, fontFamily: 'Roboto-Regular', fontSize: 15, color: '#a6a3a2' }}>: {numberWithCommas(listdata[1])}</Text>
				</View>
				<View style={{marginTop: 10}}>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 5}}>
						<Text>Ket</Text>
						<Text style={{marginLeft: 10}}>Tanggal</Text>
						<Text style={{marginLeft: 49}}>Jam</Text>
						<Text style={{marginLeft: 30}}>Total</Text>
					</View>
					{ parsingPagar.map((x, i) => {
						if (x.length > 0) { //remove last array cause it's null
							const parsingX = x.split('~');
							return(
								<View style={{flexDirection: 'row', alignItems: 'flex-start'}} key={i}>
									<Text>{parsingX[0]}</Text>
									<Text style={{marginLeft: 20}}>{parsingX[2]}</Text>
									<Text style={{marginLeft: 20}}>{parsingX[3]}</Text>
									<Text style={{marginLeft: 28}}>{numberWithCommas(parsingX[5])}</Text>
								</View>
							);
						}
					}) }
				</View>
			</View>
		</React.Fragment>
	);
}

const Profile = ({ user, saldo, getRekening, rekening, nomorRek, listRek, loading, datanya }) => {
	return(
		<React.Fragment>
			<View style={{flexDirection: 'row', padding: 10 }}>
				<Image source={imageIcon} style={{width: 60, height: 60}} />
				<View style={{flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<Text style={{ paddingLeft: 10, fontSize: 16, fontFamily: 'open-sans-bold' }}>{capitalize(user.namaPanggilan)}</Text>
					<Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Userid  ({user.userid})</Text>
					{ user.userid.substring(0, 3) !== '540' && <Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Nomor Rekening ({user.noRek})</Text> }
				</View>
			</View>
			<View style={{borderBottomWidth: 1, margin: 10, borderBottomColor: '#cfcfcf'}} />
			<View>
				<Text style={{paddingLeft: 13, fontFamily: 'open-sans-bold' }}>Informasi Profil</Text>
				<View style={{padding: 13, marginTop: -10}}>
					<View style={styles.contentLabel}>
						<Icon name='email-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Email</Text>
							<Text style={styles.labelSubTitle}>{user.email}</Text>
						</View>
					</View>

					<View style={styles.contentLabel}>
						<Icon name='phone-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Telepon</Text>
							<Text style={styles.labelSubTitle}>{user.noHp}</Text>
						</View>
					</View>
					{ /* user.detailUsaha.length > 0 && <View style={styles.contentLabel}>
						<Icon name='shopping-cart-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Detail Usaha</Text>
							<Text style={styles.labelSubTitle}>{user.detailUsaha}</Text>
						</View>
					</View> */}
					<View style={styles.contentLabel}>
						<Icon name='pin-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Alamat</Text>
							<View style={{marginRight: 10 }}>
							<Text style={styles.labelSubTitle}>
								{capitalize(datanya.detail.alamatOl)}, {capitalize(datanya.detail.kelurahan)}, {capitalize(datanya.detail.kecamatan)}, {capitalize(datanya.detail.kota)}
							</Text>
							</View>
						</View>
					</View>
					<View style={styles.contentLabel}>
						<Icon name='info-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Kodepos</Text>
							<Text style={styles.labelSubTitle}>{datanya.detail.kodepos}</Text>
						</View>
					</View>
					{ user.userid.substring(0, 3) !== '540' && <View style={styles.contentLabelBot}>
						<Icon name='credit-card-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Saldo Giro</Text>
							<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>Rp {saldo}</Text>
						</View>
						<TouchableOpacity 
							style={styles.linkIcon}
							onPress={() => getRekening(user.noRek)}
						>
							<Icon name={ rekening ? 'arrow-ios-downward-outline' : 'arrow-ios-forward-outline' } width={25} height={25} fill='#232424'/>
						</TouchableOpacity>

					</View> }
					{ rekening && <React.Fragment>
						{ listRek[nomorRek] ? <ListRekening listdata={listRek[nomorRek]} /> : <React.Fragment>
								{ loading ? <Text>Loading...</Text> : <Text>Terdapat kesalahan</Text> }
							</React.Fragment> }
					</React.Fragment> }
				</View>
			</View>
		</React.Fragment>
	);
} 

class AccountScreen extends React.Component{
	state = {
		sisaSaldo: null,
		showRekKoran: false,
		nomorRek: '',
		loading: false,
		errors: {}
	}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObj 	= JSON.parse(value);
		let userid 		= toObj.userid;
		this.setState({
			sisaSaldo: numberWithCommas(this.props.dataLogin.detail.saldo)
		});
		this.props.getDetailUser(userid)
			.then(() => this.setState({ errors: {} }))
			.catch(err => this.setState({ errors: { global: 'Whoopps terdapat kesalahan, harap pastikan kembali koneksi internet anda'}}));
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		if (nextProps.detail) {
			const { detail } = nextProps;
			this.setState({ nomorRek: detail.noRek })
		}
	}

	getRekening = (e) => {
		this.setState({ showRekKoran: !this.state.showRekKoran, loading: true });
		this.props.getRekening(this.state.nomorRek)
			.then(res => this.setState({ loading: false}))
			.catch(err => this.setState({ loading: false}));
	}

	onLogout = () => {
		this.props.loggedOut();
		this.props.navigation.navigate({
            routeName: 'Home'
        })
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	);

	render(){
		const { detail, rekKoran } = this.props;
		const { errors } = this.state;
		
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Profil'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitle={this.props.navigation.state.params.namaLengkap}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ Object.keys(detail).length > 0 ? <ScrollView>
						<View style={{marginTop: 5}}>
							<Profile 
								user={detail} 
								saldo={this.state.sisaSaldo} 
								getRekening={this.getRekening}
								rekening={this.state.showRekKoran}
								nomorRek={this.state.nomorRek}
								listRek={rekKoran}
								loading={this.state.loading}
								datanya={this.props.dataLogin}
							/>
						</View>
						<View style={{ marginLeft: 14, marginRight: 15, paddingBottom: 10 }}>
							<Button status='info' onPress={this.onLogout}>Logout</Button>
						</View>
					</ScrollView> : <React.Fragment>
						{ errors.global ? <HasError errors={errors.global} /> : <LoaderView /> }
					</React.Fragment> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		detail: state.auth.user,
		rekKoran: state.search.rekening,
		dataLogin: state.auth.dataLogin
	}
}


export default connect(mapStateToProps, { getDetailUser, getRekening, loggedOut })(AccountScreen);
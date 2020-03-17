import React from "react";
import { View, Text, ImageBackground, StatusBar, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Icon, TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components';
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { loggedOut } from "../../../actions/auth";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Dialog from "react-native-dialog";
import Loader from "../../Loader";
import apiWs from "../../apiWs";


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
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
		return number;
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const RenderSaldoView = ({ detail }) => (
	<React.Fragment>
		<View style={{marginBottom: 10}}>
			<Text style={{fontFamily: 'open-sans-bold', textAlign: 'center', fontSize: 18, color: 'white'}}>{detail.nama}</Text>
		</View>
		<View style={{marginLeft: 15, marginRight: 15}}>
			<View>
				<Text style={{fontFamily: 'open-sans-reg', color: 'white', fontSize: 16}}>SALDO</Text>
				<Text style={{fontFamily: 'open-sans-bold', color: 'white', fontSize: 16}}>Rp {numberWithCommas(detail.saldo)}</Text>
			</View>
			<View>
				<Text style={{fontFamily: 'open-sans-reg', color: 'white', fontSize: 16}}>NOMOR REKENING</Text>
				<Text style={{fontFamily: 'open-sans-bold', color: 'white', fontSize: 16}}>{detail.norek}</Text>
			</View>
		</View>
	</React.Fragment>
);

const PebisolInfo = ({ detail }) => (
	<React.Fragment>
		<View style={styles.info}>
			<Text style={styles.title}>Nama Online Shop</Text>
			<Text style={styles.subtitle}>{detail.namaOl}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Jenis Online Shop</Text>
			<Text style={styles.subtitle}>{detail.jenisOl}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Nomor Handphone</Text>
			<Text style={styles.subtitle}>{detail.nohp}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Email</Text>
			<Text style={styles.subtitle}>{detail.email}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Alamat Utama</Text>
			<Text style={styles.subtitle}>{detail.alamatOl}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Detail Alamat</Text>
			<Text style={styles.subtitle}>{`${capitalize(detail.kelurahan)}, ${capitalize(detail.kecamatan)}, ${capitalize(detail.kota)}, ${capitalize(detail.provinsi)}`}</Text>
		</View>
		<View style={styles.lastInfo}>
			<Text style={styles.title}>Kodepos</Text>
			<Text style={styles.subtitle}>{detail.kodepos}</Text>
		</View>
	</React.Fragment>
);

const UserInfo = ({ detail }) => (
	<React.Fragment>
		<View style={styles.info}>
			<Text style={styles.title}>Nomor Handphone</Text>
			<Text style={styles.subtitle}>{detail.nohp}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Email</Text>
			<Text style={styles.subtitle}>{detail.email}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Alamat Utama</Text>
			<Text style={styles.subtitle}>{detail.alamatOl}</Text>
		</View>
		<View style={styles.info}>
			<Text style={styles.title}>Detail Alamat</Text>
			<Text style={styles.subtitle}>{`${capitalize(detail.kelurahan)}, ${capitalize(detail.kecamatan)}, ${capitalize(detail.kota)}, ${capitalize(detail.provinsi)}`}</Text>
		</View>
		<View style={styles.lastInfo}>
			<Text style={styles.title}>Kodepos</Text>
			<Text style={styles.subtitle}>{detail.kodepos}</Text>
		</View>
	</React.Fragment>
);

class AccountScreenNew extends React.Component{
	state = {
		open: false,
		color: '#9ca19d',
		searchParams: '',
		loading: false,
		errors: {}
	}
	// componentDidMount(){
	// 	console.log(this.props.dataLogin);
	// }

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	);

	onConnect = () => this.props.navigation.navigate({
		routeName: 'ValidasiRekening'
	})

	onLogout = () => {
		this.props.loggedOut();
		this.props.navigation.navigate({
            routeName: 'Home'
        })
	}

	onChangeParams = (e) => {
		clearTimeout(this.timer);
		this.setState({ searchParams: e.nativeEvent.text });
		this.timer = setTimeout(this.searchAlamat, 800);
	}

	searchAlamat = () => {
		if (!this.state.searchParams) return;
		this.setState({ loading: true });
		apiWs.qob.getKodePos(this.state.searchParams)
			.then(res => {
				console.log(res);
				this.setState({ loading: false });
			})
			.catch(err => {
				console.log(err.request);
				if (err.status) {
					this.setState({ 
						loading: false, 
						color: 'red',
						errors: {
							global: err.response.data.errors
						}
					});
				}else{
					this.setState({ 
						loading: false, 
						color: 'red',
						errors: {
							global: 'Network error'
						}
					});
				}
			})
	}

	renderRightControls = () => (
		<Menu>
			<MenuTrigger>
				<Icon style={{marginRight: 5}} name='more-vertical-outline' fill='#FFF' height={25} width={25}/>
			</MenuTrigger>
			 <MenuOptions>
		        <MenuOption onSelect={() => alert(`Next features`)} >
		        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
		          		<Text>Ubah PIN</Text>
		          	</View>
		        </MenuOption>
		 		<MenuOption onSelect={this.onLogout}>
		        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
		          		<Text>Logout</Text>
		          	</View>
		        </MenuOption>
		    </MenuOptions>
		</Menu>
	)

	render(){
		const { dataLogin } = this.props;
		const { errors } = this.state;
		//console.log(height / 28);
		return(
			<View style={{flex: 1, backgroundColor: '#ffd000'}}>
				<Loader loading={this.state.loading} />
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(255, 102, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				    rightControls={this.renderRightControls()}
				/>
				<TouchableOpacity style={styles.buttonEdit} onPress={() => this.setState({ open: true })}>
					<Icon name='edit-2-outline' width={25} height={25} fill='#FFF' />
				</TouchableOpacity>
				<ScrollView>
					<ImageBackground source={require('../../../assets/profil_back.png')} style={{height: height / 4.5, marginTop: -2, width: width + 2}}>
						<View style={styles.card}>
							{ dataLogin.detail.norek === '-' ? 
								<React.Fragment>
									<Text style={{fontFamily: 'open-sans-bold', color: 'white', fontSize: 17, textAlign: 'center', marginBottom: 10}}>
										Anda belum terhubung ke akun giro
									</Text>
									<Button 
										style={styles.button} 
										status='primary' 
										appearance='outline'
										onPress={this.onConnect}
									>Hubungkan</Button>
								</React.Fragment>: <RenderSaldoView 
									detail={dataLogin.detail}
								/> }
						</View>
					</ImageBackground>
					<View style={styles.detailProfil}>
						{ dataLogin.userid.substring(0, 3) === '440' ? <PebisolInfo detail={dataLogin.detail} /> : <UserInfo detail={dataLogin.detail} />}
					</View>
					<Dialog.Container visible={this.state.open} contentStyle={{width: width - 25}}>
						<Dialog.Title>Edit Profile</Dialog.Title>

						<Dialog.Input
				          	label='Cari Alamat'
				          	name='searchParams'
				          	value={this.state.searchParams}
				          	onChange={this.onChangeParams}
				          	placeholder="Masukan kodepos/kec/kab"
				          	style={{
				          		borderBottomWidth: 0.5, 
				          		borderColor: this.state.color,
				          		color: this.state.color
				          	}}
				        />
				        { errors.global && 
				        	<Text 
				        		style={{
				        			fontSize: 13, 
				        			color: 'red',
				        			marginTop: -15,
				        			marginLeft: 10
				        		}}
				        	>{errors.global}</Text> }
			          <Dialog.Button label="Batal" onPress={() => this.setState({ open: false, errors: {}, searchParams: '', color: '#9ca19d' })} />
			          { /* <Dialog.Button label="Simpan" /> */ }
			        </Dialog.Container>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	StatusBar: {
		height: Constants.statusBarHeight,
		backgroundColor: 'rgb(240, 132, 0)'
	},
	card: {
		justifyContent: 'center', 
		minHeight: height / 5
	},
	button: {
		marginLeft: 70,
		marginRight: 70
	},
	title: {
		fontFamily: 'open-sans-reg',
		fontSize: 15,
		paddingBottom: 5
	},
	info: {
		borderBottomWidth: 0.5,
		padding: 13,
		borderColor: '#9ca19d'
	},
	lastInfo: {
		padding: 13
	},
	subtitle: {
		fontFamily: 'open-sans-reg',
		fontSize: 15,
		color: '#9ca19d'
	},
	detailProfil: {
		flex: 1, 
		borderTopLeftRadius: 20, 
		borderTopRightRadius: 20, 
		marginTop: -16, 
		backgroundColor: 'white', 
		marginRight: 3, 
		marginLeft: 3,
		minHeight: height / 1.5 + 27
	},
	buttonEdit: {
		width: '10%',
		position: 'absolute', 
		backgroundColor: 'red',
		right: 0,
		marginRight: 15,
		top: height / 3.5 - 8,
		zIndex: 1,
		alignItems: 'center',
		padding: 8,
		borderRadius: 50
	}
})

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { loggedOut })(AccountScreenNew);
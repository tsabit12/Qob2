import React from "react";
import {View, Text, AsyncStorage, SafeAreaView, Image, TouchableOpacity, ScrollView } from "react-native";
import styles from "./styles";
import api from "../../api";
import { connect } from "react-redux";
import { getDetailUser, loggedOut } from "../../../actions/auth";
import { getRekening } from "../../../actions/search";
import { Icon } from '@ui-kitten/components';

const imageIcon = require("../../icons/user.png");

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const Judul = ({ navigation }) => {
	return(
		<View>
			<Text style={styles.header}>Profile</Text>
			<Text style={styles.text}>{navigation.namaLengkap}</Text> 
		</View>
	);
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
							console.log(parsingX);
							return(
								<View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
									<Text>{numberWithCommas(parsingX[0])}</Text>
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

const Profile = ({ user, saldo, getRekening, rekening, nomorRek, listRek, loading }) => {
	// console.log(listRek[nomorRek]);
	return(
		<React.Fragment>
			<View style={{flexDirection: 'row', padding: 10 }}>
				<Image source={imageIcon} style={{width: 60, height: 60}} />
				<View style={{flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<Text style={{ paddingLeft: 10, fontSize: 16, fontFamily: 'open-sans-bold' }}>{capitalize(user.namaPanggilan)}</Text>
					<Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Userid  ({user.userid})</Text>
					<Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Nomor Rekening ({user.noRek})</Text>
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

					<View style={styles.contentLabel}>
						<Icon name='shopping-cart-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Detail Usaha</Text>
							<Text style={styles.labelSubTitle}>{user.detailUsaha}</Text>
						</View>
					</View>
					<View style={styles.contentLabel}>
						<Icon name='pin-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Alamat</Text>
							<Text style={styles.labelSubTitle}>{capitalize(user.alamat)}, {capitalize(user.kota)}</Text>
						</View>
					</View>
					<View style={styles.contentLabel}>
						<Icon name='info-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={styles.labelTitle}>Kodepos</Text>
							<Text style={styles.labelSubTitle}>{user.kodepos}</Text>
						</View>
					</View>
					<View style={styles.contentLabelBot}>
						<Icon name='credit-card-outline' width={25} height={25} fill='#7eaec4' style={styles.icon} />
						<View style={styles.leftContent}>
							<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Saldo Giro</Text>
							<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{saldo}</Text>
						</View>
						<TouchableOpacity 
							style={styles.linkIcon}
							onPress={() => getRekening(user.noRek)}
						>
							<Icon name={ rekening ? 'arrow-ios-downward-outline' : 'arrow-ios-forward-outline' } width={25} height={25} fill='#232424'/>
						</TouchableOpacity>

					</View>
					{ rekening && <React.Fragment>
						{ listRek[nomorRek] ? <ListRekening listdata={listRek[nomorRek]} /> : <React.Fragment>
								{ loading ? <Text>Loading...</Text> : <Text>Terdapat kesalahan</Text> }
							</React.Fragment> }
					</React.Fragment> }
					<View style={{borderBottomWidth: 1, borderBottomColor: '#cfcfcf'}} />
				</View>
			</View>
		</React.Fragment>
	);
} 

class AccountScreen extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	state = {
		sisaSaldo: null,
		showRekKoran: false,
		nomorRek: '',
		loading: false
	}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObj 	= JSON.parse(value);
		let userid 		= toObj.userid;
		this.setState({
			sisaSaldo: this.props.navigation.state.params.saldo
		});
		this.props.getDetailUser(userid)
			.then(() => console.log("oke"))
			.catch(err => console.log(err));
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

	render(){
		const { detail, rekKoran } = this.props;
		
		return(
			<SafeAreaView>
				<ScrollView>
				{ Object.keys(detail).length > 0 ? 
					<View style={{marginTop: 5}}>
						<Profile 
							user={detail} 
							saldo={this.state.sisaSaldo} 
							getRekening={this.getRekening}
							rekening={this.state.showRekKoran}
							nomorRek={this.state.nomorRek}
							listRek={rekKoran}
							loading={this.state.loading}
						/>
					</View> : <Text>Loading..</Text> }
					<View style={{ marginLeft: 14, marginRight: 15 }}>
						<Text 
							style={{fontFamily: 'open-sans-reg', fontSize: 15, color: 'blue' }}
							onPress={this.onLogout}
						>Logout</Text>
						<View style={{borderBottomWidth: 1, borderBottomColor: '#cfcfcf', marginTop: 10}} />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		detail: state.auth.user,
		rekKoran: state.search.rekening
	}
}


export default connect(mapStateToProps, { getDetailUser, getRekening, loggedOut })(AccountScreen);
import React from "react";
import {View, Text, AsyncStorage, SafeAreaView, Image } from "react-native";
import styles from "./styles";
import api from "../../api";
import { connect } from "react-redux";
import { getDetailUser } from "../../../actions/auth";
import { Button } from '@ui-kitten/components';

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
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const Profile = ({ user, saldo }) => {
	return(
		<React.Fragment>
			<View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#cbccc4' }}>
				<Image source={imageIcon} style={{width: 60, height: 60}} />
				<View style={{flexWrap: 'wrap', alignItems: 'flex-start'}}>
					<Text style={{ paddingLeft: 10, fontSize: 16, fontFamily: 'open-sans-bold' }}>{capitalize(user.namaPanggilan)}</Text>
					<Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Userid  ({user.userid})</Text>
					<Text style={{ paddingLeft: 10, fontFamily: 'Roboto-Regular', fontSize: 13 }}>Nomor Rekening ({user.noRek})</Text>
				</View>
			</View>
			<View style={{paddingTop: 10 }}>
				<View style={{margin: 13}}>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Email</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{user.email}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Telepon</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{user.noHp}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Detail Usaha</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{user.detailUsaha}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Alamat</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{capitalize(user.alamat)}, {capitalize(user.kota)}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Kodepos</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{user.kodepos}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Last Login</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{user.lastLogin}</Text>
					</View>
					<View style={{paddingBottom: 5}}>
						<Text style={{fontFamily: 'open-sans-reg', fontSize: 15}}>Saldo Giro</Text>
						<Text style={{fontFamily: 'Roboto-Regular', color: '#a6a3a2'}}>{saldo}</Text>
					</View>
				</View>
			</View>
			<View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
				<Button status='info' size='small'>Tampilkan Rekening Koran</Button>
			</View>
		</React.Fragment>
	);
} 

class AccountScreen extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	state = {
		sisaSaldo: null
	}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObj 	= JSON.parse(value);
		let userid 		= toObj.userid;
		this.setState({
			sisaSaldo: this.props.navigation.state.params.saldo
		});
		this.props.getDetailUser(userid)
			// .then(() => console.log("oke"))
			// .catch(err => console.log(err));
	}

	render(){
		const { detail } = this.props;
		return(
			<SafeAreaView style={{ marginTop: 5 }}>
				{ Object.keys(detail).length > 0 ? <Profile user={detail} saldo={this.state.sisaSaldo} /> : <Text>Loading..</Text> }
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		detail: state.auth.user
	}
}


export default connect(mapStateToProps, { getDetailUser })(AccountScreen);
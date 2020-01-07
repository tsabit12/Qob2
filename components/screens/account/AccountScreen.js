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

const Profile = ({ user }) => {
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
			<View style={{paddingTop: 10}}>
				<Text style={{textAlign: 'center', fontFamily: 'open-sans-reg', color: '#9b9c98'}}>Informasi Pribadi</Text>
				<View style={{padding: 10}}>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Email</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 100 }}>: {user.email}</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Nomor Handphone</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 14 }}>: {user.noHp}</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Alamat</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 90 }}>: {capitalize(user.alamat)}</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Kota</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 105 }}>: {capitalize(user.kota)}</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Kodepos</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 80 }}>: {user.kodepos}</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 10}}>
						<Text style={styles.labelInformasi}>Last Login</Text>
						<Text style={{fontSize: 14, fontFamily: 'open-sans-reg', marginLeft: 73 }}>: {user.lastLogin}</Text>
					</View>
				</View>
			</View>
			<View style={{ paddingLeft: 10, paddingRight: 10 }}>
			<Button status='info' size='small'>Tampilkan Rekening Koran</Button>
			</View>
		</React.Fragment>
	);
} 

class AccountScreen extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation.state.params}/>
	}) 

	state = {}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObj 	= JSON.parse(value);
		let userid 		= toObj.userid;
		// this.props.getDetailUser(userid)
		// 	.then(() => console.log("oke"))
		// 	.catch(err => console.log(err));
	}

	render(){
		const { detail } = this.props;
		return(
			<SafeAreaView style={{ marginTop: 5 }}>
				{ Object.keys(detail).length > 0 ? <Profile user={detail} /> : <Text>Loading..</Text> }
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
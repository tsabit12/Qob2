import React from "react";
import { Button, Text, StyleSheet, View, ScrollView, StatusBar, Image, AsyncStorage } from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";
import { SliderBox } from "react-native-image-slider-box";
import Dialog from "react-native-dialog";
import api from "../../api";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const iconBarcode = require("../../../assets/barcode.png");

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="dark-content" />
	</View>
);

const CameraIcon = (style) => (
	<Icon {...style} name='camera-outline' fill='#FFF'/>	
);

const ProfileIcon = (style) => (
	<Icon {...style} name='person' fill='#FFF'/>
);

const SearchIcon = (style) => (
	<Icon {...style} name='search-outline' fill='#FFF'/>
);

const CameraBarcodeAction = (props) => (
  <TopNavigationAction {...props} icon={CameraIcon}/>
);

const ProfileAction = (props) => (
  <TopNavigationAction {...props} icon={ProfileIcon}/>
);

const SearchAction = (props) => (
  <TopNavigationAction {...props} icon={SearchIcon}/>
);



class IndexSearch extends React.Component{
	state = {
		loading: false,
		show: false,
		userid: '',
		msgModal: '',
		titleModal: '',
		success: '00',
		user: {
			nama: '',
			sisaSaldo: ''
		}
	}

	async componentDidMount(){
		const value = await AsyncStorage.getItem('sessionLogin');
		const toObj = JSON.parse(value);
	    const nama  = toObj.nama.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	    const saldo = toObj.saldo;
	    
	    this.setState({
	    	user: {
		    	nama: nama,
		    	sisaSaldo: saldo
	    	}
	    })
	}

	onGeneratePwd = () => {
		const { userid } = this.state;
		if (userid) {
			this.setState({ loading: true, show: false });
			api.auth.genpwdweb(userid)
				.then(res => this.setState({
					loading: false, 
					show: true, 
					titleModal: 'Berhasil', 
					success: '200',
					msgModal: `Harap diingat, password web anda adalah ${res.response_data1}`
				}))
				.catch(err => {
					console.log(err);
					this.setState({
						loading: false,
						show: true,
						titleModal: 'Gagal',
						success: '500',
						msgModal: 'Terdapat kesalahan'
					})
				})
		}
	}

	onCameraPress = () => {
		this.props.navigation.navigate({
			routeName: 'Barcode'
		})
	}

	renderLeftControl = () => (
		<CameraBarcodeAction onPress={this.onCameraPress}/>
	)

	renderRightControls = () => [
		<SearchAction onPress={() => this.props.navigation.navigate({ routeName: 'DetailSearch'})} />,
		<ProfileAction onPress={() => 
			this.props.navigation.navigate({ 
				routeName: 'Account', 
				params: {
					namaLengkap:  this.state.user.nama,
					saldo: this.state.user.sisaSaldo
				} 
			})} 
		/>
	]

	render(){
		const { show, msgModal, titleModal, success } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.renderLeftControl()}
				    title='QOB'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', fontSize: 19, fontWeight: '700', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    rightControls={this.renderRightControls()}
				/>
				<React.Fragment>
					{ show && <Dialog.Container visible={true}>
						<Dialog.Title>{titleModal}</Dialog.Title>
						<Dialog.Description>
							{msgModal}
						</Dialog.Description>
						<Dialog.Button 
							label="Tutup" 
							onPress={() => this.setState({ 
								show: false, 
								userid: '',
								success: '00'
							})}
						/>
						{ success === '00' && <Dialog.Button 
							label="Ya" 
							onPress={this.onGeneratePwd} 
						/> }
					</Dialog.Container> }
				</React.Fragment>
				<ScrollView>
					<SliderBox images={[
						require('../../../assets/qob.jpg'),
						require('../../../assets/qob2.jpg'),
						require('../../../assets/qob3.jpg')
					]} 
					sliderBoxHeight={230}
					resizeMode={'stretch'}
					circleLoop
					autoplay={true}
					paginationBoxStyle={{
						alignItems: "center",
						alignSelf: "center",
						justifyContent: "center",
					  }}
					/>
					<View style={styles.container}>
						<Menu 
							navigation={this.props.navigation} 
							loading={this.state.loading}
							onShowModal={(userid) => this.setState({ 
								show: true, 
								userid: userid,
								msgModal: 'Apakah anda yakin untuk generate password web anda?',
								titleModal: 'Notifikasi'
							})}
						/>
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default IndexSearch;
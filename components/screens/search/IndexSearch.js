import React from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";
import { SliderBox } from "react-native-image-slider-box";
import Dialog from "react-native-dialog";
import api from "../../api";


class IndexSearch extends React.Component{
	static navigationOptions = {
    	drawerLabel: 'Home'
	}

	state = {
		loading: false,
		show: false,
		userid: '',
		msgModal: '',
		titleModal: '',
		success: '00'
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

	render(){
		const { show, msgModal, titleModal, success } = this.state;
		return(
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
			</React.Fragment>
		);
	}
}

export default IndexSearch;
import React from "react";
import { View, Text, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import OrderForm from "./forms/OrderForm";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


class Order extends React.Component{
	state = {}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onSubmit = (data) => {
		const deskripsiOrder = {
			berat: data.berat.replace(/\D/g, ''),
			panjang: data.panjang.replace(/\D/g, ''),
			tinggi: data.tinggi.replace(/\D/g, ''),
			lebar: data.lebar.replace(/\D/g, ''),
			isiKiriman: data.jenis,
			nilai: data.nilaiVal.replace(/\D/g, ''),
			cod: data.checked
		};
		
		this.props.navigation.navigate({
			routeName: 'KelolaPengirim',
			params: {
				deskripsiOrder
			}
		})
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola deskripsi kiriman'
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
						<OrderForm onSubmit={this.onSubmit} />
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

export default Order;
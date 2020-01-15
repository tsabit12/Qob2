import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Menu } from '@ui-kitten/components';


const styles = StyleSheet.create({
  menuItemTitle: {
    color: '#068fc9',
    fontSize: 15,
    fontFamily: 'Roboto-Regular'
  },
});

const Judul = ({ navigation }) => (
	<View>
		<Text style={{fontFamily: 'open-sans-bold', fontSize: 16, fontWeight: '700'}}>Bantuan</Text>
	</View>
);

const data = [
  { title: 'Verifikasi', titleStyle: styles.menuItemTitle },
  { title: 'Lupa pin', titleStyle: styles.menuItemTitle },
  { title: 'Pulihkan Akun', titleStyle: styles.menuItemTitle },
  { title: 'Buka Blokir', titleStyle: styles.menuItemTitle },
  { title: 'Tentang', titleStyle: styles.menuItemTitle },
];

class BantuanScreen extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	}) 


	onSelect = (e) => {
		// console.log(e);
		if (e === 1) this.props.navigation.navigate({
			routeName: 'LupaPin',
			params: {
				titlePemulihan: 'Lupa PIN',
				jenis: 1
			}
		});
		if (e === 2) this.props.navigation.navigate({
			routeName: 'LupaPin',
			params: {
				titlePemulihan: 'Pemulihan Akun',
				jenis: 2
			}
		});
		if (e === 3) this.props.navigation.navigate({
			routeName: 'LupaPin',
			params: {
				titlePemulihan: 'Buka Blokir',
				jenis: 3
			}
		});
	}

	render(){
		return(
			<View>
				<View />
				<Menu
			      data={data}
			      // selectedIndex={selectedIndex}
			      onSelect={this.onSelect}
			    />
		    </View>
		);
	}
}

export default BantuanScreen;
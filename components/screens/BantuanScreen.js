import React from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { Menu, Icon, TopNavigation, TopNavigationAction, Layout } from '@ui-kitten/components';
import Constants from 'expo-constants';


const styles = StyleSheet.create({
  menuItemTitle: {
    color: '#068fc9',
    fontSize: 15,
    fontFamily: 'Roboto-Regular'
  },
  StatusBar: {
  	height: Constants.statusBarHeight,
  	backgroundColor: '#FFF'
  },
  navigation: {
  	shadowColor: '#000000',
  	shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  }
});

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="dark-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='black'/>
);


const data = [
  { title: 'Lupa pin', titleStyle: styles.menuItemTitle },
  { title: 'Pulihkan Akun', titleStyle: styles.menuItemTitle },
  { title: 'Buka Blokir', titleStyle: styles.menuItemTitle },
  { title: 'Tentang', titleStyle: styles.menuItemTitle },
];

class BantuanScreen extends React.Component{
	state = {}

	onSelect = (e) => {
		// console.log(e);
		if (e === 0) this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Lupa PIN',
				jenis: 1
			}
		});
		if (e === 1) this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Pemulihan Akun',
				jenis: 2
			}
		});
		if (e === 2) this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Buka Blokir',
				jenis: 3
			}
		});

		if (e === 3) this.props.navigation.navigate({
			routeName: 'About'
		});
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	);


	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Bantuan'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
				    style={{backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}}
				/>
			    <View>
					<Menu
				      data={data}
				      // selectedIndex={selectedIndex}
				      onSelect={this.onSelect}
				    />
			    </View>
		    </View>
		);
	}
}

export default BantuanScreen;
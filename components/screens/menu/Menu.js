import React from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from '@ui-kitten/components';
import { Linking } from "expo";

var device = Dimensions.get('window').width;

const Menu = ({ navigation, showAlert }) => {
	return(
		<View style={{flex: 1, margin: 8}}>
			<View style={styles.content}>

				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => navigation.navigate({
						routeName: 'OrderNonMember'
					})}
				>
					<View style={styles.button}>
						<Icon name='calendar' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Quick Online Booking</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => navigation.navigate({
						routeName: 'CekTarif'
					})}
				>
					<View style={styles.button}>
						<Icon name='car' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Cek Tarif</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => Linking.openURL('tel:' + '161')}
				>
					<View style={styles.button}>
						<Icon name='phone-call' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Halo Pos</Text>
					</View>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => navigation.navigate({
						routeName: 'RiwayatPickup'
					})}
				>
					<View style={styles.button}>
						<Icon name='shopping-bag' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Riwayat Order</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => showAlert('Anda akan melakukan generate token web')}
				>
					<View style={styles.button}>
						<Icon name='settings' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Generate Web Token</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					activeOpacity={0.5}
					onPress={() => navigation.navigate({
						routeName: 'LacakKiriman'
					})}
				>
					<View style={styles.button}>
						<Icon name='pin' width={50} height={50} fill="#FFF" style={{marginBottom: 6}} />
					</View>
					<View style={styles.subtitleView}>
						<Text style={styles.title}>Lacak Kiriman</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'rgb(245, 90, 12)', 
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20
	},
	icon: {
		width: device*0.3 - 10,
		backgroundColor: '#FFF',
		borderRadius: 4,
		elevation: 5
	},
	title: {
		color: 'black',
		fontSize: 13,
		textAlign: 'center',
		fontFamily: 'Roboto-Regular',
		fontWeight: '700'
	},
	subtitleView: {
		height: 45,
		justifyContent: 'center'
	}
})

export default Menu;
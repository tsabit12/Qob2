import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Button } from '@ui-kitten/components';
import { Linking } from "expo";

var device = Dimensions.get('window').width;

const MenuNotMember = ({ navigation, showAlert }) => (
	<React.Fragment>
		<View style={styles.container}>
			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => navigation.navigate({
                        routeName: 'OrderNonMember'
                    })}
				>
					<Image 
						source={require("../../assets/calendar.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Quick Online Booking</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.iconPress}
					 onPress={() => navigation.navigate({
                        routeName: 'CekTarif'
                    })}
				>
					<Image 
						source={require("../../assets/truck.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Cek Tarif</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => navigation.navigate({
                        routeName: 'RequestPickup'
                    })}
				>
					<Image 
						source={require("../../assets/pickup.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Request Pickup</Text>
					</View>
				</TouchableOpacity>
				{ /* <TouchableOpacity 
					style={styles.iconPress}
					onPress={() => Linking.openURL('tel:' + '161')}
				>
					<Image 
						source={require("../../assets/phone2.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Halo Pos</Text>
					</View>
				</TouchableOpacity> */ }
			</View>
			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => navigation.navigate({
                        routeName: 'RiwayatPickup'
                    })}
				>
					<Image 
						source={require("../../assets/historyPickup.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>{`Riwayat\nOrder`}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => showAlert('Anda akan melakukan generate token web')}
				>
					<Image 
						source={require("../../assets/generatePwd.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Generate Web Token</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => navigation.navigate({
                        routeName: 'LacakKiriman'
                    })}
				>
					<Image 
						source={require("../../assets/location.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Lacak{'\n'}Kiriman</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	</React.Fragment>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		margin: 3,
		margin: 10,
		height: '100%',
		borderWidth: 0.6,
		padding: 10,
		paddingBottom: 5,
		borderRadius: 5,
		borderColor: '#b5b0b0'
	},
	content:{
		flex: 1,
		flexDirection: 'row',
		marginTop: device*0.2 - 60
	},
	iconPress: {
		width: device*0.3 - 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 7,
		marginTop: -15,
		borderColor: 'black'
	},
	img: {
		width: device*0.3 - 25, height: device*0.3 - 30
	},
	subtitle: {
		width: '100%', 
		alignItems: 'center',
		padding: 4,
		height: 52
	},
	textMenuTitle: {
		fontFamily: 'open-sans-bold',
		fontSize: 16
	},
	titleText: {
		color: 'black', 
		textAlign: 'center'
	}
})

export default MenuNotMember;
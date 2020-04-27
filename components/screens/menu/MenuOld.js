import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Button } from '@ui-kitten/components';
import { Linking } from "expo";

var device = Dimensions.get('window').width;

const MenuOld = ({ navigation, showAlert }) => (
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
						source={require("../../../assets/calendar.png")}
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
						source={require("../../../assets/truck.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Cek Tarif</Text>
					</View>
				</TouchableOpacity>
				{ /*<TouchableOpacity 
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
				</TouchableOpacity> */}

				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => Linking.openURL('tel:' + '161')}
				>
					<Image 
						source={require("../../../assets/phone2.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={styles.titleText}>Halo Pos</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.iconPress}
					onPress={() => navigation.navigate({
                        routeName: 'RiwayatPickup'
                    })}
				>
					<Image 
						source={require("../../../assets/historyPickup.png")}
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
						source={require("../../../assets/generatePwd.png")}
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
						source={require("../../../assets/location.png")}
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
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 10,
		height: '100%',
		padding: 2,
		borderWidth: 0.3,
		borderRadius: 2,
		borderColor: '#a0a1a3'
	},
	content:{
		flex: 1,
		flexDirection: 'row',
		marginTop: device*0.2 - 75
	},
	iconPress: {
		width: device*0.3 - 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		borderColor: 'black'
	},
	img: {
		width: device*0.3 - 35, height: device*0.3 - 35
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

export default MenuOld;
import React from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import { Linking } from "expo";

const device = Dimensions.get('window').width;

const styles = StyleSheet.create({
	root: {
		flex: 1,
		margin: 5,
		height: '100%',
		borderWidth: 0.3,
		borderRadius: 2,
		borderColor: '#a0a1a3',
	},
	content:{
		flex: 1,
		flexDirection: 'row',
		marginTop: device*0.2 - 75,
		alignItems: 'center',
	},
	icon: {
		width: device*0.3 - 35,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 6,
		marginRight: 6,
		marginBottom: 10,
		borderColor: 'black'
	},
	img: {
		width: device*0.3 - 50, 
		height: device*0.3 - 50
	},
	label: {
		width: '100%', 
		alignItems: 'center',
		padding: 4,
		height: 52
	},
	text: {
		color: 'black', 
		textAlign: 'center'
	}
})

const Icon = props => {
	const { navigation } = props;

	return(
		<View style={styles.root}>
			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.icon}
					onPress={() => navigation.navigate({
                        routeName: 'OnlineBooking'
                    })}
				>
					<Image 
						source={require("../../../../assets/calendar.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>Online Booking</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					onPress={() => navigation.navigate({
                        routeName: 'CekTarif'
                    })}
				>
					<Image 
						source={require("../../../../assets/truck.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>Cek Tarif</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					onPress={() => Linking.openURL('tel:' + '161')}
				>
					<Image 
						source={require("../../../../assets/phone2.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>Halo Pos</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.icon}
					onPress={() => navigation.navigate({
                        routeName: 'RiwayatPickup'
                    })}
				>
					<Image 
						source={require("../../../../assets/historyPickup.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>{`Riwayat\nOrder`}</Text>
					</View>
				</TouchableOpacity>

			</View>
			<View style={styles.content}>
				<TouchableOpacity 
					style={styles.icon}
					onPress={props.onGenerateToken}
				>
					<Image 
						source={require("../../../../assets/generatePwd.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>Generate Web Token</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					onPress={() => navigation.navigate({
                        routeName: 'LacakKiriman'
                    })}
				>
					<Image 
						source={require("../../../../assets/location.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>Lacak{'\n'}Kiriman</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.icon}
					onPress={() => navigation.navigate({
                        routeName: 'CityCourier'
                    })}
				>
					<Image 
						source={require("../../../../assets/city.png")}
						style={styles.img}
					/>
					<View style={styles.label}>
						<Text style={styles.text}>City Courier</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

Icon.propTypes = {
	navigation: PropTypes.object.isRequired,
	onGenerateToken: PropTypes.func.isRequired
}

export default Icon;
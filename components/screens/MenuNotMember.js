import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Button } from '@ui-kitten/components';

var device = Dimensions.get('window').width;

const MenuNotMember = () => (
	<React.Fragment>
		<View style={{flex: 1, paddingTop: 10, paddingBottom: 0, alignItems: 'center' }}>
			<Text style={styles.textMenuTitle}>DAFTAR MENU</Text>
		</View>
		<View style={styles.container}>
			<View style={styles.content}>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/calendar.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>QOB</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/truck.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>Cek Tarif</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/phone2.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>Halo Pos</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View style={styles.content}>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/calendar.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>Request Pickup</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/history.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>Riwayat Pickup</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconPress}>
					<Image 
						source={require("../../assets/phone2.png")}
						style={styles.img}
					/>
					<View style={styles.subtitle}>
						<Text style={{color: 'black', fontWeight: '700', textAlign: 'center'}}>Lacak Kiriman</Text>
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
		marginTop: 10,
		height: '100%'
	},
	content:{
		flex: 1,
		flexDirection: 'row',
		marginTop: 5
	},
	iconPress: {
		width: device*0.3 - 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 7,
		borderWidth: 0.5,
		borderColor: 'black'
	},
	img: {
		width: device*0.3 - 25, height: device*0.3 - 30
	},
	subtitle: {
		width: '100%', 
		alignItems: 'center',
		padding: 4,
		height: 45
	},
	textMenuTitle: {
		fontFamily: 'open-sans-bold',
		fontSize: 16
	}
})

export default MenuNotMember;
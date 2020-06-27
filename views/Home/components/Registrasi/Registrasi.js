import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from "prop-types";

var {width} = Dimensions.get('window');

const styles = StyleSheet.create({
	image: {
	    width: width * 1,
	    flex: 1
	},
	text: {
    	fontFamily: 'open-sans-bold', 
    	fontSize: 13
    },
    label: {
    	flex: 1, 
    	position: 'absolute', 
    	bottom: 20, 
    	left: 10, 
    	right: 10, 
    	backgroundColor: 'white',
    	borderRadius: 5,
    	padding: 5,
    	elevation: 5
    }
})

const Registrasi = props => {
	const { navigation } = props;
	return(
		<LinearGradient colors={['#e8c61e', '#F5A946', '#ff781f']} style={{flex: 1}}>
			<View style={{flex: 1}}>
				<Image 
					source={require('../../../../assets/banner.png')} 
					resizeMode='contain'
					style = {[styles.image,{overflow: 'visible'}]}
				/>
			</View>
			<View style={styles.label}>
				<Text style={{textAlign: 'center'}}>
					<Text style={styles.text}>Belum memiliki akun?</Text>
					<Text 
						style={[styles.text,{color: 'blue'}]} 
						onPress={() => navigation.navigate({ routeName: 'IndexRegister'})}
					> Daftar disini</Text>
					<Text style={styles.text}>{'\n'}Sudah registrasi di web qposin?</Text>
					<Text 
						style={[styles.text, {color: 'blue'}]}
						onPress={() => navigation.navigate({ 
							routeName: 'Aktivasi'
						})}
					> Aktifasi disini</Text>
					<Text style={styles.text}>{'\n'}Atau pulihkan akun</Text>
					<Text 
						style={[styles.text, {color: 'blue'}]}
						onPress={() => navigation.navigate({ 
							routeName: 'Pemulihan',
							params: {
								title: 'Pemulihan Akun',
								jenis: 2
							}
						})}
					> disini</Text>
				</Text>
			</View>
		</LinearGradient>
	);
}

Registrasi.propTypes = {
	navigation: PropTypes.object.isRequired
}

export default Registrasi;
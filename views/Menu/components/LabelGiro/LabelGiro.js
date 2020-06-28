import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
	root: {
		marginTop: 5
	},
	title: {
		fontWeight: '700', 
		marginLeft: 5, 
		marginRight: 5, 
		textAlign: 'center', 
		fontSize: 16
	},
	labelGiro: {
        padding: 10, 
        elevation: 5, 
        backgroundColor: 'rgb(245, 90, 12)', 
        marginLeft: 5, 
        marginRight: 5, 
        marginBottom: 8,
        marginTop: 5,
        borderRadius: 2
    },
    button: {
    	alignItems: 'center', 
    	flexDirection: 'row', 
    	justifyContent: 'center'
    },
    img: {
    	width: 20, 
    	height: 20
    },
    textImage: {
    	textAlign: 'center', 
        color: '#FFF', 
        paddingLeft: 10, 
        fontWeight: '700', 
        fontSize: 13
    }
})

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const LabelGiro = props => {
	const { user } = props;

	return(
		<View style={styles.root}>
			<Text 
				style={styles.title}
				numberOfLines={1}
			>
				{user.detail.nama}
			</Text>
			{ user.norek === '-' ? 
				<TouchableOpacity 
					style={styles.labelGiro}
					activeOpacity={0.5}
					onPress={props.onPressGiro}
				>
					<View style={styles.button}>
						<Image 
							source={require('../../../../assets/giro.png')} 
							style={styles.img} 
						/>
						<Text style={styles.textImage}>Hubungkan ke akun giro</Text>
					</View>
				</TouchableOpacity> : <TouchableOpacity style={styles.labelGiro} disabled>
					<View style={styles.button}>
						<Image 
							source={require('../../../../assets/giro.png')} 
							style={styles.img} 
						/>
						<Text style={styles.textImage}>Rp {numberWithCommas(user.detail.saldo)}</Text>
					</View>
				</TouchableOpacity>}
		</View>
	);
}

LabelGiro.propTypes = {
	user: PropTypes.object.isRequired,
	onPressGiro: PropTypes.func.isRequired
}

export default LabelGiro;
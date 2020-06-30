import React from "react";
import { View, Text, StyleSheet } from "react-native";  
import { 
	Input,
	Button
} from "@ui-kitten/components";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
	root: {
		margin: 5,
		borderWidth: 0.3,
		padding: 7,
		borderRadius: 3,
		elevation: 3,
		backgroundColor: 'white',
		borderColor: '#b6b8b6'
	},
	button: {
		marginTop: 3
	}
})

const RekeningForm = props => {
	return(
		<View style={styles.root}>
			<Input 
				name='norek'
				value={props.rekening}
				placeholder="Masukan nomor rekening giro"
				label='Rekening'
				labelStyle={{fontFamily: 'open-sans-reg', fontSize: 15, color: 'black'}}
				onChangeText={(e) => props.handleChange(e)}
				// onSubmitEditing={this.onSubmit}
				keyboardType='phone-pad'
				status={props.error && 'danger'}
				caption={props.error && `${props.error}`}
			/>
			<Button style={styles.button} onPress={props.onSubmit}>Hubungkan</Button>
		</View>
	);
}

RekeningForm.propTypes = {
	rekening: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	error: PropTypes.string
}

export default RekeningForm;
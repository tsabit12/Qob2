import React from "react";
import Modal from 'react-native-modal';
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@ui-kitten/components";

const styles = StyleSheet.create({
	root: {
		backgroundColor: '#FFF', 
		borderRadius: 4,
		padding: 20
	},
	text: {
		fontSize: 15
	},
	title: {
		fontSize: 16
	},
	header: {
		paddingBottom: 6,
		marginBottom: 10,
		borderBottomWidth: 0.3,
		borderColor: '#bec3c4'
	},
	content: {
		marginBottom: 5
	},
	footer: {
		flexDirection: 'row',
		marginTop: 15,
		marginBottom: -5,
		justifyContent: 'flex-end'
	},
	button: {
		marginLeft: 10
	}
})

const ModalView = props => {
	if (!props.visible) {
		return null;
	}

	return(
		<Modal isVisible={props.visible} onBackButtonPress={props.onCancle}>
			<View style={styles.root}>
				<View style={styles.header}>
					<Text style={styles.title}>{props.title ? props.title : 'Alert'} </Text>
				</View>
				<View style={styles.content}>
					<Text style={styles.text}>{props.text}</Text>
				</View>
				<View style={styles.footer}>
					{ props.showFooter ? <React.Fragment>
						<Button 
							appearance='outline' 
							style={styles.button}
							onPress={props.onCancle}
						>
							Batal
						</Button>
						<Button 
							appearance='outline' 
							style={styles.button}
							onPress={props.onSubmit}
						>
							Konfirmasi
						</Button>
					</React.Fragment> : 
					<Button 
						appearance='outline' 
						style={styles.button}
						onPress={props.onCancle}
					>
						Tutup
					</Button>}
				</View>
			</View>
		</Modal>
	);
}

ModalView.propTypes = {
	visible: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
	title: PropTypes.string,
	onCancle: PropTypes.func.isRequired,
	onSubmit: PropTypes.func,
	showFooter: PropTypes.bool.isRequired
}

export default ModalView;
import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { List, ListItem, Text, Body, Button } from 'native-base';

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Loading = () => {
	return(
		<View style={styles.containerLoading}>
			<ActivityIndicator size="large" /> 
			<Text style={styles.textLoading}>Memuat Tarif</Text>
		</View>
	)
}


const ViewErr = props => {
	return(
		<View style={[styles.container, {padding: 10}]}>
			<Text style={styles.statusCode}>{props.status}</Text>
			<Text style={styles.message}>{props.msg}</Text>
		</View>
	);
}

const { width, height } = Dimensions.get('window');

const ModalView = props => {
	const [state, setState] = React.useState({
		loading: true
	})

	const { sender, receiver, kiriman } = props;

	React.useEffect(() => {
		if (props.tarif > 0) {
			setState(state => ({
				...state,
				loading: false
			}))
		}else{
			if (props.errors.tarif) {
				setState(state => ({
					...state,
					loading: false
				}))
			}else{ //render loading every user close modal
				setState(state => ({
					...state,
					loading: true
				}))
			}
		}
	}, [props.tarif, props.errors]);

	return(
		<Modal 
			isVisible={props.isVisible}
			onSwipeComplete={props.closeModal}
			swipeDirection='left'
			onBackButtonPress={props.closeModal}
			animationInTiming={600}
		>
			{state.loading ? <Loading /> : <React.Fragment>
				{ props.errors.tarif ? 
					<ViewErr 
						status={props.errors.code} 
						msg={props.errors.tarif} 
					/> : 
					<View style={styles.container}>
						<List>
							<ListItem noIndent>
								<Body>
					                <Text>Pengirim</Text>
					                <Text note>
					                	{sender.name}
					                </Text>
					                <Text note>
					                	{sender.nohp}
					                </Text>
					                <Text note>
					                	{`${sender.alamat}, ${sender.kelurahan}, ${sender.kecamatan}, ${sender.kota}, ${sender.kodepos}` }
					                </Text>
					            </Body>
							</ListItem>
							<ListItem noIndent>
								<Body>
					                <Text>Penerima</Text>
					                <Text note>
					                	{receiver.name}
					                </Text>
					                <Text note>
					                	{receiver.nohp}
					                </Text>
					                <Text note>
					                	{`${receiver.alamat}, ${receiver.kelurahan}, ${receiver.kecamatan}, ${receiver.kota}, ${receiver.kodepos}` }
					                </Text>
					            </Body>
							</ListItem>
							<ListItem noIndent>
								<Body>
					                <Text>Detail Kiriman</Text>
					                <Text note>
					                	{kiriman.isiKiriman}, {kiriman.berat} kg
					                </Text>
					            </Body>
							</ListItem>
							<ListItem noIndent>
								<Body>
					                <Text>Jarak</Text>
					                <Text note>
					                	{`${(props.jarak / 1000).toFixed(1)} km`}
					                </Text>
					            </Body>
							</ListItem>
							<ListItem noIndent>
								<Body>
					                <Text>Total Tarif</Text>
					                <Text note>
					                	{numberWithCommas(props.tarif)}
					                </Text>
					            </Body>
							</ListItem>
						</List>
						<View style={styles.btngroup}>
							<Button danger style={styles.btn} onPress={props.closeModal}>
								<Text>BATAL</Text>
							</Button>
							<Button style={styles.btn} onPress={props.onSubmit}>
								<Text>ORDER</Text>
							</Button>
						</View>
					</View> }
			</React.Fragment> }
		</Modal>
	);
}

ModalView.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	closeModal: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	tarif: PropTypes.number.isRequired,
	sender: PropTypes.object.isRequired,
	receiver: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFF',
		borderRadius: 3
	},
	containerLoading: {
		backgroundColor: '#FFFF', 
		minHeight: height / 5, 
		borderRadius: 10,
		justifyContent: 'center'
	},
	textLoading: {
		textAlign: 'center',
		fontFamily: 'Roboto_medium'
	},
	statusCode: {
		fontFamily: 'Roboto_medium',
		fontSize: 20,
		textAlign: 'center'
	},
	message: {
		fontFamily: 'Roboto-Regular',
		textAlign: 'center'
	},
	btngroup:{
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	btn: {
		flex: 1,
		margin: 5,
		justifyContent: 'center'
	}
})

export default ModalView;
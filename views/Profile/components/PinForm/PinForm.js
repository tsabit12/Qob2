import React from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	Modal, 
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	Alert
} from 'react-native';
import PropTypes from 'prop-types';
import PinView from 'react-native-pin-view';

const { height } = Dimensions.get('window');

const PinForm = props => {
	const [state, setState] = React.useState({
		bounceValue: new Animated.Value(300),
		pin: null,
		previousPin: null
	})

	React.useEffect(() => {
		Animated.spring(state.bounceValue, {
			toValue: 0,
			useNativeDriver: true,
			velocity: 3,
			tension: 2,
			friction: 8
		}).start();
	}, [])

	React.useEffect(() => {
		if (state.pin !== null) {
			Animated.spring(state.bounceValue, {
				toValue: 300,
				useNativeDriver: true,
				velocity: 3,
				tension: 2,
				friction: 8
			}).start();

			props.onChangePin(state.pin);
		}
	}, [state.pin])

	const onSubmitPin = (value, clear) => {
		if (state.previousPin === null) {
			setState(state => ({
				...state,
				previousPin: value
			}))
		}else{
			if (state.previousPin !== value) {
				Alert.alert(
			      `NOTIFIKASI`,
			      `PIN TIDAK SESUAI`,
			      [
			        { text: "OK", onPress: () => console.log("OK Pressed") }
			      ]
			    );
			}else{
				setState(state => ({
					...state,
					pin: value
				}))
			}
		}

		clear();
	} 

	const handleClose = () => {
		Animated.spring(state.bounceValue, {
			toValue: 600,
			useNativeDriver: true,
			velocity: 3,
			tension: 2,
			friction: 8
		}).start();

		setTimeout(function() {
			props.closePin();
		}, 500);
	}

	return(
		<Modal
        	transparent={true}
        	visible={true}
        	//onRequestClose={() => handleClose()}
        	animationType="fade"
        >
        	<TouchableOpacity 
        		style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
        		onPressOut={handleClose}
        		activeOpacity={1} 
        	>
        		<TouchableWithoutFeedback>
					<Animated.View style={[styles.root, { transform: [{translateY: state.bounceValue }] }]}>
						<Text style={styles.title}>
							{state.previousPin === null ? 'MASUKKAN PIN BARU ANDA' : 'KONFIRMASI PIN BARU ANDA' } 
						</Text>
						<PinView
				            onComplete={(val, clear) => onSubmitPin(val, clear) }
				            pinLength={6}
				            buttonActiveOpacity={0.4}
				            buttonBgColor='#ff781f'
				            buttonTextColor='white'
				        />
					</Animated.View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
		marginTop: height / 4.5,
		backgroundColor: 'white',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		justifyContent: 'center'
	},
	title: {
		fontFamily: 'Roboto_medium',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 5,
		fontSize: 17,
		marginBottom: 10
	}
})

PinForm.propTypes = {
	closePin: PropTypes.func.isRequired,
	onChangePin: PropTypes.func.isRequired
}

export default PinForm;
import React from 'react';
import { View, StyleSheet, Animated, Modal, Dimensions, Alert } from 'react-native';
import { Button, Text, Picker, Spinner } from 'native-base';
import PropTypes from 'prop-types';

const { height } = Dimensions.get('window');

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const LoadingView = () => {
	return(
		<View style={[styles.errors, { height: height / 5}]}>
			 <Spinner color='green' />
		</View>
	);
}

const ResultOrder = props => {
	const { sender, receiver, kiriman, user } = props;
	const positionInput = new Animated.Value(100);

	const [state, setState] = React.useState({
		loading: false,
		sendLoading: false,
		jenisPembayaran: '1'
	})

	React.useEffect(() => {
		Animated.spring(positionInput, {
	      toValue: 0,
	      useNativeDriver: true
	    }).start();	
	}, []);

	React.useEffect(() => {
		if (props.tarif > 0) {
			setState(state => ({
				...state,
				loading: false
			}))
		}else if(props.error.tarif){
			setState(state => ({
				...state,
				loading: false
			}))
		}
	}, [props.tarif, props.error])


	React.useEffect(() => {
		if (props.isSuccess) {
			setState(state => ({
				...state,
				sendLoading: false
			}))
		}else{
			if (props.error.order) {
				setState(state => ({
					...state,
					sendLoading: false
				}))
			}
		}
	}, [props.isSuccess, props.error])

	const handleSubmit = () => {
		//make sure user type order button once
		if (!state.sendLoading) {
			if (state.jenisPembayaran === '2') {
				if (Number(user.saldo) < Number(props.tarif)) {
					Alert.alert(
				      `NOTIFIKASI`,
				      `Saldo Anda Tidak Mencukupi, Silahkan Top-Up Terlebih dahulu Lalu Login Kembali Atau Pilih Metode Pembayaran Secara Tunai`,
				      [
				        { text: "OK", onPress: () => console.log("OK Pressed") }
				      ]
				    );
				}else{ //success 
					setState(state => ({
						...state,
						sendLoading: true
					}))

					props.onSubmit(state.jenisPembayaran);
				}
			}else{ //success
				setState(state => ({
					...state,
					sendLoading: true
				}))

				props.onSubmit(state.jenisPembayaran);
			}
			
		}
	}

	const handleChangeType = (value) => {
		if (props.user.norek === '-' && value === '2') {
			Alert.alert(
		      `NOTIFIKASI`,
		      `ANDA BELUM TERHUBUNG KE AKUN GIRO`,
		      [
		        { text: "OK", onPress: () => console.log("OK Pressed") }
		      ]
		    );
		}else{
			setState(state => ({
				...state,
				jenisPembayaran: value
			}))
		}	
	}


	return(
		<Modal
			animationType="fade"
            transparent={true}
		>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
				<Animated.View style={[styles.root, {transform: [{translateY: positionInput }] }]}>
					{state.loading ? <LoadingView /> : <React.Fragment>
						{ props.error.tarif ? <View style={styles.errors}>
								<Text>{props.error.tarif.toUpperCase()}</Text>
							</View> : <View style={styles.content}>
								<Text style={styles.title}>KONFIRMASI ORDER</Text>
								<View style={styles.list}>
									<Text numberOfLines={1}>Pengirim ({sender.name})</Text>
									<Text note>{sender.alamat}</Text>
									<Text note>{sender.kecamatan}, {sender.kelurahan}, {sender.kota}, {sender.kodepos}</Text>
								</View>
								<View style={styles.list}>
									<Text>Penerima ({receiver.name})</Text>
									<Text note>{receiver.alamat}</Text>
									<Text note>{receiver.kecamatan}, {receiver.kelurahan}, {receiver.kota}, {receiver.kodepos}</Text>
								</View>
								<View style={styles.list}>
									<Text>Jarak</Text>
									<Text note>{`${(props.jarak / 1000).toFixed(1)} km`}</Text>
								</View>
								<View style={styles.list}>
									<Text>Isi Kiriman</Text>
									<Text note>{kiriman.isiKiriman}</Text>
								</View>

								<View style={styles.listGroup}>
									<Text style={{marginRight: 10}}>Pilih Pembayaran</Text>
									<Picker
						              note
						              mode="dropdown"
						              style={{ width: 120 }}
						              selectedValue={state.jenisPembayaran}
						              onValueChange={handleChangeType}
						            >
						              <Picker.Item label="Tunai" value="1" />
						              <Picker.Item label="Non Tunai" value="2" />
						            </Picker>
								</View>
						</View> }
					</React.Fragment> }

					<View style={styles.group}>
						{ !state.loading && <React.Fragment>
							{ props.error.tarif ? <Button style={styles.btn} danger onPress={props.closeModal}>
								<Text>Tutup</Text>
							</Button> :  <React.Fragment>
								<Button style={styles.btn} danger onPress={props.closeModal}>
									<Text>BATAL</Text>
								</Button>
								<Button style={styles.btn} onPress={handleSubmit}>
									<Text>
										{state.sendLoading ? 'Loading...' : `ORDER ${numberWithCommas(props.tarif)}`}	
									</Text>
								</Button>
							</React.Fragment> }
						</React.Fragment>}

					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

ResultOrder.propTypes = {
	sender: PropTypes.object.isRequired,
	receiver: PropTypes.object.isRequired,
	kiriman: PropTypes.object.isRequired,
	tarif: PropTypes.number.isRequired,
	isSuccess: PropTypes.bool.isRequired,
	error: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		zIndex: 1,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		minHeight: 70,
		flex: 1
	},
	btn: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 0,
		flex: 1
	},
	group: {
		flexDirection: 'row'
	},
	content: {
		padding: 7,
		marginBottom: 7
	},
	list: {
		marginBottom: 4
	},
	listGroup: {
		marginBottom: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontFamily: 'Roboto_medium',
		marginBottom: 7,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	errors: {
		justifyContent: 'center', 
		height: height / 10,
		alignItems: 'center'
	}
})

export default ResultOrder;
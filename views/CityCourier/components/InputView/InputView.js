import React from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Input, Item, Icon, Button, List, ListItem, Right, Body, Text, Thumbnail, Left, Label } from 'native-base';
import { FontAwesome, Foundation } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ErrorWithAnimated = props => {
	const shakeAnimation = new Animated.Value(0);

	React.useEffect(() => {
		if (props.label) {
			shakeAnimation.setValue(0);
			Animated.sequence([
		      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
		      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
		    ]).start();
		}
	}, [props.label]);

	return(
		<Animated.View style={{ transform: [{translateX: shakeAnimation}]}}>
			<Text style={styles.errorLabel}>{props.label}</Text>
		</Animated.View>
	);
}

const KeloaKiriman = props => {
	const refBerat = React.useRef();
	const refPanjang = React.useRef();
	const lebarRef = React.useRef();
	const tinggiRef = React.useRef();

	const [state, setState] = React.useState({
		field: {
			berat: '',
			panjang: '0',
			lebar: '0',
			tinggi: '0',
			isiKiriman: ''
		},
		errors: {},
		disabled: true
	})

	React.useEffect(() => {
		if (Number(props.jarak) > 15000) {
			Alert.alert(
		      `NOTIFIKASI`,
		      `MAKSIMAL JARAK ADALAH 15 KM`,
		      [
		        { text: "OK", onPress: () => props.resetSenderAndReceiver() }
		      ]
		    );
		    setState(state => ({
				...state,
				disabled: true
			}))
		}else{
			setState(state => ({
				...state,
				disabled: false
			}))
		}
	}, [props.jarak]);

	const { field, errors } = state;

	const handleChange = (value, name) => {
		if (name !== 'isiKiriman') {
			var val = value.replace(/\D/g, '');
			var x 	= Number(val);

			setState(state => ({
				...state,
				field: {
					...state.field,
					[name]:  numberWithCommas(x)
				},
				errors: {
					...state.errors,
					[name]: undefined
				}
			}))
		}else{
			setState(state => ({
				...state,
				field: {
					...state.field,
					[name]:  value
				},
				errors: {
					...state.errors,
					[name]: undefined
				}
			}))
		}
	}

	const handleSubmit = () => {
		const errors = validate(field);
		setState(state => ({
			...state,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			props.onSubmit(field);
		}
	}

	const validate = (field) => {
		const errors = {};
		if (!field.isiKiriman) errors.isiKiriman = 'Isi kiriman tidak boleh kosong';
		if (!field.berat || field.berat.replace(/\D/g, '') <= 0){
			errors.berat = 'Berat harap diisi';	
		}else{
			if (field.berat.replace(/\D/g, '') > 10) errors.berat = 'Berat maksimum 10 kg';
		}

		if (!field.panjang){
			errors.panjang = 'Harap diisi';
		}else{
			if (field.panjang.replace(/\D/g, '') > 50) errors.panjang = 'Maksimum 50';
		}

		if (!field.lebar){
			errors.lebar = 'Harap diisi';
		}else{
			if (field.lebar.replace(/\D/g, '') > 40) errors.lebar = 'Maksimum 40';	
		}

		if (!field.tinggi){
			errors.tinggi = 'Harap diisi';
		}else{
			if (field.tinggi.replace(/\D/g, '') > 30) errors.tinggi = 'Maksimum 30';	
		}
		return errors;
	}

	return(
		<View style={{marginTop: 3}}>
			<Text style={styles.title}>DETAIL ORDER</Text>
			<View style={{margin: 2, marginBottom: 7}}>
				<Item error={errors.isiKiriman ? true : false} floatingLabel>
					<Label>Isi kiriman</Label>
	                <Input 
	                	value={field.isiKiriman}
	                	onChangeText={(text) => handleChange(text, 'isiKiriman')}
	                	style={{fontSize: 16}}
	                />
	            </Item>
				{ errors.isiKiriman && <ErrorWithAnimated label={errors.isiKiriman} /> }
			</View>

			<View style={{margin: 2, marginBottom: 7}}>
				<Item error={errors.berat ? true : false} floatingLabel>
					<Label>Berat kiriman (kg)</Label>
	                <Input 
	                	ref={refBerat}
	                	value={field.berat}
	                	onChangeText={(text) => handleChange(text, 'berat')}
	                	style={{fontSize: 16}}
	                	keyboardType='number-pad'
	                	returnKeyType='done'
	                />
	            </Item>
				{ errors.berat && <ErrorWithAnimated label={errors.berat} /> }
			</View>

            <View style={styles.row}>
            	<View style={styles.marginRow}>
	            	<Item error={errors.panjang ? true : false} floatingLabel>
	            		<Label>Panjang (cm)</Label>
		                <Input 
		                	ref={refPanjang}
		                	value={field.panjang}
		                	onChangeText={(text) => handleChange(text, 'panjang')}
		                	style={{fontSize: 16}}
	                		keyboardType='number-pad'
	                		returnKeyType='done'
		                />
		            </Item>
		            { errors.panjang && <ErrorWithAnimated label={errors.panjang} /> }
	            </View>
	            <View style={styles.marginRow}>
		            <Item error={errors.lebar ? true : false} floatingLabel>
		            	<Label>Lebar (cm)</Label>
		                <Input 
		                	ref={lebarRef}
		                	value={field.lebar}
		                	onChangeText={(text) => handleChange(text, 'lebar')}
		                	style={{fontSize: 16}}
	                		keyboardType='number-pad'
	                		returnKeyType='done'
		                />
		            </Item>
		            { errors.lebar && <ErrorWithAnimated label={errors.lebar} /> }
	            </View>
	            <View style={styles.marginRow}>
		            <Item error={errors.tinggi ? true : false} floatingLabel>
		            	<Label>Tinggi (cm)</Label>
		                <Input 
		                	ref={tinggiRef}
		                	value={field.tinggi}
		                	onChangeText={(text) => handleChange(text, 'tinggi')}
		                	style={{fontSize: 16}}
	                		returnKeyType='done'
	                		keyboardType='number-pad'
		                />
		            </Item>
		            { errors.tinggi && <ErrorWithAnimated label={errors.tinggi} /> }
	            </View>
            </View>
            <View style={{flexDirection: 'row'}}>
	            <Button 
	            	block 
	            	style={{marginTop: 5, flex: 1, borderRadius: 0}} 
	            	onPress={handleSubmit}
	            	disabled={state.disabled}
	            >
	            	<Text style={styles.btnText}>
	            	 	{ props.jarak === 0 ? 'MEMUAT JARAK...' : `CEK TARIF (${Number(props.jarak / 1000).toFixed(1)} km)` }
	            	</Text>
	            </Button>
            </View>
		</View>
	);
}

const InputView = props => {
	const [state, setState] = React.useState({
		field: {
			street: '',
			postalCode: '',
			kecamatan: '',
			name: '',
			nohp: '',
			kelurahan: '',
			kota: '',
			note: ''
		},
		errors: {},
		loading: true
	})

	const { addres } = props;
	const { field, errors } = state;

	React.useEffect(() => {
		if (Object.keys(addres).length > 0) {
			setState(state => ({
				...state,
				field: {
					...state.field,
					postalCode: addres.kodepos,
					street: addres.street,
					kecamatan: addres.kecamatan,
					kelurahan: addres.kelurahan,
					kota: addres.kota
				},
				errors: {},
				loading: false
			}))
		}else{
			setState(state => ({
				...state,
				field: {
					street: '',
					postalCode: '',
					kecamatan: '',
					name: '',
					nohp: '',
					kelurahan: '',
					kota: '',
					note: ''
				}
			}))
		}
	}, [addres]);

	React.useEffect(() => {
		if (props.errors.global) {
			setState(state => ({
				...state,
				field: {
					...state.field,
					street: '',
					postalCode: '',
					kecamatan: '',
					kota: ''
				}
			}))
		}
	}, [props.errors]);

	React.useEffect(() => {
		if (props.markerType === 'receiver') {
			setState(state => ({
				...state,
				field: {
					...state.field,
					street: '',
					postalCode: '',
					kecamatan: '',
					kota: '',
					name: '',
					nohp: '',
					note: ''
				}
			}))
		}
	}, [props.markerType])

	const handleChange = (value, name) => {
		setState(state => ({
			...state,
			field: {
				...state.field,
				[name]: value
			},
			errors: {
				...state.errors,
				[name]: undefined
			}
		}))
	}

	const handleSubmit = () => {
		const errors = validate(field);
		setState(state => ({
			...state,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			const payload = {
				kecamatan: field.kecamatan,
				kota: field.kota,
				kodepos: field.postalCode,
				alamat: field.street,
				name: field.name,
				kelurahan: field.kelurahan,
				nohp: field.nohp,
				note: field.note,
			}

			props.onSubmit(payload);
		}
	}

	const validate = (field) => {
		const errors = {};
		if (!field.name) errors.name = 'Harap diisi';
		if (!field.nohp) errors.nohp = 'Harap diisi';
		if (!field.note) errors.note = 'Harap diisi';
		return errors;
	}

	return(
		<View style={{flex: 1}}>
			{ props.markerType !== 'kosong' ? <React.Fragment>
				 <List>
		            <ListItem noIndent thumbnail>
		            	<Left>
			                <Thumbnail 
			                	square 
			                	small
			                	source={require('../../../../assets/map.png')} 
			                />
						</Left>
			            <Body>
			            	{ state.loading ? <Text>Loading...</Text> : <React.Fragment>
			            		<Text>
			            			{ field.kecamatan ? `${field.kota}, ${field.postalCode}` : 'Geser peta untuk mendapatkan alamat'}
			            		</Text>
			            		<Text note numberOfLines={2}>
				                	{field.street ? `${field.street}, ${field.kelurahan}, ${field.kecamatan}` : '-'} 
				                </Text>
			            	</React.Fragment>}
			            </Body>
		              <Right>
		                <Button transparent onPress={() => props.handleEditAddress()}>
		                  <Text>Edit</Text>
		                </Button>
		              </Right>
		            </ListItem>
		        </List>

		        <Item error={errors.name ? true : false}>
	                <FontAwesome name="street-view" size={20} color={errors.name ? 'red' : '#384850'} style={{marginRight: 3}} />
	                <Input 
	                	placeholder={props.markerType === 'sender' ? 'Nama pengirim' : 'Nama penerima'}
	                	value={field.name}
	                	style={{fontSize: 16}}
	                	onChangeText={(text) => handleChange(text, 'name')}
	                	name='street'
	                	rounded
	                />
	            </Item>
	            { errors.name && <ErrorWithAnimated label={errors.name} /> }

		        <Item error={errors.note ? true : false}>
		        	<Foundation name="clipboard-notes" size={24} color="black" style={{marginRight: 3}} />
	                <Input 
	                	placeholder='Catatan/patokan'
	                	value={field.note}
	                	style={{fontSize: 16}}
	                	onChangeText={(text) => handleChange(text, 'note')}
	                	name='street'
	                	rounded
	                />
	            </Item>

	            { errors.note && <ErrorWithAnimated label={errors.note} /> }

	            <Item error={errors.nohp ? true : false}>
	                <FontAwesome name="phone-square" size={20} color={errors.nohp ? 'red' : '#384850'} style={{marginRight: 3}} />
	                <Input 
	                	placeholder={props.markerType === 'sender' ? 'No Telepon Pengirim' : 'No Telepon Penerima'}
	                	value={field.nohp}
	                	style={{fontSize: 16}}
	                	onChangeText={(text) => handleChange(text, 'nohp')}
	                	name='street'
	                	rounded
	                	keyboardType='number-pad'
	                />
	            </Item>
	            { errors.name && <ErrorWithAnimated label={errors.nohp} /> }

	            <Button 
	            	block 
	            	style={{marginTop: 5}} 
	            	onPress={handleSubmit}
	            	disabled={state.loading}
	            >
	            	<Text style={styles.btnText}>
	            	 	{props.markerType === 'sender' ? 'SIMPAN DATA PENGIRIM' : 'SIMPAN DATA PENERIMA'}
	            	</Text>
	            </Button>
			</React.Fragment> : 
				<KeloaKiriman 
					onSubmit={props.onSubmitKiriman} 
					jarak={props.jarak}
					resetSenderAndReceiver={props.resetSenderAndReceiver}
				/> }
		</View>
	);
}

InputView.propTypes = {
	addres: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
	markerType: PropTypes.string.isRequired,
	onSubmitKiriman: PropTypes.func.isRequired,
	jarak: PropTypes.number,
	handleEditAddress: PropTypes.func.isRequired,
	resetSenderAndReceiver: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	btnText: {
		color: '#FFFF',
		zIndex: 1
	},
	errorLabel: {
		fontSize: 13,
		color: 'red'
	},
	title: {
		//fontWeight: 'bold',
		// fontFamily: 'Roboto_medium',
		textAlign: 'center',
		fontFamily: 'Roboto_medium',
		fontWeight: 'bold'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	item: {
		paddingLeft: 5
	},
	container: {
		
	},
	marginRow: {
		flex: 1, 
		margin: 2, 
		marginBottom: 7,
		marginTop: 5
	}
})

export default InputView;
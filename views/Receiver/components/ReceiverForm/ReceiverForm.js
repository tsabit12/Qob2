import React from "react";
import { View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import PropTypes from "prop-types";
import { List, ListItem, Text } from 'native-base';

const device = Dimensions.get('window').width;

const styles = StyleSheet.create({
	input: {
		marginTop: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'Roboto'
	},
	listText: {
		fontSize: 14,
		fontFamily: 'Roboto'
	},
	list: {
		borderLeftWidth: 0.2, 
		borderRightWidth: 0.2, 
		borderColor: '#c2bfba',
		elevation: 2,
		backgroundColor: 'white',
		height: device*0.5,
	},
	button: {
		marginTop: 4
	}
})

const RenderListCity = props => {
	return(
		<List style={styles.list}>
			<ScrollView nestedScrollEnabled={true}>
				{ props.data.map((row, index) => 
					<ListItem 
						key={index} 
						noIndent
						onPress={() => props.onPressItem(index)}
					>
						<Text style={styles.listText}>{row.kecamatan}, {row.kabupaten}, {row.provinsi}</Text>
					</ListItem> )}
			</ScrollView>
	    </List>
	);
}


const ReceiverForm = props => {
	const nameRef 		= React.useRef();
	const alamatRef 	= React.useRef();
	const queryRef 		= React.useRef();
	const phoneRef 		= React.useRef();
	const emailRef 		= React.useRef();

	const [state, setState] = React.useState({
		data: {
			nama: '',
			alamat: '',
			kodepos: '',
			kecamatan: '',
			kabupaten: '',
			provinsi: '',
			kelurahan: '',
			phone: '',
			email: ''
		},
		query: '',
		loading: false,
		cities: [],
		errors: {},
		choosed: false
	})

	const { data, errors, cities } = state;

	React.useEffect(() => {
		if (state.query.length > 2 && !state.choosed) {
			let timer = setTimeout(() => {
				setState(prevState => ({
					...prevState,
					loading: true,
					errors: {
						global: undefined
					}
				}));
				props.onSearch(state.query)
					.then(res => {
						setState(prevState => ({
							...prevState,
							loading: false,
							cities: res.result
						}))
						queryRef.current.blur();
					})
					.catch(err => {
						if (!err.response.data.errors) {
							setState(prevState => ({
								...prevState,
								loading: false,
								cities: [],
								errors: {
									global: 'Network error'
								}
							}))
						}else{
							setState(prevState => ({
								...prevState,
								loading: false,
								cities: [],
								errors: err.response.data.errors
							}))
						}
					})	
			}, 600);
			return () => {
				clearTimeout(timer)
			}
		}
	}, [state.query]);

	const handleChange = (text, { name }) => {
		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				[name]: text
			},
			errors: {
				...prevState.errors,
				[name]: undefined
			}
		}))
	}

	const handleChangeSearch = (text) => {
		setState(prevState => ({
			...prevState,
			query: text,
			choosed: false
		}))
	}

	const renderIcon = (props) => (
		<Image
		      style={{width: 20, height: 20}} 
		      source={state.loading ? require('../../../../components/icons/loaderInput.gif') : require('../../../../components/icons/location.png')}
		/>
	);

	const onChooseCity = (index) => {
		const citiesChoosed = cities[index];
		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				kodepos: citiesChoosed.kodepos,
				kecamatan: citiesChoosed.kecamatan,
				kabupaten: citiesChoosed.kabupaten,
				provinsi: citiesChoosed.provinsi,
				kelurahan: '-'
			},
			choosed: true,
			query: `${citiesChoosed.kecamatan}, ${citiesChoosed.kabupaten}, ${citiesChoosed.provinsi}`
		}))
	}

	const handleSubmit = () => {
		const errors = validate(state.data);
		setState(prevState => ({
			...prevState,
			errors: {
				...prevState.errors,
				...errors
			}
		}))
		if (Object.keys(errors).length === 0) {
			props.onSubmit(state.data);
		}
	}

	const validate = (data) => {
		const errors = {};
		if (!data.nama) errors.nama ="Nama penerima harap diisi";
		if (!data.alamat){
			errors.alamat ="Alamat harap diisi";	
		}else{
			var re = /[-~`_/'"*+?^${}<>&()%|[\]\\]/;
			if (re.test(data.alamat) === true) errors.alamat = "Alamat tidak boleh mengandung karakter unik";
		}

		if (!data.phone) errors.phone = "Nomor handphone tidak boleh kosong";
		if (!state.query) errors.global = "Kecamatan/kota tidak boleh kosong";
		if (!data.kodepos) errors.kodepos = "Kodepos tidak boleh kosong";
		if (data.email) {
			//regex email
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(data.email)) errors.email = "Email tidak valid";
		}
		return errors;
	}

	return(
		<View style={props.style}>
			<Input 
				ref={nameRef}
				name='nama'
				label='* Nama penerima'
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Masukkan nama penerima'
				value={data.nama}
				onChangeText={(text) => handleChange(text, nameRef.current.props)}
				autoCapitalize='words'
				returnKeyType='next'
				onSubmitEditing={() => alamatRef.current.focus() }
				status={errors.nama ? 'danger' : ''}
				caption={errors.nama && `${errors.nama}`}
			/>
			<Input 
				ref={alamatRef}
				name='alamat'
				value={data.alamat}
				label='* Alamat utama penerima'
				placeholder='Masukkan alamat utama'
				style={styles.input}
				labelStyle={styles.label}
				onChangeText={(text) => handleChange(text, alamatRef.current.props)}
				returnKeyType='next'
				status={errors.alamat ? 'danger' : ''}
				caption={errors.alamat && `${errors.alamat}`}
				onSubmitEditing={() => queryRef.current.focus() }
			/>
			<Input 
				ref={queryRef}
				name='query'
				value={state.query}
				label='* Kecamatan/kota'
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Cari Kecamatan/kota penerima'
				onChangeText={(text) => handleChangeSearch(text)}
				icon={renderIcon}
				status={errors.global ? 'danger' : ''}
				caption={errors.global && `${errors.global}`}
			/>

			{ cities.length > 0 && !state.choosed &&
				<RenderListCity 
					data={cities}
					onPressItem={onChooseCity}
				/> }

			<Input 
				nama='kodepos'
				value={data.kodepos}
				label='* Kodepos'
				disabled
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Cari kecamatan/kota dahulu'
			/>
			<Input 
				name='phone'
				ref={phoneRef}
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Masukkan nomor handphone'
				label='* Nomor handphone'
				value={data.phone}
				onChangeText={(text) => handleChange(text, phoneRef.current.props)}
				returnKeyType='next'
				keyboardType='phone-pad'
				status={errors.phone ? 'danger' : ''}
				caption={errors.phone && `${errors.phone}`}
				onSubmitEditing={() => emailRef.current.focus() }
			/>
			<Input 
				name='email'
				ref={emailRef}
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Masukkan email penerima'
				label='Email penerima'
				value={data.email}
				onChangeText={(text) => handleChange(text, emailRef.current.props)}
				returnKeyType='done'
				keyboardType='email-address'
				autoCapitalize='none'
				status={errors.email ? 'danger' : ''}
				caption={errors.email && `${errors.email}`}
			/>
			<Button 
				status='warning' 
				style={styles.button}
				onPress={handleSubmit}
			>Selanjutnya</Button>
		</View>
	);
}

ReceiverForm.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired
}

export default ReceiverForm;
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
	label: {
		color: 'black',
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	input: {
		marginBottom: 6
	}
})

const FormRequest = props => {
	const useridRef = React.useRef();
	const nameRef = React.useRef();
	const phoneRef = React.useRef();
	const emailRef = React.useRef();

	const { jenis, value, errors } = props;

	return(
		<View>
			<Input 
				ref={useridRef}
				label='Userid'
				name='userid'
				value={value.userid}
				placeholder="Masukkan userid"
				labelStyle={styles.label}
				keyboardType='numeric'
				returnKeyType='next'
				style={styles.input}
				onSubmitEditing={() => nameRef.current.focus() }
				onChangeText={(e) => props.onChange(e, useridRef.current.props)}
				status={errors.userid && 'danger'}
				caption={errors.userid && `${errors.userid}`}
			/>
			<Input 
				ref={nameRef}
				label='Nama'
				name='nama'
				value={value.nama}
				placeholder="Masukkan nama"
				labelStyle={styles.label}
				returnKeyType='next'
				autoCapitalize='words'
				style={styles.input}
				onSubmitEditing={() => phoneRef.current.focus() }
				onChangeText={(e) => props.onChange(e, nameRef.current.props)}
				status={errors.nama && 'danger'}
				caption={errors.nama && `${errors.nama}`}
			/>
			<View style={{marginBottom: 6}}>
				<Text style={[styles.label, {marginBottom: 3}]}>Nomor Handphone</Text>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={[styles.label, {fontSize: 15}]}>+62</Text>
					<Input 
						ref={phoneRef}
						name='nohp'
						value={value.nohp}
						placeholder='8XX-XXXX-XXXX'
						labelStyle={styles.label}
						style={{flex: 1, marginLeft: 6}}
						returnKeyType='next'
						keyboardType='phone-pad'
						onSubmitEditing={() => emailRef.current.focus() }
						onChangeText={(e) => props.onChange(e, phoneRef.current.props)}
						status={errors.nohp && 'danger'}
					/>
				</View>
				{ errors.nohp && <Text style={{fontSize: 12, color: 'red'}}>{errors.nohp}</Text>}
			</View>
			<Input 
				ref={emailRef}
				label='Email'
				name='email'
				value={value.email}
				placeholder="Masukkan email"
				labelStyle={styles.label}
				style={styles.input}
				onSubmitEditing={() => phoneRef.current.focus() }
				returnKeyType='done'
				keyboardType='email-address'
				autoCapitalize='none'
				onChangeText={(e) => props.onChange(e, emailRef.current.props)}
				status={errors.email && 'danger'}
				caption={errors.email && `${errors.email}`}
			/>
			<Button style={{marginTop: 5}} onPress={props.onSubmit}>
				{ jenis === 1 && 'Dapatkan PIN Baru' }
				{ jenis === 2 && 'Pulihkan' }
			</Button>
		</View>
	);
}

FormRequest.propTypes = {
	jenis: PropTypes.number.isRequired,
	value: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired
}

export default FormRequest;
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { 
	Input,
	Button,
	Select,
	CheckBox
} from "@ui-kitten/components";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
	input: {
		marginTop: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
	button: {
		marginTop: 7
	},
	diametrikInput: {
	  	flexDirection: 'row',
		alignSelf: 'stretch',
		paddingBottom: 7,
		marginTop: 5
	},
	inputHitung: {
	  	paddingRight: 4,
	  	padding: 3,
	  	flex: 1
	}
})

const FormOrder = props => {
	const { value, errors } = props;
	const jenisRef = React.useRef();
	const beratRef = React.useRef();
	const panjangRef = React.useRef();
	const lebarRef = React.useRef();
	const tinggiRef = React.useRef();
	const nilaiRef = React.useRef();

	return(
		<View>
			<Input 
		      ref={jenisRef}
		      placeholder='Laptop, baju, sepatu dll'
		      name='isikiriman'
		      label='Isi kiriman'
		      labelStyle={styles.label}
		      style={styles.input}
		      value={value.isikiriman}
		      onChangeText={(e) => props.onChange(e, jenisRef.current.props)}
		      status={errors.isikiriman && 'danger'}
		      onSubmitEditing={() => beratRef.current.focus() }
		      caption={errors.isikiriman && `${errors.isikiriman}`}
		      returnKeyType='next'
			/>
			<Input
		      placeholder='Berat kiriman dalam gram'
		      ref={beratRef}
		      label='Berat (gram)'
		      name='berat'
		      labelStyle={styles.label}
		      keyboardType='phone-pad'
		      style={styles.input}
		      value={value.berat}
		      status={errors.berat && 'danger'}
		      onChangeText={(e) => props.onChange(e, beratRef.current.props)}
		      onSubmitEditing={() => panjangRef.current.focus() }
		      caption={errors.berat && `${errors.berat}`}
		      returnKeyType='next'
		    />
		    { value.jenisKiriman === props.options[0] && 
		    	<View style={styles.diametrikInput}> 
		    		<Input
				      placeholder='XX (CM)'
				      ref={panjangRef}
				      label='Panjang (CM)'
				      name='panjang'
				      labelStyle={styles.label}
				      keyboardType='phone-pad'
				      style={styles.inputHitung}
				      value={value.panjang}
				      status={errors.panjang && 'danger'}
				      onChangeText={(e) => props.onChange(e, panjangRef.current.props)}
				      onSubmitEditing={() => lebarRef.current.focus() }
				      caption={errors.panjang && `${errors.panjang}`}
				      returnKeyType='next'
				    />
				    <Input
				      placeholder='XX (CM)'
				      ref={lebarRef}
				      label='Lebar (CM)'
				      name='lebar'
				      labelStyle={styles.label}
				      keyboardType='phone-pad'
				      style={styles.inputHitung}
				      value={value.lebar}
				      status={errors.lebar && 'danger'}
				      onChangeText={(e) => props.onChange(e, lebarRef.current.props)}
				      onSubmitEditing={() => tinggiRef.current.focus() }
				      caption={errors.lebar && `${errors.lebar}`}
				      returnKeyType='next'
				    />
				    <Input
				      placeholder='XX (CM)'
				      ref={tinggiRef}
				      label='Tinggi (CM)'
				      name='tinggi'
				      labelStyle={styles.label}
				      keyboardType='phone-pad'
				      style={styles.inputHitung}
				      value={value.tinggi}
				      status={errors.tinggi && 'danger'}
				      onChangeText={(e) => props.onChange(e, tinggiRef.current.props)}
				      onSubmitEditing={() => nilaiRef.current.focus() }
				      caption={errors.tinggi && `${errors.tinggi}`}
				      returnKeyType='next'
				    />
		    	</View> }
		    <Input
		      placeholder='Masukan nilai barang'
		      ref={nilaiRef}
		      name='nilai'
		      label='Nilai barang'
		      labelStyle={styles.label}
		      style={styles.input}
		      value={value.nilai}
		      keyboardType='numeric'
		      onChangeText={(e) => props.onChange(e, nilaiRef.current.props)}
		      status={errors.nilai && 'danger'}
		      caption={errors.nilai && `${errors.nilai}`}
		      returnKeyType='done'
		    />
		    <Select
				label='Jenis Kiriman'
		        data={props.options}
		        labelStyle={styles.label}
		        style={{marginTop: 8, marginBottom: 8}}
		        name='jenisKiriman'
		        selectedOption={value.jenisKiriman}
		        onSelect={(e) => props.onChange(e, { name: 'jenisKiriman' })}
		    />
	      	<React.Fragment>
		    	{ props.isCod && value.jenisKiriman === props.options[0] && <CheckBox
				      text='COD'
				      style={{ marginTop: 5 }}
				      textStyle={{ color: 'red'}}
				      status='warning'
				      checked={value.checked}
				      onChange={props.onChakedChange}
				      disabled={!!props.invalid.global}
				    /> }
		    </React.Fragment>
			<Button 
				style={styles.button}
				status='warning'
				onPress={() => props.onSubmit()}
			>
				Selanjutnya
			</Button>
		</View>
	);
}

FormOrder.propTypes = {
	value: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	options: PropTypes.array.isRequired,
	isCod: PropTypes.bool.isRequired,
	onChakedChange: PropTypes.func.isRequired
}

export default FormOrder;
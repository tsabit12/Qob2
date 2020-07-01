import React from "react";
import { View, Text } from "react-native";
import CodeInput from 'react-native-confirmation-code-input';
import PropTypes from "prop-types";

const VerificationForm = props => {
	const confirmRef = React.useRef();

	const onCompletCode = (code) => {
		props.onSubmit(code);
		confirmRef.current.clear();
	}

	return(
		<View>
			<CodeInput
		      keyboardType="numeric"
		      ref={confirmRef}
		      codeLength={6}
		      space={15}
		      size={50}
		      className={'border-b'}
		      autoFocus={true}
		      codeInputStyle={{ fontWeight: '800' }}
		      onFulfill={(code) => onCompletCode(code)}
		      //containerStyle={{backgroundColor: 'black'}}
		      codeInputStyle={{color: '#0f0f0f'}}
		      cellBorderWidth={2.0}
		      inactiveColor='#6e6c6b'
		      activeColor='#fc8b00'
		    />
		</View>
	);
}

VerificationForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

export default VerificationForm;
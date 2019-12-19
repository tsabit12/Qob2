import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { connect } from 'react-redux';
// import { SafeAreaView, Themed } from 'react-navigation';
//import { changeTest } from "../../actions/test";
import { Input } from '@ui-kitten/components';

class Home extends React.Component {
	static navigationOptions = {
		title: null,
		header: null
	};
	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 

		return (
		  <SafeAreaView style={{ paddingTop: 30 }}>
	        <Button
	          onPress={() => this.props.navigation.navigate({
	          	routeName: 'IndexRegister'
	          })}
	          title="Go Register"
	        />
	        <Text>{ test.ktp.nik }</Text>
	        <Input
				placeholder='Test'
				label='Testing'
				labelStyle={{color: 'black'}}
				value='oke'
			/>
	      </SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, null)(Home);
import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { connect } from 'react-redux';
// import { SafeAreaView, Themed } from 'react-navigation';
import { changeTest } from "../../actions/test";

class Home extends React.Component {
	static navigationOptions = {
		title: null,
		header: null
	};
	render() {
		const { navigation, test } = this.props;
    	const { push } = navigation; 
    	// console.log(this.props.test);
		
		return (
		  <SafeAreaView style={{ paddingTop: 30 }}>
	        <Button
	          onPress={() => this.props.navigation.navigate({
	          	routeName: 'IndexRegister'
	          })}
	          title="Go Register"
	        />
	        <Button 
	        	onPress={() => this.props.changeTest()}
	        	title='Test'
	        />
	        <Text>{ test.ktp.nik }</Text>
	      </SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return{
		test: state.register
	}
}

export default connect(mapStateToProps, { changeTest })(Home);
import React from "react";
import { Button, SafeAreaView } from "react-native";
// import { SafeAreaView, Themed } from 'react-navigation';

class Home extends React.Component {
	static navigationOptions = {
		title: null,
		header: null
	};
	render() {
		const { navigation } = this.props;
    	const { push } = navigation;
		
		return (
		  <SafeAreaView style={{ paddingTop: 30 }}>
	        <Button
	          onPress={() => push('Register')}
	          title="Go Register"
	        />
	      </SafeAreaView>
		);
	}
}

export default Home;
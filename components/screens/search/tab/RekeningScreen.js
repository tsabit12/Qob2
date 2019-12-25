import React from "react";
import { View, Text } from "react-native";
import { Layout } from '@ui-kitten/components';

class RekeningScreen extends React.Component{

	render(){
		return(
			<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Rekening</Text>
			</Layout>
		);
	}
}

export default RekeningScreen;
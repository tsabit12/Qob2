import React from "react";
import { View } from "react-native";
import styles from "./styles";
import { Layout, Text } from '@ui-kitten/components';

const Judul = () => (
	<View>
		<Text style={styles.header}>Order</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>Kelola deskripsi kiriman</Text>
	</View>
);

class IndexOrder extends React.Component{
	static navigationOptions = {
		headerTitle: <Judul/>
	};

	render(){
		return(
			<View>
				<Layout style={styles.container}>
					<Text style={styles.text}>Welcome To React Native UI Kitten!</Text>
				</Layout>
			</View>
		);
	}
}

export default IndexOrder;
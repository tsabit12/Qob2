import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  CardHeader,
  Layout,
  Text,
} from '@ui-kitten/components';

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>Detail Transaksi</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>{navigation.state.params.kodeTrans}</Text>
	</View>
);

const Header1 = () => (
	<CardHeader title='Item 1' titleStyle={styles.headerCard}/>
);

const Header2 = () => (
	<CardHeader title='Item 2' titleStyle={styles.headerCard}/>
);

class DetailTrans extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	render(){
		return(
			<Layout>
				<Card style={styles.card} header={Header1} status='success'>
			      <Text>
			        The Maldives, officially the Republic of Maldives, is a small country in South Asia,
			        located in the Arabian Sea of the Indian Ocean
			      </Text>
			    </Card>
			    <Card style={styles.card} header={Header2} status='success'>
			      <Text>
			        The Maldives, officially the Republic of Maldives, is a small country in South Asia,
			        located in the Arabian Sea of the Indian Ocean
			      </Text>
			    </Card>
			</Layout>
		);
	}
}

const styles = StyleSheet.create({
	header: {
	  	fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	card: {
	    margin: 15
	},
	headerCard: {
		fontFamily: 'open-sans-bold'
	}
});

export default DetailTrans;

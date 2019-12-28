import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { ListItem, Button } from '@ui-kitten/components';

const renderItemAccessory = (style, id, accept) => (
	<Button style={style} size='small' status='info' onPress={() => accept(id)}>Pilih</Button>
);

const ListTarif = ({ onAccept }) => (
	<View style={{paddingBottom: 10}}>
		<ListItem
		    title='Rp 100.000'
		    description='PAKET KILAT KHUSUS (2-4 Hari)'
		    accessory={(e) => renderItemAccessory(e, 1, onAccept)}
		/>
		<ListItem
		    title='Rp 240.000'
		    description='EXPRESS NEXT DAY BARANG (1 Hari)'
		    accessory={(e) => renderItemAccessory(e, 2, onAccept)}
		/>
		<ListItem
		    title='Rp 120.000'
		    description='PAKETPOS VALUABLE GOODS (3 Hari)'
		    accessory={(e) => renderItemAccessory(e, 3, onAccept)}
		/>
		<ListItem
		    title='Rp 120.000'
		    description='PAKETPOS DANGEROUS GOODS (3 Hari)'
		    accessory={(e) => renderItemAccessory(e, 4, onAccept)}
		/>
	</View>
);



const Judul = () => (
	<Text style={styles.header}>Pilih Tarif</Text>
)

class PilihTarif extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul/>
	}) 

	onSelectTarif = (id) => {
		this.props.navigation.navigate({
			routeName: 'ResultOrder',
			params: {
				...this.props.navigation.state.params,
				selectedTarif: id
			}
		})
	}
	// componentDidMount(){
	// 	console.log(this.props.navigation.state.params);
	// }

	render(){
		return(
			<View>
				<ListTarif onAccept={this.onSelectTarif} />
			</View>
		);
	}
}

export default PilihTarif;
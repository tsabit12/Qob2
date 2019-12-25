import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Menu } from '@ui-kitten/components';

const Judul = ({ navigation }) => (
	<React.Fragment>
		<Text style={{fontSize: 15}}>Bantuan</Text>
	</React.Fragment>
)

const data = [
  { title: 'Item 1' },
  { title: 'Item 2' },
  { title: 'Item 3' },
  { title: 'Item 4' },
];

class IndexHelper extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul />
	})

	render(){
		return(
			<View style={styles.content}>
				<Menu
			      data={data}
			      selectedIndex={this.selectedIndex}
			      // onSelect={setSelectedIndex}
			    />
			</View>
		)
	}
}

export default IndexHelper;
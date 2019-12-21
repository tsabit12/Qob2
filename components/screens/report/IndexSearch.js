import React from "react";
import {
  Animated,
  Button,
  Platform,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';

const Search = ({ navigation }) => (
	<View>
		<BorderlessButton
	        onPress={() => navigation.navigate({
	        	routeName: 'DetailSearch'
	        })}
	        style={{ marginRight: 15 }}>
	        <Ionicons
	          name="md-search"
	          size={Platform.OS === 'ios' ? 22 : 25}
	          color={SearchLayout.DefaultTintColor}
	        />
	      </BorderlessButton>
	</View>
)

const Judul = () => (
	<View>
		<Text style={{fontSize: 15}}>Cari</Text>
	</View>
);

class IndexSearch extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerRight: <Search navigation={navigation}/>,
		headerTitle: <Judul />
	})

	render(){
		return(
			<View style={styles.container}>
				<Text>Index pencarian sementara hanya pencarian rekening koran</Text>
			</View>
		);
	}
}

export default IndexSearch;
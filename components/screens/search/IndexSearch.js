import React from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";
import { Icon } from '@ui-kitten/components';

 
const Search = ({ navigation }) => (
	<TouchableOpacity 
		onPress={() => navigation.navigate({
	       	routeName: 'DetailSearch'
	    })}
	    style={{marginRight: 10}}
	>
		<Icon name='search-outline' width={30} height={30} />
	</TouchableOpacity>
)

const HeaderKiri = () => (
	<TouchableOpacity style={{marginLeft: 10}}>
		<Icon name='menu-outline' width={30} height={30} />
	</TouchableOpacity>
);


class IndexSearch extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerRight: <Search navigation={navigation}/>,
		title: 'QOB MOBILE',
		headerTitleStyle: { 
	        textAlign:"center", 
	        flex:1,
	        fontFamily: 'open-sans-bold'
	    },
		headerLeft: <HeaderKiri />
	})

	render(){
		return(
			<View style={styles.container}>
				<Menu navigation={this.props.navigation} />
			</View>
		);
	}
}

export default IndexSearch;
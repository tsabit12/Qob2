import React from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";
import { Icon } from '@ui-kitten/components';

const iconBarcode = require("../../../assets/barcode.png");

 
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

const HeaderKiri = ({ navigation }) => (
	<TouchableOpacity 
		onPress={() => navigation.navigate({
	       	routeName: 'Barcode'
	    })}
	    style={{marginLeft: 10}}
	>
		<Image source={iconBarcode} style={{width: 30, height:30}} />
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
		headerLeft: <HeaderKiri navigation={navigation}/>
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
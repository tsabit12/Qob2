import React from "react";
import {
  Animated,
  Button,
  Platform,
  Text,
  StyleSheet,
  View,
  Image
} from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import styles from "./styles";
import { Ionicons } from '@expo/vector-icons';
import SearchLayout from 'react-navigation-addon-search-layout';
import Menu from "../Menu";

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


class IndexSearch extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerRight: <Search navigation={navigation}/>,
		title: 'QOB MOBILE',
		headerTitleStyle: { 
	        textAlign:"center", 
	        flex:1 
	    },
		headerLeft: () => (
	     	<View>
				<BorderlessButton
			        style={{ marginLeft: 15 }}>
			        <Ionicons
			          name="md-menu"
			          size={Platform.OS === 'ios' ? 22 : 25}
			          color={SearchLayout.DefaultTintColor}
			        />
			      </BorderlessButton>
			</View>
	    )
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
import React from "react"
import MyTab from "./MyTab";
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LacakScreen from "./tab/LacakScreen";
import RekeningScreen from "./tab/RekeningScreen";

const Route = createMaterialTopTabNavigator(
  {
    Lacak: LacakScreen,
    Rekening: RekeningScreen,
  },
  {
    tabBarComponent: ({ navigation }) => <MyTab navigation={navigation} />
  }
);


const TabNavigator = createAppContainer(Route);

class SearchTabIndex extends React.Component{
	static navigationOptions = {
	    header: null,
	};

	render(){
		return(
			<TabNavigator />
		);
	}
}

export default SearchTabIndex;
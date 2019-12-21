import React from "react";
import { View, Text } from "react-native"; 
import SearchLayout from 'react-navigation-addon-search-layout';
import { RectButton } from 'react-native-gesture-handler';
import styles from "./styles";

class DetailSearch extends React.Component{
	static navigationOptions = {
	    header: null,
	};

	state = {
		searchText: null
	}

	_handleQueryChange = searchText => {
    	this.setState({ searchText });
  	}

  	_executeSearch = () => {
	    alert('do search!');
	};

	render(){
		const { searchText } = this.state;
		return(
			<SearchLayout
		        onChangeQuery={this._handleQueryChange}
		        onSubmit={this._executeSearch}>
		        {searchText ? (
		          <RectButton
		            style={{
		              borderBottomWidth: styles.hairlineWidth,
		              borderBottomColor: '#eee',
		              paddingVertical: 20,
		              paddingHorizontal: 15,
		            }}
		            onPress={() =>
		              this.props.navigation.navigate('Result', {
		                text: this.state.searchText,
		              })
		            }>
		            <Text style={{ fontSize: 14 }}>{searchText}!</Text>
		          </RectButton>
		        ) : null}
		    </SearchLayout>
		);
	}
}

export default DetailSearch;
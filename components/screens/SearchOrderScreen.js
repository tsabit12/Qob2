import React from "react";
import { View, Text } from "react-native";
import SearchLayout from 'react-navigation-addon-search-layout';

class SearchOrderScreen extends React.Component{
	render(){
		return(
			<React.Fragment>
				<SearchLayout
					placeholder='Masukan tanggal'
			        onChangeQuery={this.handleQueryChange}
			        onSubmit={this.executeSearch}
			        borederBotOpacity={6}
			    >
			        <Text>
			        	Oke
			        </Text>
			    </SearchLayout>
			</React.Fragment>
		);
	}
}

export default SearchOrderScreen;
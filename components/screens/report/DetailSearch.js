import React from "react";
import { View, Text } from "react-native"; 
import SearchLayout from 'react-navigation-addon-search-layout';
import { RectButton } from 'react-native-gesture-handler';
import styles from "./styles";
import { connect } from "react-redux";
import { getRekening } from "../../../actions/search";
import ResultRekening from "./search/ResultRekening";

class DetailSearch extends React.Component{
	static navigationOptions = {
	    header: null,
	};

	state = {
		searchText: null,
		jenis: null,
		errors: {}
	}

	_handleQueryChange = searchText => {
    	this.setState({ searchText });
  	}

  	_executeSearch = () => {
	    this.setState({ jenis: 'Rekening'});
	    const value = 'Rekening';
	    if (value === 'Rekening') {
	    	this.props.getRekening(this.state.searchText)
	    		.catch(err => console.log(err.data))
	    }
	};

	render(){
		const { searchText, jenis } = this.state;
		return(
			<React.Fragment>
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
			          </RectButton>
			        ) : null}
			        { jenis === 'Rekening' && <ResultRekening searchText={searchText} /> }
			    </SearchLayout>
		    </React.Fragment>
		);
	}
}

export default connect(null, { getRekening })(DetailSearch);
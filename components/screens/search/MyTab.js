import React from "react";
import { Tab, TabBar, TabView } from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import styles from "./styles";
import SearchLayout from 'react-navigation-addon-search-layout';
import { RectButton } from 'react-native-gesture-handler';

class MyTab extends React.Component{
	static navigationOptions = {
	    header: null,
	    headerMode: 'none'
	    /* No more header config here! */
	};
	state = {
		searchText: '',
		indexActive: this.props.navigation.state.index,
		activePage: this.props.navigation.state.routes[this.props.navigation.state.index].routeName,
		errors: {}
	};

	UNSAFE_componentWillReceiveProps(nextProps){
		// console.log(nextProps.navigation); 
		if (nextProps.navigation) {
			const { navigation } = nextProps;
			const indexActive = navigation.state.index;
			const activePage = navigation.state.routes[indexActive].routeName;
			this.setState({ indexActive, activePage });
		}
	}
	
	onSelect(navigation, index){
	    const selectedTabRoute = navigation.state.routes[index];
	    navigation.navigate(selectedTabRoute.routeName);
	    // console.log(selectedTabRoute.routeName);
	}

	_handleQueryChange = searchText => {
    	this.setState({ searchText });
  	}

  	_executeSearch = () => {
  		this.setState({ errors: {} });
	    // const value = 'Rekening';
	    // if (value === 'Rekening') {
	    // 	this.props.getRekening(this.state.searchText)
	    // 		.catch(err => this.setState({ errors: {global: err.data.desk_mess }}))
	    // }
	    console.log(this.state.activePage);
	}

	render(){
		const { searchText } = this.state;
		const indexActive = this.props.navigation.state.index;
		const activePage = this.props.navigation.state.routes[indexActive];
		const routeName = activePage.routeName;
		// console.log(this.state);
		
		return(
			<React.Fragment>
				<SearchLayout
					placeholder={routeName === 'Lacak' ? 'Masukan kode barcode' : 'Masukan nomor rekening'}
			        onChangeQuery={this._handleQueryChange}
			        onSubmit={this._executeSearch}>
			        {searchText ? (
			          <RectButton
			            style={{
			              borderBottomWidth: styles.hairlineWidth
			            }}
			            onPress={() => {
			              		this.props.navigation.navigate('Result', {
			                		text: this.state.searchText,
			              		});
			          		}
			            }>
			          </RectButton>
			        ) : null}
			        {/* jenis === 'Rekening' && <ResultRekening searchText={searchText} errors={errors} /> */}
				    <TabBar selectedIndex={this.props.navigation.state.index} onSelect={(e) => this.onSelect(this.props.navigation, e)}>
				        <Tab title='LACAK' style={styles.tab} />
				        <Tab title='REKENING' style={styles.tab} />
				    </TabBar>
			    </SearchLayout>
		    </React.Fragment>
		);
	}
}

export default MyTab;
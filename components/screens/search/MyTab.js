import React from "react";
import { StatusBar, View, TouchableOpacity } from "react-native";
import { Tab, TabBar, TabView, Text, Icon, TopNavigation, TopNavigationAction, Input } from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import styles from "./styles";
import SearchLayout from 'react-navigation-addon-search-layout';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from "react-redux";
import { getRekening, lacakKiriman } from "../../../actions/search";
import Loader from "../../Loader";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


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
		errors: {},
		deletedText: false,
		loading: false
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

  	executeSearch = () => {
  		// this.setState({ errors: {} });
  		const errors = this.validate(this.state.searchText);
  		this.setState({ errors });
  		if (Object.keys(errors).length === 0) {
		    const value = this.state.activePage;
		    if (value === 'Rekening') {
		    	this.setState({ loading: true });
		    	this.props.getRekening(this.state.searchText)
		    		.then(() => {
		    			this.setState({ loading: false });
		    			this.props.navigation.navigate('ResultRekeningSearch', { noRek: this.state.searchText });
		    		})
		    		.catch(err => {
		    			alert(err.data.desk_mess);
		    			this.setState({ errors: {global: err.data.desk_mess }, loading: false});
		    		})
		    }else{
		    	this.props.lacakKiriman(this.state.searchText)
		    		.catch(err => console.log(err));
		    	this.props.navigation.navigate({
		    		routeName: 'LacakBarcode',
	                params: {
	                	externalId: this.state.searchText
	                }
		    	})
		    }
  		}
	    // console.log(this.state.activePage);
	}

	validate = (searchText) => {
		const errors = {};
		if (!searchText) errors.searchText = "Field harap diisi";
		return errors;
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	renderIcon = (style) => (
		<React.Fragment>
			{ this.state.deletedText && 
				<TouchableOpacity onPress={() => this.setState({ deletedText: false, searchText: ''})}> 
					<Icon {...style} name='close-outline'/> 
				</TouchableOpacity> }
		</React.Fragment>
  	)

	renderRightControls = (routeName) => (
		<Input  
			placeholder={routeName === 'Lacak' ? 'Masukan kode barcode' : 'Masukan nomor rekening'}
			style={{flex: 1, width: '100%'}}
			status={this.state.errors.searchText ? 'danger' : 'basic' }
			icon={this.renderIcon}
			onChangeText={(e) => {
				this.setState({ searchText: e });
				if (e.length > 0) {
					this.setState({ deletedText: true });
				}else{
					this.setState({ deletedText: false });
				}
			}}
			value={this.state.searchText}
			caption={this.state.errors.searchText && 'Harap diisi'}
			onSubmitEditing={this.executeSearch}
		/>
	)


	render(){
		const { searchText, errors } = this.state;
		const indexActive = this.props.navigation.state.index;
		const activePage = this.props.navigation.state.routes[indexActive];
		const routeName = activePage.routeName;
		// console.log(this.state);
		
		return(
			<React.Fragment>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    rightControls={this.renderRightControls(routeName)}
				/>
				<Loader loading={this.state.loading} />
			    <TabBar 
			    	selectedIndex={this.props.navigation.state.index} 
			    	onSelect={(e) => this.onSelect(this.props.navigation, e)} 
			    	style={{backgroundColor: 'rgb(240, 132, 0)'}}
			    >
			        <Tab title='LACAK' titleStyle={{color: '#FFF'}} />
			        <Tab title='REKENING' titleStyle={{color: '#FFF'}} />
			    </TabBar>
		    </React.Fragment>
		);
	}
}

export default connect(null, { getRekening, lacakKiriman })(MyTab);
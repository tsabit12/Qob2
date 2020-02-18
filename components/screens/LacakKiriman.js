import React from "react";
import { View, Text, StatusBar, TextInput } from "react-native";
import { Icon, Input } from '@ui-kitten/components';
import Constants from 'expo-constants';
import { connect } from "react-redux";
import { lacakKiriman } from "../../actions/search";

const InputIcon = (style) => (
	<View style={{width: '100%', marginBottom: 20, marginRight: 15, flexDirection: 'row'}}>
		 <TextInput
	      style={{ height: 40, width: 265, borderColor: '#FFF', borderBottomWidth: 0.5, color: '#FFF', fontFamily: 'open-sans-reg', fontSize: 16}}
	      //onChangeText={text => onChangeText(text)}
	      autoFocus={true}
	      value='aku'
	      placeholder='Masukkan external id'
	    />
	    <View style={{height: 40, justifyContent: 'center', borderBottomWidth: 0.5, borderColor: '#FFF'}}>
	    	<Icon name='close-outline' width={25} height={25} fill='#FFF' />
	   	</View>
    </View>
);

const MyStatusBar = () => (
	<View style={{
		height: Constants.statusBarHeight,
  		backgroundColor: 'rgb(240, 132, 0)'
	}}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


class LacakKiriman extends React.Component{
	searchRef = React.createRef();

	state = {
		searching: false,
		textAlign: 'center',
		searchText: '',
		loading: false,
		errors: {}
	}
	
	renderIcon = (style) => (
		<Icon {...style} name={this.state.searching ? 'close-outline' : 'search-outline'}/>
	)

	onIconPress = () => {
		const { searching } = this.state;
		if (searching) {
			this.searchRef.current.blur();
			this.setState({ searching: false, searchText: '', textAlign: 'center' });
		}else{
			this.searchRef.current.focus();
			this.setState({ searching: true });
		}
	}

	onChange = (value) => this.setState({ searchText: value })

	onSearch = () => {
		this.props.lacakKiriman(this.state.searchText);
		this.props.navigation.navigate({
	      routeName: 'LacakBarcode',
	      params: {
	        externalId: this.state.searchText
	      }
	    })
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<View style={{height: 55, backgroundColor: 'rgb(240, 132, 0)', flexDirection: 'row'}}>
					<Input 
						placeholder='Search'
						ref={this.searchRef}
						style={{flex: 1, margin: 5}}
						value={this.state.searchText}
						textStyle={{textAlign: this.state.textAlign, fontFamily: 'open-sans-reg'}}
						onFocus={() => this.setState({ textAlign: 'left', searching: true})}
						icon={this.renderIcon}
						onIconPress={this.onIconPress}
						onChangeText={this.onChange}
						keyboardType='number-pad'
						returnKeyType='search'
						onSubmitEditing={this.onSearch}
						// returnKeyLabel='Done'
					/>
				</View>
			</View>
		);
	}
}

export default connect(null, { lacakKiriman })(LacakKiriman);
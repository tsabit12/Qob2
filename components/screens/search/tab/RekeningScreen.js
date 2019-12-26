import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Layout, List, ListItem, Icon } from '@ui-kitten/components';
import { removeRek } from "../../../../actions/search";

class RekeningScreen extends React.Component{
	state = {
		data: []
	}

	componentDidMount(){
		const { list } = this.props;
		if (Object.keys(list).length > 0) {
			const data = [];
			Object.keys(list).forEach(x => {
				data.push({
					title: x
				})
			});
			this.setState({ data });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		if (nextProps.list) {
			const { list } = nextProps;
			const data = [];
			Object.keys(list).forEach(x => {
				data.push({
					title: x
				});
			})
			this.setState({ data });
		}
	}

	renderItem = ({ item, index }) => (
	    <ListItem 
	    	title={item.title} 
	    	onPress={(e) => this.handleClick(item.title)}
	    	titleStyle={{fontFamily: 'open-sans-reg'}}
	    	accessory={() => this.renderAccessory(item.title)}
	    />
	)

	handleClick = (title) => {
		this.props.navigation.navigate('ResultRekeningSearch', { noRek: title })
	}

	renderAccessory = (item) => (
		<TouchableOpacity onPress={() => this.props.removeRek(item)}>
	    	<Icon name='close-outline' width={18} height={18} />
	    </TouchableOpacity>
	)

	render(){
		const { list } = this.props;
		return(
			<View style={{marginTop: 5}}>
				<List
			      data={this.state.data}
			      renderItem={this.renderItem}
			    />
		    </View>
		);
	}
}

function mapStateToProps(state) {
	return{
		list: state.search.rekening
	}
}

export default connect(mapStateToProps, { removeRek })(RekeningScreen);
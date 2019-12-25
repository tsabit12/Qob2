import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Layout, List, ListItem, Icon } from '@ui-kitten/components';

// const data = new Array(8).fill({
//   title: 'Item',
// });

class LacakScreen extends React.Component{
	state={
		data: [
			{title: '912922888821'},
			{title: '882817727272'},
			{title: 'PSQ000000001'}
		]
	}
	
	renderItem = ({ item, index }) => (
	    <ListItem 
	    	title={item.title} 
	    	onPress={(e) => this.handleClick(item.title)}
	    	titleStyle={{fontFamily: 'open-sans-reg'}}
	    	accessory={() => this.renderAccessory(item.title)}
	    />
	)

	renderAccessory = (item) => (
		<TouchableOpacity onPress={() => this.removeState(item)}>
	    	<Icon name='close-outline' width={20} height={20} />
	    </TouchableOpacity>
	)

	removeState = (item) => {
		const { data } = this.state;
		const newdata = data.filter(x => x.title !== item);
		this.setState({ data: newdata });
	}

	handleClick = (e) => console.log(e);

	render(){
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

export default LacakScreen;
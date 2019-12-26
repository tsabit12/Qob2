import React from "react";
import { View, Text } from "react-native";
import styles from "../styles";
import Timeline from 'react-native-timeline-flatlist'

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.judul}>Lacak Kiriman</Text>
		<Text>{ navigation ? navigation : 'Loading...'}</Text>
	</View>
)

class LacakBarcode extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	    headerTitle: <Judul navigation={navigation.state.params.KodeBarcode} />
	    /* No more header config here! */
	});

	state = {
		id: this.props.navigation.state.params.KodeBarcode,
		data: [
	      {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
	      {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
	      {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
	      {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
	      {time: '16:30', title: 'Event 5', description: 'Event 5 Description'},
	      {time: '16:30', title: 'Event 5', description: 'Event 5 Description'},
	    ]
	}

	render(){
		// console.log(this.props.navigation.state.params.KodeBarcode);
		return(
			 <View style={styles.containerTime}>
		        <Timeline 
		          style={styles.list}
		          data={this.state.data}
		          separator={true}
		          circleSize={20}
		          circleColor='rgb(45,156,219)'
		          lineColor='rgb(45,156,219)'
		          timeContainerStyle={{minWidth:52}}
		          timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13, overflow: 'hidden'}}
		          descriptionStyle={{color:'gray'}}
		          options={{
		            style:{paddingTop:5}
		          }}
		        />
		      </View>
		);
	}
}

export default LacakBarcode;
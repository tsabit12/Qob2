import React from "react";
import { View, Text } from "react-native";
import { Input } from "@ui-kitten/components";

const Judul = ({ navigation }) => (
	<View>
		<Text style={{fontSize: 16, fontWeight: '700'}}>
			Rekening Koran
		</Text>
	</View>
)

class RekKoran extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	state  = {
		norek: ''
	}

	onChange = (e) => this.setState({ norek: e })

	render(){
		const { norek } = this.state;
		return(
			<View>
				<Input 
					value={norek}
					label='Nomor Rekening'
					placeholder='Masukan nomor Rekening'
					onChangeText={this.onChange}
				/>
			</View>
		);
	}
}

export default RekKoran;
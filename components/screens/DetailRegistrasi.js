import React from "react";
import { View, Text } from "react-native";
import { TextField } from 'react-native-material-textfield';
import Dialog from "react-native-dialog";
import { RaisedTextButton } from 'react-native-material-buttons';

const DataLengkap = ({ datanya, onNext }) => (
	<View>
		<TextField
          value={datanya.fullname}
          disabled={true}
          returnKeyType='next'
          label='Nama Lengkap'
        />
        <TextField
          value={datanya.gender}
          disabled={true}
          returnKeyType='next'
          label='Gender'
        />
        <TextField
          value={datanya.birthPlace}
          disabled={true}
          returnKeyType='next'
          label='Tempat Lahir'
        />
        <TextField
          value={datanya.birtDate}
          disabled={true}
          returnKeyType='next'
          label='Tanggal Lahir'
        />
        <TextField
          value={datanya.city}
          disabled={true}
          returnKeyType='next'
          label='Kota'
        />
        <TextField
          value={datanya.alamat}
          disabled={true}
          returnKeyType='next'
          label='Alamat'
        />
        <View style={{paddingTop: 10, paddingBottom: 10}}>
        	<RaisedTextButton
              onPress={() => onNext()}
              title='Selanjutnya'
              color='red'
              titleColor='white'
            />
        </View>
	</View>
);

class DetailRegistrasi extends React.Component{
	constructor(props) {
    	super(props);
    	
    	this.onFocus = this.onFocus.bind(this);
    	this.handleCancel = this.handleCancel.bind(this);
    	this.onValidasi = this.onValidasi.bind(this);
    	this.fullnameRef = this.updateRef.bind(this, 'fullname');
    	this.motherRef = this.updateRef.bind(this, 'mother');

    	this.state = {
    		data: {},
    		errors: {},
    		mother: '',
    		visible: true,
    		isValid: false,
    		loading: false
    	}
	}

	componentDidMount(){
		const { listdata } = this.props;
		const parsing = listdata.split('|');
		const data = {
			nik: parsing[0],
			fullname: parsing[1],
			alamat: parsing[2],
			city: parsing[10],
			prov: parsing[13],
			kec: parsing[4],
			motherName: parsing[12],
			gender: parsing[16],
			birthPlace: parsing[15],
			birtDate: parsing[17]
		}
		this.setState({ data: data });
	}

	updateRef = (name, ref) => {
	    this[name] = ref;
	}

	onFocus = () => {
	    let { errors = {} } = this.state;

	    for (let name in errors) {
	      let ref = this[name];

	      if (ref && ref.isFocused()) {
	        delete errors[name];
	      }
	    }
	    this.setState({ errors });
	}

	onChangeMother = (text) => {
		['mother']
	      .map((name) => ({ name, ref: this[name] }))
	      .forEach(({ name, ref }) => {
	        if (ref.isFocused()) {
	          this.setState({ [name]: text });
	        }
	     });
	}

	handleCancel = () => {
		this.setState({ visible: false });
		this.props.onCancel();
	}

	onValidasi = () => {
		let errors = {};
		const { motherName } = this.state.data;
		['mother']
	      .forEach((name) => {
	        let value = this[name].value();
	        if (!value) {
	        	errors[name] = 'Harap diisi';
	        }else if(value.toLowerCase() !== motherName.toLowerCase()){
	        	errors[name] = 'Data tidak valid';
	        }
	    });

	    this.setState({ errors });

	    if (Object.keys(errors).length === 0) {
	    	this.setState({ isValid : true, visible: false });
	    }
	}

	onNext = () => this.props.doneValidation(this.state.data)

	render(){
		const { data, errors, visible, isValid } = this.state;

		return(
			<View>
		        <Dialog.Container visible={visible}>
		          <Dialog.Description>
		          	Data ditemukan, harap validasi nama ibu kandung
		          </Dialog.Description>
		            <View style={styles.textValidasi}>
		            { Object.keys(data).length > 0 &&  <TextField
			              ref={this.motherRef}
			              autoCorrect={false}
			              onFocus={this.onFocus}
			              value={this.state.mother}
			              onChangeText={this.onChangeMother}
			              formatText={this.formatText}
			              error={errors.mother}
			              returnKeyType='next'
			              label='Nama Ibu Kandung'
			              autoFocus
			            /> }
			        </View>
		          <Dialog.Button label="Batal" onPress={this.handleCancel} />
		          <Dialog.Button label="Oke" onPress={this.onValidasi} />
		        </Dialog.Container>
		        { isValid && <DataLengkap datanya={data} onNext={this.onNext} />}
		    </View>
		);
	}
}

let styles = {
  contentContainer: {
    paddingTop: 8,
  },
  textValidasi: {
  	paddingLeft: 10,
  	paddingRight: 10
  }
};


export default DetailRegistrasi;
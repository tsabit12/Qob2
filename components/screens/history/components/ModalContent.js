import React from "react";
import { View, Text, StyleSheet } from "react-native"

const styles = StyleSheet.create({
	judul: {
		fontSize: 16,
		color: '#696868'
	},
	subjudul: {
		fontSize: 16,
		marginTop: 4,
		marginBottom: 4,
		color: '#bfbfbf'
	}
})

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const numberWithCommas = (number) => {
	//not number
	if (isNaN(number)) {
		return number;
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}


const ModalContent = ({ data }) => {
	console.log(data);
	return(
		<View style={{margin: 15}}>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>External ID</Text>
		      	<Text style={styles.subjudul}>{data.extid}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Nama Pengirim</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.shippername)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Nama Penerima</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.receivername)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Alamat Pengirim</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.shipperfulladdress)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Alamat Penerima</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.receiverfulladdress)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Nama Produk</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.productname)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Isi Kiriman</Text>
		      	<Text style={styles.subjudul}>{capitalize(data.desctrans)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>{ data.va ? 'Nilai COD' : 'Nilai Barang'}</Text>
		      	<Text style={styles.subjudul}>{numberWithCommas(data.valuegoods)}</Text>
	      	</View>
	      	<View style={styles.list}>
		      	<Text style={styles.judul}>Riwayat Status Terakhir</Text>
		      	<Text style={styles.subjudul}>{data.lasthistorystatus ? data.lasthistorystatus : '-'}</Text>
	      	</View>
	      	<View style={styles.lastList}>
		      	<Text style={styles.judul}>Pickup Number</Text>
		      	<Text style={styles.subjudul}>{data.pickupnumber ? data.pickupnumber : '-'}</Text>
	      	</View>
	    </View>
	);	
}

export default ModalContent;
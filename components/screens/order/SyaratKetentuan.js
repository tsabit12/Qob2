import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Icon } from '@ui-kitten/components';

const html = `
      <html>
      <head></head>
      <body>
      	<h1>Syarat Dan Ketentuan</h1>
        <p style='text-align: justify; font-size: 28'>
        	1. QPOSin AJA merupakan aplikasi resmi PT Pos Indonesia (Persero) yang dapat digunakan oleh seluruh masyarakat Indonesia untuk melakukan pemesanan 
            pengiriman surat atau paket yang akan dijemput oleh petugas pickup atau menyerahkan kirimannya ke loket kantor pos terdekat.
            Pada aplikasi ini pelanggan dapat melakukan sendiri entri data pengirimannya dan melakukan permintaan penjemputan kiriman dilokasi pengiriman/pelanggan. 
        </p>
        <p style='text-align: justify; font-size: 28'>
        	2. Lembar kode booking yang dihasilkan dari aplikasi ini bukan merupakan Resi Pengiriman Pos. Resi Pengiriman Pos akan dikeluarkan oleh Petugas Loket outlet Pos Indonesia.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	3. Data yang dientri oleh Pelanggan akan diverifikasi ulang oleh Petugas Loket outlet Pos Indonesia. Petugas Loket berhak mengubah data sesuai dengan kondisi aktual kiriman. Misalnya apabila ada ketidaksesuaian berat kiriman, akan dilakukan koreksi sehingga tidak menutup kemungkinan Tarif Pengiriman ikut terkoreksi.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	4. Apabila ada ketidaksesuaian asal dan tujuan pengiriman, maka harus dilakukan order ulang menggunakan aplikasi QPOSin AJA.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	5. Pelanggan menyetujui syarat dan ketentuan yang berlaku.
        </p>
        <h1>Syarat Dan Ketentuan Pengiriman</h1>
        <p style='text-align: justify; font-size: 28'>
        	1. Berat maksimal kiriman Surat adalah 2.000 gram.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	2. Untuk kiriman Paket berat kiriman adalah di atas 2.000 gram dan kurang dari 30.000 gram.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	3. Ukuran dimensi maksimal kiriman baik yang berbentuk kotak, gulungan atau tidak beraturan adalah Panjang + (2x (Lebar + Tinggi)) = 400 cm dengan dimensi terpanjang maksimal adalah 90 cm.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	4. Penentuan tarif kiriman ditentukan dengan cara, sebagai berikut:
        	<li style='margin-left: 20; margin-top: -20; font-size: 28'>
        		Menggunakan berat aktual kiriman (actual weight).
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Menggunakan perhitungan volumetric untuk kiriman berbentuk kotak atau gulungan yang dikonversi menjadi berat dengan rumus (Panjang x Lebar x Tinggi x 1 Kg) / 6.000.
        	</li>
        </p>
        <p style='text-align: justify; font-size: 28'>
        	5. Standar Waktu Penyerahan (SWP) adalah maksimal H+2 kota tujuan dalam Jawa.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	6. Setiap pengirim berhak mendapatkan bukti pengiriman berupa resi atau daftar pengiriman.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	7. PT Pos Indonesia (Persero) bertanggung jawab terhadap kiriman yang dikirim bila pengirim telah membayar lunas semua biaya pengiriman dan biaya lainnya (kecuali bila ada kesepakatan tertentu, termasuk pembayaran kredit bagi pelanggan dengan Perjanjian Kerja Sama).
        </p>
        <p style='text-align: justify; font-size: 28'>
        	8. Selama belum diserahkan kepada penerima, hak atas kiriman masih berada di tangan pengirim, oleh karena itu tuntutan ganti rugi atas kehilangan/kerusakan kiriman hanya dapat diajukan oleh pengirim.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	9. Pernyataan tertulis pengirim tentang isi kiriman pada formulir pengiriman, harus sama dengan isi kiriman sebenarnya. Bila tidak sesuai, maka pengirim bertanggung jawab sepenuhnya atas segala dampak yang timbul akibat pelanggaran hukum yang dilakukannya.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	10. PT Pos Indonesia (Persero) hanya bertanggung jawab terhadap kerusakan fisik isi kiriman, dan tidak bertanggung jawab serta tidak memberikan ganti rugi atas kiriman yang diakibatkan oleh:
        	<li style='margin-left: 20; margin-top: -20; font-size: 28'>
        		Kerugian atau kerusakan yang disebabkan unsur kesengajaan oleh pengirim.
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Pelanggaran terhadap aturan Dangerous Goods, Prohibited Items dan Restricted Items.
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Isi kiriman yang tidak sesuai dengan pernyataan tertulis pada Bukti / Formulir Pengiriman.
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Semua risiko teknis yang terjadi selama dalam pengangkutan, yang menyebabkan barang yang dikirim tidak berfungsi atau berubah fungsinya baik yang menyangkut mesin atau sejenisnya maupun barang-barang elektronik seperti halnya : handphone, kamera, radio/tape dan lain-lain yang sejenis.
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Kerugian atau kerusakan sebagai akibat oksidasi, kontaminasi polusi dan reaksi nuklir.		
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Kerugian atau kerusakan akibat force majeure seperti: bencana alam, kebakaran, perang, huru-hara, aksi melawan pemerintah, pemberontakan, perebutan kekuasaan atau penyitaan oleh penguasa setempat.
        	</li>
        	<li style='margin-left: 20; font-size: 28'>
        		Kerugian tidak langsung atau keuntungan yang tidak jadi diperoleh, yang disebabkan oleh kekeliruan dalam penyelenggaraan pos (UU No. 38 tahun 2009).
        	</li>
        </p>
        <p style='text-align: justify; font-size: 28'>
        	11. Biaya kirim yang ditampilkan pada QPOSin AJA masih berupa estimasi.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	12. Apabila terdapat perbedaan antara estimasi biaya kirim pada QPOSin AJA dengan biaya kirim di Outlet Pos Indonesia, maka biaya yang dikenakan untuk pengiriman adalah biaya kirim di Outlet Pos Indonesia.
        </p>
        <h1>Barang yang Dilarang Untuk Dikirim</h1>
        <p style='text-align: justify; font-size: 28'>
        	1. Bahan yang rentan terhadap oksidasi, seperti: bubuk pemutih, peroksidan dll.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	2. Accu atau baterai basah.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	3. Makanan basah atau berminyak.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	4. Benda yang dapat meledak atau menyala atau barang yang dapat terbakar sendiri seperti senjata api, peluru dan bahan peledak, mercon atau sejenisnya serta segala macam korek api dan gas pengisinya.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	5. Binatang hidup kecuali lebah, lintah, ulat sutera, parasit, serangga dan serangga pembasmi serangga perusak yang dikirim oleh badan yang diakui resmi.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	6. Uang logam, uang kertas Bank dan surat berharga bagi pengunjuk, platina, emas atau perak yang telah dikerjakan atau belum, permata, perhiasan dll.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	7. Barang yang menyinggung kesusilaan.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	8. Candu morfin, kokain dan obat terlarang lainnya.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	9. Bahan biologis yang mudah busuk dan mudah menularkan penyakit.
        </p>
        <p style='text-align: justify; font-size: 28'>
        	10. Barang lainnya yang menurut peraturan perundang-undangan dinyatakan terlarang.
        </p>
      </body>
      </html>
    `;

const SyaratKetentuan = ({ visible, handleClose }) => {
	return(
		 <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          // }}
          >
          <View style={{margin: 10, flex: 1}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 6, flex: 1, borderWidth: 1, borderColor: '#dbdbd9', elevation: 5}}>
            	<View style={{marginTop: 15, height: 25}} />
              	<TouchableOpacity 
              		style={{
              			position: 'absolute',
              			width: '10%',
              			right: 0,
              			margin: 6
              		}} 
              		onPress={() => handleClose()}
              	>
	              	<Icon name='close-outline' width={30} height={30} />
	            </TouchableOpacity>
            	<WebView
			        originWhitelist={['*']}
			        source={{ html }}
			        style={{margin: 6}}
			    />
            </View>
          </View>
        </Modal>
	);
}

export default SyaratKetentuan;
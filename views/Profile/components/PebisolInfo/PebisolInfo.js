import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Body, Text } from 'native-base';

const PebisolInfo = props => {
	const { detail, userid } = props;

	return(
		<List>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Userid</Text>
                	<Text note>
                		{userid}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Email</Text>
                	<Text note>
                		{detail.email}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>No Handphone</Text>
                	<Text note>
                		{detail.nohp}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Alamat Utama</Text>
                	<Text note>
                		{detail.alamatOl}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Detail Alamat</Text>
                	<Text note>
                		{detail.kelurahan}, {detail.kecamatan}, {detail.kota}, {detail.provinsi} ({detail.kodepos})
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Nama Oline Shop</Text>
                	<Text note>
                		{detail.namaOl}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Jenis Oline Shop</Text>
                	<Text note>
                		{detail.jenisOl}
                	</Text>
                </Body>
            </ListItem>
        </List>
	);
}


PebisolInfo.propTypes = {
	detail: PropTypes.object.isRequired,
	userid: PropTypes.string.isRequired
}

export default PebisolInfo;
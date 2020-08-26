import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Body, Text } from 'native-base';

const UserInfo = props => {
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
                		{detail.kelurahan}, {detail.kecamatan}, {detail.kota}, {detail.provinsi}
                	</Text>
                </Body>
            </ListItem>
            <ListItem noIndent>
            	<Body style={{marginLeft: -15}}>
                	<Text>Kodepos</Text>
                	<Text note>
                		{detail.kodepos}
                	</Text>
                </Body>
            </ListItem>
        </List>
	);
}


UserInfo.propTypes = {
	detail: PropTypes.object.isRequired,
	userid: PropTypes.string.isRequired
}

export default UserInfo;
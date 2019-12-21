import React from "react";
import Dialog from "react-native-dialog";
import { View, Text } from "react-native";

const Modal = ({ loading, text, handleClose }) => (
	<View>
        <Dialog.Container visible={loading}>
          <Dialog.Description>
          	{ text }
          </Dialog.Description>
          <Dialog.Button label="Tutup" onPress={() => handleClose()} />
        </Dialog.Container>
    </View>
);

export default Modal;
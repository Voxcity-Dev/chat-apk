import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Icon } from "@rneui/themed";
import * as DocumentPicker from 'expo-document-picker';

export default function FileInput(props) {
  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.assets) {
        let files;
        if (props.files) {
          files = [...props.files, ...result.assets];
        } else {
          files = [result];
        }
        props.setFiles(files); // Adiciona o arquivo selecionado ao array de arquivos
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const removeFile = (index) => {
    props.clearMessage(); 
  }

  function limitMessage(message) {
    if (message?.length > 20) {
        return message.substring(0, 30) + '...';
    } else {
        return message;
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.iconsStyle} onPress={pickDocument}>
        <Icon name="attach-sharp" type="ionicon" size={25} color={"#9ac31c"} />
      </TouchableOpacity>
      <View style={styles.container}>
        {props.files?.length > 0 && (
          <View style={styles.filesShow}>
            {props.files?.map((file, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: "#FFF" }}>Arquivo em anexo: {limitMessage(file.name)}</Text>
                <TouchableOpacity style={{ margin: 10 }} onPress={() => removeFile(index)}>
                  <Icon name="close-sharp" type="ionicon" size={25} color={"#9ac31c"} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  iconsView: {
    width: "25%",
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#142a4c",
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  filesShow: {
    position: 'absolute',
    bottom: 40,
    right: -60,
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    justifyContent: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Linking,Image} from 'react-native';
import { Icon } from '@rneui/themed';


export default function FileMsg(props) {

  return (
    <View key={props.index} style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={{ fontSize: 12, textAlign: 'left' }}>{props.item.from === props.user._id ? null : props.item.fromUsername}</Text>
        {
            props.item.files.map((file,index)=>{
                if (file.type.includes('image')) {
                    return (
                      <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
                        <Image source={{uri: file.url}} style={{width: 100, height: 100}}/>
                        <Text>{file.name}</Text>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                          <Icon name="document-text-sharp" type="ionicon" size={20} style={styles.icon} />
                          <Text>{file.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
            })
        } 
    </View>
  );
}



const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '80%',
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDEDED',
  }
});

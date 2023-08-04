import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/themed';

export default function HiddenButtons(props) {

    let replyCor = props.replyCor

  return (
    <View style={styles.optionsContainer}>
            <TouchableOpacity style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: replyCor,
              borderRadius: 5,
              marginHorizontal: 5,
            }}>
              <Icon name='arrow-undo-outline' type='ionicon' style={styles.icone} color={"#9ac31c"} />
              <Text style={styles.optionText}>Responder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: replyCor,
              borderRadius: 5,
              marginHorizontal: 5,
            }}>
              <Icon name='arrow-redo-outline' type='ionicon' style={styles.icone} color={"#9ac31c"} />
              <Text style={styles.optionText}>Encaminhar</Text>
            </TouchableOpacity>
          </View>
  )
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
    },
    messageText: {
      fontSize: 16,
    },
    replyMessages: {
      backgroundColor: '#FFF',
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
    optionText: {
      fontSize: 14,
      color: "#142a4c"
    },
  });
  

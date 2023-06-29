import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


export default function MessagesMsg(props) {

  return (
    <View key={props.index} style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={{ fontSize: 12, textAlign: 'left' }}>{props.item.from === props.user._id ? null : props.item.fromUsername }</Text>
        <Text style={styles.messageText}>{props.item.message}</Text>
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
  },
    messageText: {
    fontSize: 16,
  },
});

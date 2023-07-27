import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


export default function MessagesMsg(props) {

  
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - date.getTime();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    if (timeDiff >= 48 * 60 * 60 * 1000) {
      // Já passou mais de 48 horas
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    } else if(timeDiff >= 24 * 60 * 60 * 1000) {
        // Já passou mais de 24 horas
        return `${"    "}Ontem`;
    } else {
    return `${"     "}${hours}:${minutes}`;
    }
}

  return (
    <View key={props.index} style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={{ fontSize: 12, textAlign: 'left' }}>{props.item.from === props.user._id ? null : props.item.fromUsername }</Text>
        <Text style={styles.messageText}>{props.item.message}</Text>
        <Text style={{ fontSize: 8, textAlign: 'right',color:'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
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

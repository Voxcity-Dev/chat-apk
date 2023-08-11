import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import File from './file';
import Audio from './audio';
import MessagesMsg from './messages';


export default function Forward(props) {
  const { item, index, isSentMessage, user } = props
  const [reply, setReply] = useState({ ...item.forwarding })

  useEffect(() => {
    if (item.forwarding) {
      setReply(item.forwarding)
    }
  }, [item])

  let Types = {
    file: <File key={index} item={reply} isReply={true} user={user} />,
    audio: <Audio key={index} item={reply} isReply={true} user={user} />,
  };


  return (
      <View key={index} style={[styles.messageContainer, isSentMessage ? styles.sentMessage : styles.receivedMessage]} >
        <Text style={{ fontSize: 12, textAlign: 'left', marginBottom: 5,fontWeight:"bold",color:"#142a4c" }}>Encaminhada</Text>
        {
          reply.msgTypo === 'text' || reply.reply ? <MessagesMsg key={index} item={reply} isReply={true} user={user} /> :
            reply && Types[reply.msgTypo]
        }
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12 }}>{item?.message}</Text>
        </View>
      </View>

  )

}

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
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
});

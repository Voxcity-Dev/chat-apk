import React, { useState } from 'react';
import { View } from 'react-native';
import MessageScreen from './MessageScreen/messageScreen';
import MessageSender from './MessageSender/messageSender';

export default function ChatComponent(props) {

  return (
    <View style={{ flex: 1,width:"100%",height:"100%" }}>

      <MessageScreen tipo={props.tipo} />
      
      <MessageSender tipo={props.tipo} />

    </View>
  );
}

import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet,Image } from 'react-native';
import { UserContext } from '../../context/UserProvider';
import MessageScreen from './MessageScreen/messageScreen';

export default function ChatComponent(props) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');


  const sendMessage = () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      text: inputText.trim(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };


  return (
    <View style={{ flex: 1,width:"100%" }}>

      <MessageScreen tipo={props.tipo} />
      
      <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%"}}>
        <TextInput
          style={{ paddingHorizontal: 10, height: 40, borderColor: '#142a4c',width:"86%"}}
          placeholder="Digite uma mensagem"
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: '#142a4c' }}
          onPress={sendMessage}
        >
          <Text style={{ color: 'white' }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    // ...
  },
  messageList: {
    flexGrow: 1,
  },
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
    // ...
  },
  groupNameContainer: {
    backgroundColor: '#9ac31c',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    border: 'none',
  },
  groupNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },contactNameContainer:{
    backgroundColor: '#9ac31c',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    border: 'none',
  },
  contactNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },icone:{
    margin: 5,
    padding: 3,
    resizeMode: 'stretch',
    alignItems: 'center',
    color:"#FFF",
  }
});

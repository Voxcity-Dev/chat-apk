import React, { useState, useEffect,useContext } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet,Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';
import { GroupContext } from '../../../context/GroupProvider';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { useNavigation } from '@react-navigation/native';
import Header from './header';

export default function MessageScreen(props) {
  const { user } = useContext(UserContext);
  const { selectedContact,setSelectedContact } = useContext(ContactContext);
  const { selectedGroup,setSelectedGroup } = useContext(GroupContext);
  const { selectedAtendimento,setSelectedAtendimento } = useContext(AttendanceContext);
  const [visibleMessages, setVisibleMessages] = useState(10);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (props.tipo === 'private') {
      const newMessages = selectedContact.allMessages|| [];
      setMessages(newMessages);
    } else if (props.tipo === 'group') {
      const newMessages = selectedGroup.allMessages || [];
      setMessages(newMessages);
    }else if(props.tipo === 'att'){
      const newMessages = selectedAtendimento.allMessages || [];
      setMessages(newMessages);
    }
  }, [selectedContact, selectedGroup]);

  useEffect(() => {
    if (props.tipo === 'private') {
      const newMessages = selectedContact.allMessages|| [];
      setMessages(newMessages);
    } else if (props.tipo === 'group') {
      const newMessages = selectedGroup.allMessages || [];
      setMessages(newMessages);
    }else if(props.tipo === 'att'){
      const newMessages = selectedAtendimento.allMessages || [];
      setMessages(newMessages);
    }
  }, [selectedContact, selectedGroup]);


  const renderMessage = ({ item, index }) => {
    if (index < messages.length - visibleMessages) {
      return null; // Não renderizar mensagem além do limite visível
    }
    let isSentMessage;
    if (selectedContact) {
      isSentMessage = item.from !== selectedContact._id;
    } else if (selectedGroup) {
      isSentMessage = item.from == user._id;
    }
    else if(selectedAtendimento){
      isSentMessage = item.from === user._id;
    }

    return (
      <View style={[styles.messageContainer, isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={{ fontSize: 12, textAlign: 'right' }}>{item.fromUsername}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };


  return (
    <View style={{ flex: 1,width:"100%" }}>

      <Header />      

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messageList}
      />

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

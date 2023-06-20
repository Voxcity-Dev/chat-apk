import React, { useState, useEffect,useContext } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet,Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { UserContext } from '../../context/UserProvider';
import { ContactContext } from '../../context/ContacProvider';
import { GroupContext } from '../../context/GroupProvider';
import { useNavigation } from '@react-navigation/native';

export default function ChatComponent(props) {
  const { user } = useContext(UserContext);
  const { selectedContact,setSelectedContact } = useContext(ContactContext);
  const { selectedGroup,setSelectedGroup } = useContext(GroupContext);
  const [visibleMessages, setVisibleMessages] = useState(10);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (props.tipo === 'privado') {
      const newMessages = selectedContact.allMessages|| [];
      setMessages(newMessages);
    } else if (props.tipo === 'grupo') {
      const newMessages = selectedGroup.allMessages || [];
      setMessages(newMessages);
    }
  }, [selectedContact, selectedGroup]);

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

    return (
      <View style={[styles.messageContainer, isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={{ fontSize: 12, textAlign: 'right' }}>{item.fromUsername}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  const loadMoreMessages = () => {
    setVisibleMessages((prevVisibleMessages) => prevVisibleMessages + 10);
  };

  function backToContacts(){
    navigation.navigate('Chat Privado')
    setSelectedContact(null)
  };
   function backToGroups(){
    setSelectedGroup(null)
    navigation.navigate('Chat Grupo')
  };

  return (
    <View style={{ flex: 1,width:"100%" }}>
      
      {selectedGroup && (
        <View style={styles.groupNameContainer}>
          <Icon name='arrow-back-outline' type='ionicon'style={styles.icone} color={"#FFF"} onPress={backToGroups}/>
          {selectedGroup.foto ? (
            <Image source={{ uri: selectedGroup.foto }} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (
              <Image source={require('../../assets/avatar2.png')} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )
          }          
          <Text style={styles.groupNameText}>{selectedGroup.nome}</Text>
        </View>
      )}
      {selectedContact && (
        <View style={styles.contactNameContainer}>
          <Icon name='arrow-back-outline' type='ionicon'style={styles.icone} color={"#FFF"} onPress={backToContacts}/>  
          {selectedContact.foto ? (
            <Image source={{ uri: selectedContact.foto }} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (
              <Image source={require('../../assets/avatar2.png')} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )
          }
          <Text style={styles.contactNameText}>{selectedContact.nome} - {selectedContact.status}</Text>
        </View>
      )}

      {visibleMessages < messages.length && (
        <TouchableOpacity onPress={loadMoreMessages}>
          <Icon name='arrow-up-outline' type='ionicon'style={styles.icone} color={"#142a4c"}/>
        </TouchableOpacity>
      )}

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messageList}
      />
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

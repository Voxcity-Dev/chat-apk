import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { UserContext } from '../../../context/UserProvider';
import Header from './header';
import AudioMsg from './types/audio';
import FileMsg from './types/file';
import MessagesMsg from './types/messages';
import ImageMsg from './types/image';
import VideoMsg from './types/video';
import Reply from './types/reply';
import Forward from './types/forward';

export default function MessageScreen(props) {
  const { user } = useContext(UserContext);
  const [visibleMessages, setVisibleMessages] = useState(20);
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState({});
  const [scrolling, setScrolling] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    let newContact = { ...props.contato };
    setContact(newContact);
  }, [props.contato]);

  useEffect(() => {
    if (contact && visibleMessages && contact.allMessages?.length > 0) {
      let newMessages = [...contact.allMessages];
      if (newMessages.length > 0) {
        newMessages = newMessages.reverse().slice(0, visibleMessages).reverse();
      }
      setMessages(newMessages);
      
      if(!scrolling){
        setTimeout(() => {
        scrollToBottom();
        }, 1000);
      }
    }
  }, [contact]);

  const renderMessage = ({ item, index }) => {
  
    let isSentMessage;
    if (contact && props.tipo === 'private') {
      isSentMessage = item.from !== contact._id;
    } else if (contact && props.tipo === 'group') {
      isSentMessage = item.from === user._id;
    } else if (contact && props.tipo === 'att') {
      isSentMessage = item.from !== contact.telefone;
    }

    if(item.msgTypo === 'reply' || item.reply?.length > 0){
      return <Reply key={index} item={item} isSentMessage={isSentMessage} user={user} />
    }

    if(item.msgTypo === 'forwarding' || item.forwarding?.length > 0){
      return <Forward key={index} item={item} isSentMessage={isSentMessage} user={user} />
    }
  
    const messageComponents = {
      file: <FileMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      audio: <AudioMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      image: <ImageMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      video: <VideoMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      reply: <Reply key={index} item={item} isSentMessage={isSentMessage} user={user} />,
    };
  
    const defaultMessageComponent = (
      <MessagesMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />
    );
    
    return messageComponents[item.msgTypo] || defaultMessageComponent;
  };
  


  const loadMoreMessages = () => {
    let newVisibleMessages = visibleMessages + 20;
    let newMessages = [];
    newMessages = [...contact.allMessages];
    if(newMessages.length > 0 ){
      newMessages = newMessages.reverse().slice(0,newVisibleMessages).reverse()
      setMessages(newMessages);
      setVisibleMessages(newVisibleMessages);
      scrollToTop();
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      setScrolling(true)
      setTimeout(() => {
        setScrolling(false)
      }, 3000);
    }
  };
  

  return (
    <View style={{ flex: 1, width: "100%" }}>

      <Header />

      {visibleMessages <= messages.length && (
        <TouchableOpacity onPress={loadMoreMessages}>
          <Icon name='arrow-up-outline' type='ionicon' style={styles.icone} color={"#142a4c"} />
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
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
    width: "100%",
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
  }, contactNameContainer: {
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
  }, icone: {
    margin: 5,
    padding: 3,
    resizeMode: 'stretch',
    alignItems: 'center',
    color: "#FFF",
  }
});

import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, PanResponder, Animated } from 'react-native';
import { Icon } from '@rneui/themed';
import { UserContext } from '../../../context/UserProvider';
import { ReplyForwardingContext } from '../../../context/ReplyForwardingProvider';
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
  const { setReplyMessage, setForwardingMessage } = useContext(ReplyForwardingContext);
  const [visibleMessages, setVisibleMessages] = useState(20);
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState({});
  const [scrolling, setScrolling] = useState(false);
  const flatListRef = useRef(null);
  const [swipedMessageId, setSwipedMessageId] = useState(null);

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
      if (!scrolling) {
        setTimeout(() => {
          scrollToBottom();
        }, 1000);
      }
    }
  }, [contact]);

  useEffect(() => {
    if (swipedMessageId !== null) {
      const item = messages.find(message => message._id === swipedMessageId);
      if (item) {
        reply(item);
      }
    }
  }, [swipedMessageId]);


  const messagePosition = new Animated.Value(0);

  const handleSwipeRelease = (item, gestureState) => {
    if (Math.abs(gestureState.dx) > 100) {
      setSwipedMessageId(item._id);
    } else {
      setSwipedMessageId(null);
    }
  };

  const createPanResponder = (item) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          setSwipedMessageId(item._id);
        } else {
          setSwipedMessageId(null);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleSwipeRelease(item, gestureState);
      }
    }
    );

  const stopPanResponder = () => {
    setSwipedMessageId(null);
    Animated.spring(messagePosition, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }

  const renderMessage = ({ item, index }) => {
    const isSwipedMessage = item._id === swipedMessageId;
    const panResponder = createPanResponder(item);


    let isSentMessage;
    if (contact && props.tipo === 'private') {
      isSentMessage = item.from !== contact._id;
    } else if (contact && props.tipo === 'group') {
      isSentMessage = item.from === user._id;
    } else if (contact && props.tipo === 'att') {
      isSentMessage = item.from !== contact.telefone;
    }

    const messageStyles = [
      styles.messageContainer,
      isSwipedMessage && { transform: [{ translateX: messagePosition }] },
    ];

    if (item.msgTypo === 'reply' || item.reply?.length > 0) {
      return (
        <View style={isSentMessage ? styles.wrapperMessage : styles.wrapperMessage2}>
          <TouchableOpacity onPress={() => forwarding(item)} >
            <Icon name='arrow-redo' type='ionicon' size={18} style={styles.icone} color={"#142a4c"} />
          </TouchableOpacity>
          <Animated.View style={messageStyles} {...panResponder.panHandlers}>
            <Reply key={index} item={item} isSentMessage={isSentMessage} user={user} />
          </Animated.View>
        </View>
      )
    }

    if (item.msgTypo === 'forwarding' || item.forwarding?.length > 0) {
      return (
        <View style={isSentMessage ? styles.wrapperMessage : styles.wrapperMessage2}>
          <TouchableOpacity onPress={() => forwarding(item)} >
            <Icon name='arrow-redo' type='ionicon' size={18} style={styles.icone} color={"#142a4c"} />
          </TouchableOpacity>
          <Animated.View style={messageStyles} {...panResponder.panHandlers}>
            <Forward key={index} item={item} isSentMessage={isSentMessage} user={user} />
          </Animated.View>
        </View>
      )
    }

    if(item.msgTypo === 'file' || item.files?.length > 0){
      return (
        <View style={isSentMessage ? styles.wrapperMessage : styles.wrapperMessage2}>
          <TouchableOpacity onPress={() => forwarding(item)} >
            <Icon name='arrow-redo' type='ionicon' size={18} style={styles.icone} color={"#142a4c"} />
          </TouchableOpacity>
          <Animated.View style={messageStyles} {...panResponder.panHandlers}>
            <FileMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />
          </Animated.View>
        </View>
      )
    }

    const messageComponents = {
      file: <FileMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      audio: <AudioMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      image: <ImageMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      video: <VideoMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      reply: <Reply key={index} item={item} isSentMessage={isSentMessage} user={user} />,
      forwarding: <Forward key={index} item={item} isSentMessage={isSentMessage} user={user} />,
    };

    const defaultMessageComponent = (
      <MessagesMsg key={index} item={item} isSentMessage={isSentMessage} user={user} />
    );

    return (
      <View style={isSentMessage ? styles.wrapperMessage : styles.wrapperMessage2}>
        <TouchableOpacity onPress={() => forwarding(item)} >
          <Icon name='arrow-redo' type='ionicon' size={18} style={styles.icone} color={"#142a4c"} />
        </TouchableOpacity>
        <Animated.View style={messageStyles} {...panResponder.panHandlers}>
          {messageComponents[item.msgTypo] || defaultMessageComponent}
        </Animated.View>

      </View>
    );
  }

  function reply(item) {
    let newReplyMessage = { ...item }
    setReplyMessage(newReplyMessage)
    stopPanResponder()
  }

  function forwarding(item) {
    let newFMessage = { ...item }
    if (item.forwarding) newFMessage = item.forwarding
    setForwardingMessage(newFMessage)
    stopPanResponder()
  }

  const loadMoreMessages = () => {
    let newVisibleMessages = visibleMessages + 20;
    let newMessages = [];
    newMessages = [...contact.allMessages];
    if (newMessages.length > 0) {
      newMessages = newMessages.reverse().slice(0, newVisibleMessages).reverse()
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
          <Icon name='arrow-up-outline' type='ionicon' style={{ marginBottom: 15 }} color={"#142a4c"} />
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
  },
  messageList: {
    flexGrow: 1,
  },
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '100%',
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
  }, wrapperMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

  }, wrapperMessage2: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
});

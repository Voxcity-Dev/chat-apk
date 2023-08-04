import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { Video } from 'expo-av';
import HiddenButtons from '../hiddenButtons';

export default function FileMsg(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const replyCor = props.isSentMessage ? '#DCF8C6' : '#EDEDED';
  const videoRef = useRef(null);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }

    setIsPlaying(!isPlaying);
  };

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
    } else if (timeDiff >= 24 * 60 * 60 * 1000) {
      // Já passou mais de 24 horas
      return `${"    "}Ontem`;
    } else {
      return `${"     "}${hours}:${minutes}`;
    }
  }

  function showButtons() {
    setShowOptions(!showOptions);
  }

  return (
    <TouchableOpacity style={{width:"100%"}} onPress={showButtons}>
      <View
        key={props.index}
        style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage, props.isReply ? styles.replyMessages : '']}>
        <Text style={{ fontSize: 12, textAlign: 'left' }}>
          {props.isReply ? props.item.fromUsername : (props.item.from === props.user._id ? null : props.item.fromUsername)}
        </Text>
        {showOptions && (
          <HiddenButtons replyCor={replyCor} />
        )}
        {props.item.files.map((file, index) => {
          if (file.type.includes('image')) {
            return (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
                <Image source={{ uri: file.url }} style={{ width: 100, height: 100 }} />
                <Text>{file.name || file.type}</Text>
                <Text style={{ fontSize: 8, textAlign: 'right', color: 'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
              </TouchableOpacity>
            );
          } else if (file.type.includes('video')) {
            return (
              <View key={index} onPress={handlePlayPause}>
                <Video
                  ref={videoRef}
                  source={{ uri: file.url }}
                  style={{ width: 300, height: 200 }}
                  useNativeControls // Use os controles nativos do sistema (Expo AVPlayer)
                  resizeMode="contain" // Ajuste a escala do vídeo para que caiba no player
                  isLooping // Configura o vídeo para reproduzir em loop
                />
                <Text>{file.name || file.type}</Text>
                <Text style={{ fontSize: 8, textAlign: 'right', color: 'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
              </View>
            );
          } else {
            return (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Icon name="document-text-sharp" type="ionicon" size={20} style={styles.icon} />
                  <Text>{file.name || file.type}</Text>
                </View>
                <Text style={{ fontSize: 8, textAlign: 'right', color: 'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
              </TouchableOpacity>
            );
          }
        })}

      </View>
    </TouchableOpacity>
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
  replyMessages: {
    backgroundColor: '#FFF'
  },
});

import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { Video } from 'expo-av';

export default function FileMsg(props) {
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <View
      key={props.index}
      style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage]}
    >
      <Text style={{ fontSize: 12, textAlign: 'left' }}>
        {props.item.from === props.user._id ? null : props.item.fromUsername}
      </Text>
      {props.item.files.map((file, index) => {
        if (file.type.includes('image')) {
          return (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
              <Image source={{ uri: file.url }} style={{ width: 100, height: 100 }} />
              <Text>{file.name || file.type}</Text>
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
            </View>
          );
        } else {
          return (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Icon name="document-text-sharp" type="ionicon" size={20} style={styles.icon} />
                <Text>{file.name || file.type}</Text>
              </View>
            </TouchableOpacity>
          );
        }
      })}
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
});

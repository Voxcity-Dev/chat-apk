import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function VideoMsg(props) {
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
        {
            props.item.video &&
            <View onPress={handlePlayPause}>
              <Video
                ref={videoRef}
                source={{ uri: props.item.video.url }}
                style={{ width: 300, height: 200 }}
                useNativeControls // Use os controles nativos do sistema (Expo AVPlayer)
                resizeMode="contain" // Ajuste a escala do vídeo para que caiba no player
                isLooping // Configura o vídeo para reproduzir em loop
              />
              <Text>{props.item.video.name || props.item.video.type}</Text>
            </View>
        }
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

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
    } else if(timeDiff >= 24 * 60 * 60 * 1000) {
        // Já passou mais de 24 horas
        return `${"    "}Ontem`;
    } else {
    return `${"     "}${hours}:${minutes}`;
    }
  }

  return (
    <View
      key={props.index}
      style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage]}
    >
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
              <Text style={{ fontSize: 8, textAlign: 'right',color:'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
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

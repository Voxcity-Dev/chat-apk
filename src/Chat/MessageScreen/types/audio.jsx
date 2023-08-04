import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import HiddenButtons from '../hiddenButtons';

export default function AudioMsg(props) {
  const [audioURI, setAudioURI] = useState(props.item.audio.url);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const replyCor = props.isSentMessage ? '#DCF8C6' : '#EDEDED';

  function showButtons() {
    setShowOptions(!showOptions);
  }

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

  async function playAudio() {
    console.log('Playing audio...');
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioURI }, { shouldPlay: true }, onPlaybackStatusUpdate);
      setSound(sound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio', error);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      setIsPlaying(false);
      setPosition(0);
    }
  }

  async function stopAudio() {
    console.log('Stopping audio...');
    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to stop audio', error);
    }
  }

  function onSeekSliderValueChange(value) {
    if (sound) {
      sound.setPositionAsync(value);
    }
  }

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <TouchableOpacity style={{ width: '100%' }} onPress={showButtons}>
      <View key={props.index} style={[styles.messageContainer, props.isSentMessage ? styles.sentMessage : styles.receivedMessage, props.isReply ? styles.replyMessages : '']}>
        {showOptions && (
          <HiddenButtons replyCor={replyCor} />
        )}
        <Text style={{ fontSize: 12, textAlign: 'left' }}>{props.item.from === props.user._id ? null : props.item.fromUsername}</Text>
        {audioURI ? (
          <>
            <View style={styles.audioControls}>
              <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}>
                <Icon name={isPlaying ? 'pause-sharp' : 'play-sharp'} type="ionicon" size={20} color={"#142a4c"} style={styles.icon} />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onValueChange={onSeekSliderValueChange}
                thumbTintColor="#9ac31c"
                minimumTrackTintColor="#9ac31c"
                maximumTrackTintColor="#142a4c"
              />
              <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
            </View>
            <Text style={{ fontSize: 8, textAlign: 'right', color: 'gray' }}>{formatTimestamp(props.item.createdAt)}</Text>
          </>
        ) : null}
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
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 8,
  },
  slider: {
    height: 20,
    width: '50%',
  },
  timeText: {
    fontSize: 8,
    textAlign: 'right',
  },
  replyMessages: {
    backgroundColor: '#FFF'
  },
});

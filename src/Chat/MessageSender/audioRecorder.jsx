import React, { useState, useContext, useEffect } from 'react';
import { View,  TouchableOpacity, StyleSheet,Pressable } from 'react-native';
import { Icon } from '@rneui/themed';
import { Audio } from 'expo-av';

export default function AudioRecorder(props) {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function startRecording() {
    try {
      console.log('Requesting permissions...');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording...');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    console.log('Recording stopped and stored at', uri);
    props.setAudio(uri);
  }

  async function playAudio() {
    console.log('Playing audio...');
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: props.audio });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play audio', error);
    }
  }

  async function stopAudio() {
    console.log('Stopping audio...');
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  }

  function deleteAudio() {
    if (props.audio) {
      props.setAudio(null);
      setIsPlaying(false);
    }
  }

  function renderButtons() {
    if (props.audio && !isPlaying) {
      return (
        <View style={styles.playStopButtons}>
          <TouchableOpacity title="Play Audio" onPress={playAudio}>
            <Icon name="play-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </TouchableOpacity>
          <TouchableOpacity title="Delete Audio" onPress={deleteAudio}>
            <Icon name="trash-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </TouchableOpacity>
        </View>
      );
    } else if (props.audio && isPlaying) {
      return (
        <View style={styles.playStopButtons}>
          <TouchableOpacity title="Play Audio" onPress={playAudio}>
            <Icon name="play-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </TouchableOpacity>
          <TouchableOpacity title="Stop Audio" onPress={stopAudio}>
            <Icon name="pause-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </TouchableOpacity>
          <TouchableOpacity title="Delete Audio" onPress={deleteAudio}>
            <Icon name="trash-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  return (
    <View style={styles.container}>
      <Pressable title="Recording Audio" onPressIn={startRecording} onPressOut={stopRecording}>
        <Icon name={recording ? 'pause-sharp' : 'mic-sharp'} type="ionicon" size={25} color={'#9ac31c'} />
      </Pressable>

      {props.audio && renderButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  playStopButtons: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
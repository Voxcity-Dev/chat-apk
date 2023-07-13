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

   return (
    <View style={styles.container}>
      <Pressable title="Recording Audio" onPressIn={startRecording} onPressOut={stopRecording}>
        <Icon name={recording ? 'pause-sharp' : 'mic-sharp'} type="ionicon" size={25} color={'#9ac31c'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  playStopButtons: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    width: 100,
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
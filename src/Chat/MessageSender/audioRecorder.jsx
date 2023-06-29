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

  return (
    <>
        <Pressable title="recording Audio" onPressIn={startRecording} onPressOut={stopRecording} >
          <Icon name={recording ? 'pause-sharp' : 'mic-sharp' } type="ionicon" size={25} color={'#9ac31c'} />
        </Pressable>

        {props.audio && !isPlaying ? (
        <View style={styles.playStopButtons}>
            <TouchableOpacity title="Play Audio" onPress={playAudio}>
                <Icon name="play-sharp" type="ionicon" size={25} color={'#9ac31c'} />
            </TouchableOpacity>
            <TouchableOpacity title="Delete Audio" onPress={deleteAudio}>
                <Icon name="trash-sharp" type="ionicon" size={25} color={'#9ac31c'} />
            </TouchableOpacity>
        </View>
        ) : props.audio && isPlaying ? (
            <View style={styles.playStopButtons}>
                <TouchableOpacity title="Play Audio" onPress={playAudio}>
                    <Icon name="play-sharp" type="ionicon" size={25} color={'#9ac31c'} />
                </TouchableOpacity>
                <TouchableOpacity  title="Stop Audio" onPress={stopAudio}>
                    <Icon name="pause-sharp" type="ionicon" size={25} color={'#9ac31c'} />
                </TouchableOpacity>
                <TouchableOpacity title="Delete Audio" onPress={deleteAudio}>
                    <Icon name="trash-sharp" type="ionicon" size={25} color={'#9ac31c'} />
                </TouchableOpacity>
            </View>
        ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  textInput: {
    paddingHorizontal: 10,
    height: 40,
    width: '75%',
    borderColor: '#142a4c',
    borderTopWidth: 1,
  },
  messageList: {
    flexGrow: 1,
  },
  iconsView: {
    width: '25%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#142a4c',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  iconsStyle: {
    marginHorizontal: 5,
  },
  playStopButtons: {
    position: 'absolute',
    bottom: 40,
    width: '120%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142a4c',
    display: 'flex',
    justifyContent: 'center',
  },
});

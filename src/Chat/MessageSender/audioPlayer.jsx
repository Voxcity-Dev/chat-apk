import React, { useState, useContext, useEffect } from 'react';
import { View,  TouchableOpacity, StyleSheet,Pressable } from 'react-native';
import { Icon } from '@rneui/themed';
import { Audio } from 'expo-av';

export default function AudioPlayer(props) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        {renderButtons()}
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
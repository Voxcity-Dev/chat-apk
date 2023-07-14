import React, { useState } from 'react';
import { View,  TouchableOpacity, StyleSheet,Text} from 'react-native';
import { Icon } from '@rneui/themed';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function AudioPlayer(props) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function playAudio() {
    console.log('Playing audio...');
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: props.audio }, { shouldPlay: true }, onPlaybackStatusUpdate);
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

    <View style={styles.container}>
        {props.audio && (
          <>
            {isPlaying ? (
                <TouchableOpacity onPress={stopAudio} >
                  <Icon name="stop" type="ionicon" size={25} color={'#9ac31c'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={playAudio} >
                  <Icon name="play" type="ionicon" size={25} color={'#9ac31c'} />
                </TouchableOpacity>
              )
            }
      
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
            <TouchableOpacity title="Delete Audio" onPress={deleteAudio} style={{marginLeft:50}}>
              <Icon name="trash-sharp" type="ionicon" size={25} color={'#9ac31c'} />
            </TouchableOpacity>
          </>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',

  },
  playStopButtons: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});
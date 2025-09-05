import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Record() {
  // State variables
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  const [recordedData, setRecordedData] = useState([]);

  // Effect hook to request audio recording permission and load recordings on component mount
  useEffect(() => {
    // Request audio recording permission on component mount
    Permissions.askAsync(Permissions.AUDIO_RECORDING).then((status) => {
      if (status.status !== 'granted') {
        alert('Permission to access microphone denied');
      }
    });

    // Add a navigation event listener
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecordings();
    });

    return unsubscribe; // Cleanup the event listener on component unmount
  }, [navigation]);

  // Function to start audio recording
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false, // Try setting to false
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);

      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Function to stop audio recording
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();

        // Save the recording and update the list of recorded data
        const newRecording = { timestamp: new Date().toISOString(), data: recording.getURI() };
        const updatedRecordings = [...recordedData, newRecording];

        await AsyncStorage.setItem('recordedData', JSON.stringify(updatedRecordings));
        setRecordedData(updatedRecordings);

        // Play the recorded audio immediately after stopping recording
        playRecording(newRecording.data);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  // Function to load recorded data from AsyncStorage
  const loadRecordings = async () => {
    const savedRecordings = await AsyncStorage.getItem('recordedData');
    const recordings = savedRecordings ? JSON.parse(savedRecordings) : [];
    setRecordedData(recordings);
  };

  // Function to delete recorded data at a specific index
  const deleteRecordedData = async (index) => {
    try {
      const updatedRecordings = [...recordedData];
      updatedRecordings.splice(index, 1);
      setRecordedData(updatedRecordings);

      await AsyncStorage.setItem('recordedData', JSON.stringify(updatedRecordings));
    } catch (err) {
      console.error('Failed to delete recording', err);
    }
  };

  // Function to play a recorded audio
  const playRecording = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });

      await sound.playAsync();

      setIsPlaying(true);

      // Set a playback status update listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  // Function to render a button with text and optional image
  const renderButton = (title, onPress, disabled, imageSource) => (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
      {imageSource && (
        <Image source={imageSource} style={[styles.buttonImage, disabled && styles.disabledButtonImage]} />
      )}
    </TouchableOpacity>
  );

  // UI rendering
  return (
    <ImageBackground style={[styles.container, styles.backgroundImage]} source={require('./this.gif')}>
      <Image source={require('./oo.jpg')} style={styles.titleStyle} />
      <View style={styles.columnContainer}>
        {/* Render Record button */}
        {renderButton('Record', startRecording, isRecording || isPlaying, require('./PINKR.png'))}
        {/* Render Pause button */}
        {renderButton('Pause', stopRecording, !isRecording || isPlaying, require('./pause.jpg'))}
        {/* Render Load Recordings button */}
        <TouchableOpacity style={styles.button} onPress={() => loadRecordings()}>
          <Text style={styles.buttonText}>Loading</Text>
          <Image source={require('./load.jpg')} style={styles.buttonImage} />
        </TouchableOpacity>
        {/* Render recorded data */}
        {recordedData &&
          recordedData.map((item, index) => (
            <View key={index} style={styles.recordItem}>
              {/* Play Recording button */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playRecording(item.data)}
                disabled={isRecording || isPlaying}
              >
                <Text style={styles.buttonText}>{`Play Recording ${index + 1}`}</Text>
                <Image source={require('./rewind.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              {/* Delete Recording button */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecordedData(index)}>
                <Image source={require('./gone.gif')} style={styles.deleteButtonIcon} />
              </TouchableOpacity>
            </View>
          ))}
        {/* Next button to navigate to the Map screen */}
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Map')}>
          <Image style={styles.nextButtonImage} source={require('./new.png')} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 5,
    borderColor: 'salmon',
  },
  backgroundImage: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: 'pink',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderColor: 'purple',
    borderWidth: 1,
    flexDirection: 'row', // Align text and image in a row
  },
  buttonImage: {
    width: 30,
    height: 30,
    marginLeft: 5, // Adjust the margin as needed
  },
  deleteButtonIcon: {
    width: 40,
    height: 40,
  },
  buttonText: {
    color: 'purple',
    fontSize: 15,
  },
  nextButtonImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 100,
    marginLeft: 50,
  },
  deleteButton: {
    marginLeft: 10,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'pink',
    padding: 5,
    borderRadius: 10,
    margin: 5,
    borderColor: 'purple',
    borderWidth: 1,
  },
});

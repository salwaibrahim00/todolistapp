

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Snackbar } from 'react-native-paper';

const TodoList = () => {
  // State variables
  const [sound, setSound] = useState();
  const navigation = useNavigation();
  const [textInputValue, setTextInputValue] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [uuSnackVisible, setUUSnackVisible] = useState(false);

  // Cleanup function for sound on component unmount
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  // Function to play a sound
  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  };

  // Function to add a task to the list
  const addTask = () => {
    if (textInputValue) {
      setTaskList([...taskList, { id: Date.now(), task: textInputValue }]);
      setTextInputValue('');
    }
  };

  // Function to delete a task from the list
  const deleteTask = (taskId) => {
    const updatedTaskList = taskList.filter((task) => task.id !== taskId);
    setTaskList(updatedTaskList);
  };

  // Function to clear all tasks from the list
  const clearAllTasks = () => {
    setTaskList([]);
    playSound(require('./water.mp3'));
  };

  // Function to navigate to the next screen with tasks as parameters
  const next = () => {
    navigation.navigate('Record', { paramKey: taskList.map((task) => task.task) });
    playSound(require('./water.mp3'));
  };

  // Function to speak the entered task
  const speak = () => {
    Speech.speak(textInputValue);
  };

  // Function to show the Snackbar with a message
  const showUUSnackbar = () => {
    setUUSnackVisible(true);

    // Automatically hide the Snackbar after a delay
    setTimeout(() => {
      setUUSnackVisible(false);
    }, 3000); // Adjust the duration as needed
  };

  // Component for rendering each task item
  const TaskItem = ({ id, task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.listItem}>{task}</Text>
      <TouchableOpacity onPress={() => deleteTask(id)} style={styles.deleteButton}>
        <Image source={require('./gone.gif')} style={styles.deleteButtonIcon} />
      </TouchableOpacity>
    </View>
  );

  // UI rendering
  return (
    <ImageBackground source={require('./this.gif')} style={styles.container}>
      {/* Title and Snackbar */}
      <TouchableOpacity onPress={() => showUUSnackbar()}>
        <Image source={require('./uu.png')} style={styles.titleStyle} />
      </TouchableOpacity>
      <Snackbar
        visible={uuSnackVisible}
        onDismiss={() => setUUSnackVisible(false)}
        style={{ backgroundColor: 'salmon', borderRadius: 10, borderWidth: 6, borderColor: 'pink' }}
      >
        Enter your tasks of the day and be organized
      </Snackbar>

      {/* Input for new tasks */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInputStyle}
          placeholder="Type a task here"
          value={textInputValue}
          onChangeText={(text) => setTextInputValue(text)}
        />
        {/* Button to speak the entered task */}
        <TouchableOpacity activeOpacity={0.6} onPress={speak} style={styles.speakButton}>
          <Image source={require('./speak.jpg')} style={styles.speakButtonIcon} />
        </TouchableOpacity>
      </View>

      {/* Button to add a new task */}
      <TouchableOpacity activeOpacity={0.7} onPress={addTask} style={styles.floatingButton}>
        <Image source={require('./yy.jpg')} style={styles.floatingButtonStyle} />
      </TouchableOpacity>

      {/* List of tasks */}
      <FlatList
        data={taskList}
        renderItem={({ item }) => <TaskItem id={item.id} task={item.task} />}
        keyExtractor={(item) => item.id.toString(require('./pink.jpg'))}
      />

      {/* Buttons to clear all tasks and navigate to the next screen */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={clearAllTasks} style={styles.clearAllButton}>
          <Image source={require('./R.png')} style={styles.clearAllButton} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={next} style={styles.nextButton}>
          <Image source={require('./new.png')} style={styles.clearAllButton} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
    borderWidth: 5,
    borderColor: 'salmon',
  },
  
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 10,
    width:100,
    height:100,
  },
  textInputStyle: {
    flex: 1,
    height: 30,
    borderWidth: 2,
    borderColor: 'brown',
    marginVertical: 10,
    paddingHorizontal: 5,
    color: 'brown',
     borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  taskContainer: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonIcon: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  floatingButton: {
    padding: 10,
    borderRadius: 50,
  },
  floatingButtonStyle: {
    width: 30,
    height: 30,
    marginLeft:305,
  },
  clearAllButton: {
    padding: 5,
    borderRadius: 5,
    height: 30,
    width: 30,
    marginLeft:70,
    marginBottom:80,
  },
  nextButton: {
    padding: 8,
    borderRadius: 5,
    height: 40,
  },
 

  listItem: {
    color: 'purple',
    height: 30,
    borderWidth: 2,
    borderColor: 'brown',
    marginVertical: 10,
    paddingHorizontal: 5,
     borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    
  },
  speakButton: {
    marginLeft: 10,
    width: 30,
    height: 30,
  },
  speakButtonIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default TodoList;

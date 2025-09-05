import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Snackbar, Button } from 'react-native-paper';

export default function Remindmy() {
  // Navigation hook for navigation actions
  const navigation = useNavigation();
  // State variables
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [sound, setSound] = useState();

  // Cleanup function for sound on component unmount
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  // Form validation effect
  useEffect(() => {
    const validateForm = () => {
      let errors = {};

      if (!date) {
        errors.date = 'No date input';
      } else if (!isValidDate(date)) {
        errors.date = 'Invalid date format (MM/DD/YYYY)';
      }

      setErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
    };

    validateForm();
  }, [date]);

  // Function to check if the date is in a valid format
  const isValidDate = (inputDate) => {
    const [month, day, year] = inputDate.split('/').map(Number);

    return (
      !isNaN(month) &&
      !isNaN(day) &&
      !isNaN(year) &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31 &&
      year >= 1000 &&
      year <= 9999
    );
  };

  // Function to play a sound
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('./water.mp3'));
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Function called when the menu button is pressed
  const onMenuPress = () => {
    setIsMenuVisible(true);
  };

  // Function to handle category selection
  const selectCategory = async (category) => {
    setIsMenuVisible(false);

    if (isFormValid) {
      await playSound();

      if (category === 'Category 1') {
        navigation.navigate('TodoList', { paramKey: date });
      } else if (category === 'Category 2') {
        navigation.navigate('Record', { paramKey: date });
      } else if (category === 'Category 3') {
        navigation.navigate('Calendar', { selectedDate: date });
      }
    }
  };

  // UI rendering
  return (
    <View style={styles.container}>
      {/* Background image */}
      <ImageBackground style={styles.backgroundImage} source={require('./this.gif')}>
        <View style={styles.columnContainer}>
          {/* Menu button */}
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Image style={styles.overlayImage} source={require('./S.jpg')} />
          </TouchableOpacity>

          {/* Image overlay */}
          <Image style={styles.overlay2Image} source={require('./cool.gif')} />

          {/* Form input */}
          <View style={styles.textBox}>
            <TextInput
              placeholder="Enter a valid date (MM/DD/YYYY)"
              value={date}
              onChangeText={(text) => setDate(text)}
              style={styles.textInput}
            />

            {/* Button to trigger category selection */}
            <TouchableOpacity
              style={[styles.buttonStyle, !isFormValid && styles.disabledButton]}
              onPress={() => selectCategory('Category 1')}
              disabled={!isFormValid}
            >
              <View style={styles.loginContainer}>
                <Text style={styles.buttonText}>Login In</Text>
                <View style={styles.loginContent}>
                  <TouchableOpacity activeOpacity={0.6} style={styles.loginImage}>
                    <Image source={require('./login.jpg')} style={styles.Button} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Display date input error */}
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

            {/* Button to show snack bar */}
            <Button mode="contained" onPress={() => setSnackVisible(!snackVisible)}>
              Press
            </Button>
          </View>

          {/* Snack bar for displaying messages */}
          <Snackbar
            visible={snackVisible}
            onDismiss={() => setSnackVisible(false)}
            action={{
              label: 'OK',
              onPress: () => {
                console.log('Snackbar button pressed');
                setSnackVisible(false);
              },
              color: 'white',
            }}
            style={{ backgroundColor: 'salmon', borderRadius: 10, borderWidth: 6, borderColor: 'pink' }}
          >
            Enter a valid date and Enjoy Remindmy
          </Snackbar>
        </View>
      </ImageBackground>

      {/* Category menu */}
      {isMenuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => selectCategory('Category 1')} style={styles.menuItem}>
            <Text style={{ color: 'purple' }}>TodoList</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectCategory('Category 2')} style={styles.menuItem}>
            <Text style={{ color: 'purple' }}>Record</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectCategory('Category 3')} style={styles.menuItem}>
            <Text style={{ color: 'purple' }}>Map</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'salmon',
    width: '100%',
    height: '100%',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left:337,
   
  },
  overlayImage: {
    width: 30,
    height: 30,
  },
  overlay2Image: {
    width: 100,
    height: 150,
    marginLeft: 10,
    bottom:50,
    
  },
  
  textInput: {
    height: 40,
    borderColor: 'purple',
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
    width: 200,
    color: 'red',
    
  },
  buttonStyle: {
    backgroundColor: 'pink',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 50,
    width: 120,  
    height: 30,
    alignSelf: 'center',
    borderColor: 'brown',
    flexDirection: 'row',
    alignItems: 'center',  
 
  },
  menuContainer: {
    position: 'absolute',
    top: 20,
    right: 110,
    backgroundColor: 'salmon',
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  Button: {
    height: 30,
    width: 30,
    marginRight: 100,
    marginBottom: 20,
  },
  menuItem: {
    padding: 5,
    borderBottomColor: 'pink',
    borderBottomWidth: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  loginImage: {
    marginRight: 10,
    marginTop:15,
  },
  errorText: {
    color: 'purple',
    marginTop: 5,
  },
  buttonText: {
    color: 'purple',
    alignSelf: 'center',
    marginLeft: 100,
    flexDirection: 'row',
  },
  
});

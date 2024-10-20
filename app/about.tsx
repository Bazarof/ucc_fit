import { useRef, useEffect } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimatedSplashScreen(){
const animation = useRef<LottieView>(null);

  return (
    <View style={styles.animationContainer}>

      <Text style={styles.nameContainer}>
        UCC
      </Text>
      <Text style={styles.title}>
        Fit
      </Text>

      <LottieView
        autoPlay
        loop={false}
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#eee',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/animations/Animation - 1729146201385.json')}
      />
      
      {
        /*
        <View style={styles.buttonContainer}>

        <Button
          title="Restart Animation"
          onPress={() => {
            animation.current?.reset();
            animation.current?.play();
          }}
        />
      </View>
        */
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
  nameContainer: {
    color: '#007faf',
    fontSize:95 
  },
  title: {
    fontWeight: 'bold',
    color: '#525252',
    fontSize: 80 
  }
});